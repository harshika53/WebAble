from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from datetime import datetime
import pymongo
import uuid
import os
import json
import subprocess
from dotenv import load_dotenv
import certifi
import re
from urllib.parse import urlparse, unquote


# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# MongoDB setup
MONGO_URI = os.environ.get('MONGO_URI', 'mongodb://localhost:27017/')
if MONGO_URI.startswith('mongodb+srv://') or 'mongodb.net' in MONGO_URI:
    mongo_client = pymongo.MongoClient(
        MONGO_URI,
        tls=True,
        tlsCAFile=certifi.where(),
        serverSelectionTimeoutMS=30000
    )
else:
    mongo_client = pymongo.MongoClient(MONGO_URI)
db = mongo_client["accessibility_analyzer"]
scans_collection = db["scans"]

def validate_url(url):
    try:
        url = url.strip()
        if not url.startswith(('http://', 'https://')):
            url = f"https://{url}"
        parsed = urlparse(url)
        if not parsed.netloc:
            return None, "Invalid URL format"
        return url, None
    except Exception as e:
        return None, f"URL validation error: {str(e)}"

@app.route('/')
def home():
    return jsonify({"message": "Welcome to Accessibility Analyzer API"}), 200

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(app.static_folder, 'favicon.svg', mimetype='image/svg+xml')

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "The requested resource was not found"}), 404

@app.errorhandler(Exception)
def handle_exception(e):
    print(f"Unhandled exception: {str(e)}")
    return jsonify({"error": "Internal server error occurred"}), 500

@app.route('/api/scan', methods=['POST'])
def scan_url():
    try:
        data = request.get_json()
        if not data or not data.get('url'):
            return jsonify({"error": "URL is required"}), 400

        raw_url = data.get('url')
        url, error = validate_url(raw_url)
        if error:
            return jsonify({"error": error}), 400

        print(f"Starting scan for URL: {url}")
        scan_results = run_accessibility_scan(url)

        existing_scan = scans_collection.find_one({"url": url})
        if existing_scan:
            scans_collection.update_one(
                {"url": url},
                {"$set": {"date": datetime.now(), "results": scan_results, "status": "completed"}}
            )
            scan_id = existing_scan["id"]
        else:
            scan_id = str(uuid.uuid4())
            scan_document = {
                "id": scan_id, "url": url, "original_url": raw_url,
                "date": datetime.now(), "results": scan_results, "status": "completed"
            }
            scans_collection.insert_one(scan_document)

        return jsonify({
            "id": scan_id, "scanId": scan_id, "url": url,
            "original_url": raw_url, "date": datetime.now().isoformat(),
            "message": "Scan completed successfully", "results": scan_results, "status": "completed"
        }), 200
    except Exception as e:
        print(f"Scan error: {str(e)}")
        return jsonify({"error": f"Scan failed: {str(e)}"}), 500

@app.route('/api/reports/<path:identifier>', methods=['GET'])
def get_report(identifier):
    try:
        scan = scans_collection.find_one({"url": unquote(identifier)}) if identifier.startswith('http') else scans_collection.find_one({"id": identifier})
        if not scan: return jsonify({"error": "Scan not found"}), 404
        scan["_id"] = str(scan["_id"])
        return jsonify(scan), 200
    except Exception: return jsonify({"error": "Failed to retrieve report"}), 500

@app.route('/api/reports', methods=['GET'])
def get_reports():
    try:
        limit = min(int(request.args.get('limit', 10)), 100)
        skip = max(int(request.args.get('skip', 0)), 0)
        scans = list(scans_collection.find().sort("date", -1).skip(skip).limit(limit))
        for scan in scans: scan["_id"] = str(scan["_id"])
        return jsonify(scans), 200
    except Exception: return jsonify({"error": "Failed to retrieve reports"}), 500

@app.route('/api/recent-scans', methods=['GET'])
def recent_scans():
    try:
        limit = min(int(request.args.get('limit', 5)), 20)
        scans = list(scans_collection.find().sort("date", -1).limit(limit))
        recent = [{
            "_id": str(s["_id"]), "id": s["id"], "url": s["url"],
            "displayUrl": s["url"].replace("https://", "").replace("http://", ""),
            "score": s["results"]["score"], "date": s["date"]
        } for s in scans]
        return jsonify(recent), 200
    except Exception: return jsonify({"error": "Failed to retrieve recent scans"}), 500

def run_accessibility_scan(url):
    try:
        # Create a unique ID for this specific scan instance
        scan_id = str(uuid.uuid4())
        # Use system temp directory + unique subfolder
        unique_temp = os.path.join(os.environ.get('TEMP', os.getcwd()), f'lh_{scan_id}')
        os.makedirs(unique_temp, exist_ok=True)
        
        env = os.environ.copy()
        env["TEMP"] = unique_temp
        env["TMP"] = unique_temp
        
        process = subprocess.Popen(
            ['node', 'scan_service.js', url], 
            stdout=subprocess.PIPE, 
            stderr=subprocess.PIPE,
            env=env
        )
        stdout, stderr = process.communicate(timeout=300)
        
        if process.returncode != 0:
            raise Exception(stderr.decode())
        
        return json.loads(stdout.decode())
    except Exception as e:
        raise Exception(f"Scan failed: {str(e)}")     
        
        scan_results = json.loads(stdout.decode())
        
        # Calculate scores (standardizing the logic)
        lh = scan_results.get('lighthouse', {})
        cats = lh.get('categories', {})
        
        return {
            'score': round(cats.get('accessibility', {}).get('score', 0) * 100),
            'metrics': {
                'performance': round(cats.get('performance', {}).get('score', 0) * 100),
                'accessibility': round(cats.get('accessibility', {}).get('score', 0) * 100),
                'bestPractices': round(cats.get('best-practices', {}).get('score', 0) * 100),
                'seo': round(cats.get('seo', {}).get('score', 0) * 100)
            },
            'issues': process_axe_results(scan_results.get('axe', {})),
            'issuesBySeverity': count_issues_by_severity(scan_results.get('axe', {})),
            'scanTime': datetime.now().isoformat()
        }
    except Exception as e:
        raise Exception(f"Scan failed: {str(e)}")

def process_axe_results(axe_results):
    issues = []
    if not isinstance(axe_results, dict): return issues
    for v in axe_results.get('violations', []):
        issues.append({
            'id': v.get('id'), 'title': v.get('help'), 'impact': v.get('impact'),
            'affectedElements': [n.get('html') for n in v.get('nodes', []) if 'html' in n]
        })
    return issues

def count_issues_by_severity(axe_results):
    counts = {'critical': 0, 'serious': 0, 'moderate': 0, 'minor': 0}
    if not isinstance(axe_results, dict): return counts
    for v in axe_results.get('violations', []):
        impact = v.get('impact')
        if impact in counts: counts[impact] += 1
    return counts

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)