from flask import Flask, request, jsonify, Response
import requests
import json
import os
import pymongo
from flask_cors import CORS
from datetime import datetime
import uuid

app = Flask(__name__)
CORS(app)

# MongoDB setup (make sure to use environment variables in production)
MONGO_URI = os.environ.get('MONGO_URI', 'mongodb://localhost:27017/')
mongo_client = pymongo.MongoClient(MONGO_URI)
db = mongo_client["accessibility_analyzer"]
scans_collection = db["scans"]

# Placeholder for API keys (use environment variables in production)
LIGHTHOUSE_API_KEY = os.environ.get('LIGHTHOUSE_API_KEY', '')
AXE_CORE_API_KEY = os.environ.get('AXE_CORE_API_KEY', '')

@app.route('/api/scan', methods=['POST'])
def scan_url():
    """
    Endpoint to initiate a website accessibility scan
    """
    data = request.get_json()
    url = data.get('url')
    
    if not url:
        return jsonify({"error": "URL is required"}), 400
    
    # Ensure URL has proper format
    if not url.startswith(('http://', 'https://')):
        url = f"https://{url}"
    
    try:
        # This is a placeholder for the actual API calls to Lighthouse and axe-core
        # In a real implementation, you would call those APIs here
        scan_results = run_accessibility_scan(url)
        
        # Store results in MongoDB
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
    """
    Retrieve a specific scan report by ID
    """
    scan = scans_collection.find_one({"id": scan_id})
    
    if not scan:
        return jsonify({"error": "Scan not found"}), 404
    
    # Convert MongoDB ObjectID to string for JSON serialization
    scan["_id"] = str(scan["_id"])
    
    return jsonify(scan)

@app.route('/api/reports', methods=['GET'])
def get_reports():
    """
    Get a list of all scan reports
    """
    limit = int(request.args.get('limit', 10))
    skip = int(request.args.get('skip', 0))
    
    scans = list(scans_collection.find().sort("date", -1).skip(skip).limit(limit))
    
    # Convert MongoDB ObjectIDs to strings for JSON serialization
    for scan in scans:
        scan["_id"] = str(scan["_id"])
    
    return jsonify(scans)

def run_accessibility_scan(url):
    """
    Function to run accessibility scan using Lighthouse and axe-core
    This is a placeholder - in a real implementation, you would call the actual APIs
    """
    # Placeholder for Lighthouse API call
    # In a real implementation, you would use the Lighthouse API
    lighthouse_score = 75
    
    # Placeholder for axe-core API call
    # In a real implementation, you would use the axe-core API
    axe_results = {
        "violations": [
            {
                "id": "color-contrast",
                "impact": "serious",
                "description": "Elements must have sufficient color contrast",
                "nodes": [
                    {"html": "<button>Submit</button>", "target": [".nav-link"]}
                ]
            },
            {
                "id": "image-alt",
                "impact": "critical",
                "description": "Images must have alternate text",
                "nodes": [
                    {"html": "<img src='logo.png'>", "target": [".logo-img"]}
                ]
            }
        ]
    }
    
    # Process and format the results
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
    """
    Process axe-core violations into a more usable format
    """
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
    """
    Map violation ID to relevant WCAG criteria
    """
    criteria_map = {
        "color-contrast": "1.4.3 Contrast (Minimum) (Level AA)",
        "image-alt": "1.1.1 Non-text Content (Level A)",
        # Add more mappings as needed
    }
    
    return criteria_map.get(violation_id, "Unknown WCAG criteria")

def get_recommendation(violation_id):
    """
    Get recommendation for fixing the violation
    """
    recommendation_map = {
        "color-contrast": "Ensure text has sufficient contrast against its background, at least 4.5:1 for normal text and 3:1 for large text.",
        "image-alt": "Add descriptive alt text to images that convey information. Use empty alt attributes for decorative images.",
        # Add more recommendations as needed
    }
    
    return recommendation_map.get(violation_id, "Fix this accessibility issue following WCAG guidelines.")

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)