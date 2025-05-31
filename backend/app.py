from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import pymongo
import uuid
import os
import json
import subprocess
from dotenv import load_dotenv
import certifi

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# MongoDB setup
MONGO_URI = os.environ.get('MONGO_URI', 'mongodb://localhost:27017/')
mongo_client = pymongo.MongoClient(
    MONGO_URI,
    tls=True,
    tlsCAFile=certifi.where()
)
db = mongo_client["accessibility_analyzer"]
scans_collection = db["scans"]
users_collection = db["users"]

@app.route('/')
def home():
    return jsonify({"message": "Welcome to Accessibility Analyzer API"}), 200

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(app.static_folder, 'favicon.svg', mimetype='image/svg+xml')

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "The requested resource was not found"}), 404

# ------------------ User Signup ------------------
@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    if users_collection.find_one({"email": email}):
        return jsonify({"error": "User already exists"}), 409

    hashed_pw = generate_password_hash(password)
    users_collection.insert_one({
        "email": email,
        "password": hashed_pw
    })

    return jsonify({"message": "User registered successfully"}), 201

# ------------------ User Signin ------------------
@app.route('/api/signin', methods=['POST'])
def signin():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = users_collection.find_one({"email": email})
    if not user or not check_password_hash(user['password'], password):
        return jsonify({"error": "Invalid credentials"}), 401

    return jsonify({"message": "Login successful", "email": email}), 200

# ------------------ Accessibility Scan ------------------
@app.route('/api/scan', methods=['POST'])
def scan_url():
    data = request.get_json()
    url = data.get('url')

    if not url:
        return jsonify({"error": "URL is required"}), 400

    if not url.startswith(('http://', 'https://')):
        url = f"https://{url}"

    try:
        # Run scan
        scan_results = run_accessibility_scan(url)

        scan_id = str(uuid.uuid4())
        scan_document = {
            "id": scan_id,
            "url": url,
            "date": datetime.now(),
            "results": scan_results
        }

        scans_collection.insert_one(scan_document)

        return jsonify({
            "id": scan_id,
            "url": url,
            "message": "Scan completed successfully",
            "results": scan_results
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ------------------ Get Report by ID ------------------
@app.route('/api/reports/<scan_id>', methods=['GET'])
def get_report(scan_id):
    scan = scans_collection.find_one({"id": scan_id})

    if not scan:
        return jsonify({"error": "Scan not found"}), 404

    scan["_id"] = str(scan["_id"])
    return jsonify(scan), 200

# ------------------ Get All Reports ------------------
@app.route('/api/reports', methods=['GET'])
def get_reports():
    limit = int(request.args.get('limit', 10))
    skip = int(request.args.get('skip', 0))

    scans = list(scans_collection.find().sort("date", -1).skip(skip).limit(limit))
    for scan in scans:
        scan["_id"] = str(scan["_id"])

    return jsonify(scans), 200

# ------------------ Subprocess: Run scan_service.js ------------------
def run_accessibility_scan(url):
    try:
        process = subprocess.Popen(
            ['node', 'scan_service.js', url],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        stdout, stderr = process.communicate()

        if process.returncode != 0:
            raise Exception(stderr.decode())

        scan_results = json.loads(stdout.decode())
        lighthouse_score = scan_results['lighthouse']['categories']['accessibility']['score'] * 100

        return {
            'score': round(lighthouse_score),
            'metrics': {
                'performance': round(scan_results['lighthouse']['categories']['performance']['score'] * 100),
                'accessibility': round(lighthouse_score),
                'bestPractices': round(scan_results['lighthouse']['categories']['best-practices']['score'] * 100),
                'seo': round(scan_results['lighthouse']['categories']['seo']['score'] * 100)
            },
            'issues': process_axe_results(scan_results['axe']),
            'issuesBySeverity': count_issues_by_severity(scan_results['axe'])
        }

    except Exception as e:
        print("Scan Error:", str(e))
        raise

def process_axe_results(axe_results):
    issues = []
    for violation in axe_results.get('violations', []):
        issues.append({
            'id': violation['id'],
            'title': violation['help'],
            'description': violation['description'],
            'impact': violation['impact'],
            'wcagCriteria': violation.get('tags', []),
            'affectedElements': [node['html'] for node in violation['nodes']],
            'recommendation': violation.get('helpUrl', '')
        })
    return issues

def count_issues_by_severity(axe_results):
    counts = {
        'critical': 0,
        'serious': 0,
        'moderate': 0,
        'minor': 0
    }
    for violation in axe_results.get('violations', []):
        impact = violation.get('impact')
        if impact in counts:
            counts[impact] += 1
    return counts

# ------------------ Run Server ------------------
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
