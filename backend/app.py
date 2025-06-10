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
mongo_client = pymongo.MongoClient(
    MONGO_URI,
    tls=True,
    tlsCAFile=certifi.where()
)
db = mongo_client["accessibility_analyzer"]
scans_collection = db["scans"]

# URL validation function
def validate_url(url):
    """Validate and format URL"""
    try:
        url = url.strip()
        
        # Add protocol if missing
        if not url.startswith(('http://', 'https://')):
            url = f"https://{url}"
        
        # Parse URL to validate
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

# ------------------ Accessibility Scan ------------------
@app.route('/api/scan', methods=['POST'])
def scan_url():
    try:
        data = request.get_json()
        if not data or not data.get('url'):
            return jsonify({"error": "URL is required"}), 400

        raw_url = data.get('url')
        
        # Validate and format URL
        url, error = validate_url(raw_url)
        if error:
            return jsonify({"error": error}), 400

        print(f"Starting scan for URL: {url}")

        # Run scan
        scan_results = run_accessibility_scan(url)

        scan_id = str(uuid.uuid4())
        scan_document = {
            "id": scan_id,
            "url": url,
            "original_url": raw_url,  # Keep original input
            "date": datetime.now(),
            "results": scan_results,
            "status": "completed"
        }

        result = scans_collection.insert_one(scan_document)
        print(f"Scan saved with ID: {scan_id}, MongoDB _id: {result.inserted_id}")

        return jsonify({
            "id": scan_id,
            "scanId": scan_id,  # <-- Add this line for frontend compatibility
            "_id": str(result.inserted_id),
            "url": url,
            "original_url": raw_url,      # The original input URL (before normalization)
            "date": datetime.now().isoformat(),  # Date/time when the scan was performed
            "message": "Scan completed successfully",
            "results": {
                "score": scan_results['score'],
                "metrics": {
                    "performance": scan_results['metrics']['performance'],
                    "accessibility": scan_results['metrics']['accessibility'],
                    "bestPractices": scan_results['metrics']['bestPractices'],
                    "seo": scan_results['metrics']['seo']
                },
                "issues": scan_results['issues'],
                "issuesBySeverity": scan_results['issuesBySeverity'],
                "scanTime": scan_results['scanTime'],
                "url": url
            },
            "status": "completed"
        }), 200

    except Exception as e:
        print(f"Scan error: {str(e)}")
        return jsonify({"error": f"Scan failed: {str(e)}"}), 500

# ------------------ Get Report by ID ------------------
@app.route('/api/reports/<path:identifier>', methods=['GET'])
def get_report(identifier):
    try:
        print(f"Received identifier: {identifier}")
        
        # Check if it's URL or scan_id
        if identifier.startswith('http'):
            # It's a URL, find by URL
            decoded_url = unquote(identifier)
            print(f"Decoded URL: {decoded_url}")
            scan = scans_collection.find_one({"url": decoded_url})
        else:
            # It's a scan_id
            print(f"Looking for scan_id: {identifier}")
            scan = scans_collection.find_one({"id": identifier})

        if not scan:
            return jsonify({"error": "Scan not found"}), 404

        scan["_id"] = str(scan["_id"])
        return jsonify(scan), 200

    except Exception as e:
        print(f"Get report error: {str(e)}")
        return jsonify({"error": "Failed to retrieve report"}), 500

# ------------------ Get Scan Report by ID (Alternative Endpoint) ------------------
@app.route('/api/scan-report/<path:identifier>', methods=['GET'])
def get_scan_report(identifier):
    """Alternative endpoint for backward compatibility with frontend"""
    try:
        print(f"Scan-report received identifier: {identifier}")
        
        # Check if it's URL or scan_id
        if identifier.startswith('http'):
            decoded_url = unquote(identifier)
            print(f"Scan-report decoded URL: {decoded_url}")
            scan = scans_collection.find_one({"url": decoded_url})
        else:
            print(f"Scan-report looking for scan_id: {identifier}")
            scan = scans_collection.find_one({"id": identifier})

        if not scan:
            return jsonify({"error": "Scan not found"}), 404

        scan["_id"] = str(scan["_id"])
        return jsonify(scan), 200

    except Exception as e:
        print(f"Get scan report error: {str(e)}")
        return jsonify({"error": "Failed to retrieve scan report"}), 500

