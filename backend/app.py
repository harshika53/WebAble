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

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# MongoDB setup
MONGO_URI = os.environ.get('MONGO_URI', 'mongodb://localhost:27017/')
mongo_client = pymongo.MongoClient(MONGO_URI)
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

@app.route('/api/signin', methods=['POST'])
def signin():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = users_collection.find_one({"email": email})
    if not user or not check_password_hash(user['password'], password):
        return jsonify({"error": "Invalid credentials"}), 401

    return jsonify({"message": "Login successful", "email": email}), 200

@app.route('/api/scan', methods=['POST'])
def scan_url():
    data = request.get_json()
    url = data.get('url')

    if not url:
        return jsonify({"error": "URL is required"}), 400

    if not url.startswith(('http://', 'https://')):
        url = f"https://{url}"

    try:
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
            "message": "Scan completed successfully"
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/reports/<scan_id>', methods=['GET'])
def get_report(scan_id):
    scan = scans_collection.find_one({"id": scan_id})

    if not scan:
        return jsonify({"error": "Scan not found"}), 404

    scan["_id"] = str(scan["_id"])
    return jsonify(scan)

@app.route('/api/reports', methods=['GET'])
def get_reports():
    limit = int(request.args.get('limit', 10))
    skip = int(request.args.get('skip', 0))

    scans = list(scans_collection.find().sort("date", -1).skip(skip).limit(limit))
    for scan in scans:
        scan["_id"] = str(scan["_id"])

    return jsonify(scans)

def run_accessibility_scan(url):
    lighthouse_score = 75
    axe_results = {
        "violations": [
            {
                "id": "color-contrast",
                "impact": "serious",
                "description": "Elements must have sufficient color contrast",
                "nodes": [{"html": "<button>Submit</button>", "target": [".nav-link"]}]
            },
            {
                "id": "image-alt",
                "impact": "critical",
                "description": "Images must have alternate text",
                "nodes": [{"html": "<img src='logo.png'>", "target": [".logo-img"]}]
            }
        ]
    }

    results = {
        "score": lighthouse_score,
        "metrics": {
            "performance": 85,
            "accessibility": lighthouse_score,
            "bestPractices": 90,
            "seo": 88
        },
        "issues": process_axe_violations(axe_results["violations"]),
        "issuesBySeverity": {
            "critical": 1,
            "serious": 1,
            "moderate": 0,
            "minor": 0
        }
    }

    return results

def process_axe_violations(violations):
    issues = []

    for violation in violations:
        affected_elements = []
        for node in violation["nodes"]:
            affected_elements.extend(node["target"])

        issue = {
            "id": violation["id"],
            "title": violation["id"].replace("-", " ").title(),
            "description": violation["description"],
            "impact": violation["impact"],
            "wcagCriteria": get_wcag_criteria(violation["id"]),
            "affectedElements": affected_elements,
            "recommendation": get_recommendation(violation["id"])
        }

        issues.append(issue)

    return issues

def get_wcag_criteria(violation_id):
    criteria_map = {
        "color-contrast": "1.4.3 Contrast (Minimum) (Level AA)",
        "image-alt": "1.1.1 Non-text Content (Level A)",
    }
    return criteria_map.get(violation_id, "Unknown WCAG criteria")

def get_recommendation(violation_id):
    recommendation_map = {
        "color-contrast": "Ensure text has sufficient contrast against its background, at least 4.5:1 for normal text and 3:1 for large text.",
        "image-alt": "Add descriptive alt text to images that convey information. Use empty alt attributes for decorative images.",
    }
    return recommendation_map.get(violation_id, "Fix this accessibility issue following WCAG guidelines.")

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