# ------------------ Get All Reports ------------------
@app.route('/api/reports', methods=['GET'])
def get_reports():
    try:
        limit = int(request.args.get('limit', 10))
        skip = int(request.args.get('skip', 0))

        # Validate limits
        limit = min(limit, 100)  # Max 100 records
        skip = max(skip, 0)      # No negative skip

        scans = list(scans_collection.find()
                    .sort("date", -1)
                    .skip(skip)
                    .limit(limit))
        
        for scan in scans:
            scan["_id"] = str(scan["_id"])

        return jsonify(scans), 200

    except Exception as e:
        print(f"Get reports error: {str(e)}")
        return jsonify({"error": "Failed to retrieve reports"}), 500

# ------------------ Get Recent Scans ------------------
@app.route('/api/recent-scans', methods=['GET'])
def recent_scans():
    try:
        limit = int(request.args.get('limit', 5))
        limit = min(limit, 20)  # Max 20 records
        
        scans = list(scans_collection.find()
                    .sort("date", -1)
                    .limit(limit))
        
        recent = []
        for scan in scans:
            recent.append({
                "_id": str(scan["_id"]),           # MongoDB ObjectId as string
                "id": scan["id"],                  # Custom scan ID (UUID)
                "url": scan["url"],                # Full URL with protocol
                "displayUrl": scan["url"].replace("https://", "").replace("http://", ""), # For display
                "original_url": scan.get("original_url", scan["url"]), # Original input
                "score": scan["results"]["score"],
                "date": scan["date"],
                "status": scan.get("status", "completed")
            })
        
        return jsonify(recent), 200

    except Exception as e:
        print(f"Recent scans error: {str(e)}")
        return jsonify({"error": "Failed to retrieve recent scans"}), 500
    

    # ------------------ Delete Scans ------------------
@app.route('/api/scans/delete', methods=['DELETE'])
def delete_scans():
    try:
        data = request.get_json()
        scan_ids = data.get('ids', [])
        
        if not scan_ids:
            return jsonify({"error": "No scan IDs provided"}), 400
        
        # Delete scans by their custom ID field
        result = scans_collection.delete_many({"id": {"$in": scan_ids}})
        
        return jsonify({
            "message": f"Successfully deleted {result.deleted_count} scans",
            "deleted_count": result.deleted_count
        }), 200
        
    except Exception as e:
        print(f"Delete scans error: {str(e)}")
        return jsonify({"error": "Failed to delete scans"}), 500

# ------------------ Health Check Endpoint ------------------
@app.route('/api/health', methods=['GET'])
def health_check():
    try:
        # Test database connection
        db.command('ping')
        
        # Count total scans
        total_scans = scans_collection.count_documents({})
        
        return jsonify({
            "status": "healthy",
            "database": "connected",
            "total_scans": total_scans,
            "timestamp": datetime.now().isoformat(),
            "version": "1.0.0"
        }), 200
        
    except Exception as e:
        print(f"Health check error: {str(e)}")
        return jsonify({
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }), 500

# ------------------ Helper Functions for Processing Results ------------------
def process_axe_results(axe_results):
    """Process axe-core accessibility violation results"""
    issues = []
    
    if not isinstance(axe_results, dict):
        return issues
        
    violations = axe_results.get('violations', [])
    
    for violation in violations:
        if not isinstance(violation, dict):
            continue
            
        issue = {
            'id': violation.get('id', 'unknown'),
            'title': violation.get('help', 'Unknown issue'),
            'description': violation.get('description', 'No description available'),
            'impact': violation.get('impact', 'unknown'),
            'wcagCriteria': violation.get('tags', []),
            'affectedElements': [],
            'recommendation': violation.get('helpUrl', '')
        }
        
        # Process affected elements
        nodes = violation.get('nodes', [])
        for node in nodes:
            if isinstance(node, dict) and 'html' in node:
                issue['affectedElements'].append(node['html'])
        
        issues.append(issue)
    
    return issues

def count_issues_by_severity(axe_results):
    """Count accessibility issues by severity level"""
    counts = {
        'critical': 0,
        'serious': 0,
        'moderate': 0,
        'minor': 0
    }
    
    if not isinstance(axe_results, dict):
        return counts
        
    violations = axe_results.get('violations', [])
    
    for violation in violations:
        if isinstance(violation, dict):
            impact = violation.get('impact', 'unknown')
            if impact in counts:
                counts[impact] += 1
            elif impact == 'critical':
                counts['critical'] += 1
    
    return counts

# ------------------ Subprocess: Run scan_service.js ------------------
def run_accessibility_scan(url):
    try:
        print(f"Running accessibility scan for: {url}")
        
        # Check if scan_service.js exists
        if not os.path.exists('scan_service.js'):
            raise Exception("scan_service.js not found")

        # Create subprocess without timeout parameter
        process = subprocess.Popen(
            ['node', 'scan_service.js', url],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        
        # Use timeout with communicate() method
        try:
            stdout, stderr = process.communicate(timeout=300)  # 5 minute timeout
        except subprocess.TimeoutExpired:
            process.kill()
            stdout, stderr = process.communicate()
            raise Exception("Scan timed out - URL may be unresponsive")

        if process.returncode != 0:
            error_msg = stderr.decode() if stderr else "Unknown scan error"
            print(f"Scan subprocess error: {error_msg}")
            raise Exception(f"Scan failed: {error_msg}")

        if not stdout:
            raise Exception("No scan results returned")

        try:
            scan_results = json.loads(stdout.decode())
        except json.JSONDecodeError as e:
            print(f"JSON decode error: {str(e)}")
            print(f"Raw output: {stdout.decode()}")
            raise Exception("Invalid JSON response from scan service")

        # Validate scan results structure
        if not isinstance(scan_results, dict):
            raise Exception("Invalid scan results format")

        # Extract lighthouse score safely
        lighthouse_score = 0
        try:
            raw_score = scan_results['lighthouse']['categories']['accessibility'].get('score', 0)
            lighthouse_score = (raw_score if raw_score is not None else 0) * 100
        except (KeyError, TypeError, AttributeError) as e:
            print(f"Lighthouse score extraction error: {str(e)}")
            lighthouse_score = 0

        # Process results
        processed_results = {
            'score': round(lighthouse_score),
            'metrics': {
                'performance': round((scan_results.get('lighthouse', {}).get('categories', {}).get('performance', {}).get('score') or 0) * 100),
                'accessibility': round(lighthouse_score),
                'bestPractices': round((scan_results.get('lighthouse', {}).get('categories', {}).get('best-practices', {}).get('score') or 0) * 100),
                'seo': round((scan_results.get('lighthouse', {}).get('categories', {}).get('seo', {}).get('score') or 0) * 100)
            },
            'issues': process_axe_results(scan_results.get('axe', {})),
            'issuesBySeverity': count_issues_by_severity(scan_results.get('axe', {})),
            'scanTime': datetime.now().isoformat(),
            'url': url
        }

        print(f"Scan completed successfully for {url} with score: {lighthouse_score}")
        return processed_results

    except subprocess.TimeoutExpired:
        print(f"Scan timeout for URL: {url}")
        raise Exception("Scan timed out - URL may be unresponsive")
    except Exception as e:
        print(f"Scan error for {url}: {str(e)}")
        raise Exception(f"Scan failed: {str(e)}")

# ------------------ Run Server ------------------
if __name__ == '__main__':
    print("Starting Accessibility Analyzer API...")
    print(f"MongoDB URI: {MONGO_URI}")
    
    try:
        # Test database connection on startup
        db.command('ping')
        print("✅ Database connection successful")
    except Exception as e:
        print(f"❌ Database connection failed: {str(e)}")
    
    # Check if scan_service.js exists
    if os.path.exists('scan_service.js'):
        print("✅ scan_service.js found")
    else:
        print("⚠️  scan_service.js not found - scanning will fail")
    
    app.run(debug=True, host='0.0.0.0', port=5000)