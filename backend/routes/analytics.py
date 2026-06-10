from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
import os
import pymongo
import certifi

analytics_bp = Blueprint('analytics', __name__)

# MongoDB setup (matching backend/app.py)
MONGO_URI = os.environ.get('MONGO_URI', 'mongodb://localhost:27017/')
try:
    if MONGO_URI.startswith('mongodb+srv://') or 'mongodb.net' in MONGO_URI:
        mongo_client = pymongo.MongoClient(
            MONGO_URI,
            tls=True,
            tlsCAFile=certifi.where(),
            serverSelectionTimeoutMS=2000
        )
    else:
        mongo_client = pymongo.MongoClient(MONGO_URI, serverSelectionTimeoutMS=2000)
    db = mongo_client["accessibility_analyzer"]
    scans_collection = db["scans"]
except Exception as e:
    print(f"Analytics unable to connect to MongoDB initially: {str(e)}")
    scans_collection = None

# Helper to check if MongoDB is connected and responsive
def is_db_connected():
    if scans_collection is None:
        return False
    try:
        mongo_client.admin.command('ping', serverSelectionTimeoutMS=1000)
        return True
    except Exception:
        return False

# Issue Category Mapping Helper
ISSUE_CATEGORIES = {
    'color-contrast': 'Contrast',
    'image-alt': 'Text Alternatives',
    'image-redundant-alt': 'Text Alternatives',
    'input-image-alt': 'Text Alternatives',
    'role-img-alt': 'Text Alternatives',
    'html-has-lang': 'Language',
    'html-lang-valid': 'Language',
    'valid-lang': 'Language',
    'document-title': 'Page Structure',
    'landmark-one-main': 'Page Structure',
    'page-has-heading-one': 'Page Structure',
    'bypass': 'Navigation',
    'frame-title': 'Navigation',
    'link-name': 'Navigation',
    'button-name': 'Keyboard & Interactive',
    'label': 'Forms & Inputs',
    'form-field-multiple-labels': 'Forms & Inputs',
    'aria-allowed-attr': 'ARIA',
    'aria-hidden-body': 'ARIA',
    'aria-required-attr': 'ARIA',
    'aria-required-children': 'ARIA',
    'aria-required-parent': 'ARIA',
    'aria-roles': 'ARIA',
    'aria-valid-attr-value': 'ARIA',
    'aria-valid-attr': 'ARIA',
    'duplicate-id-active': 'Keyboard & Interactive',
    'duplicate-id-aria': 'ARIA',
    'duplicate-id': 'Page Structure',
    'list': 'Content Structure',
    'listitem': 'Content Structure',
}

def get_issue_category(issue_id):
    if not issue_id:
        return 'Other'
    if issue_id in ISSUE_CATEGORIES:
        return ISSUE_CATEGORIES[issue_id]
    issue_id_lower = issue_id.lower()
    if issue_id_lower.startswith('aria-') or issue_id_lower.startswith('role-'):
        return 'ARIA'
    if 'alt' in issue_id_lower:
        return 'Text Alternatives'
    if 'lang' in issue_id_lower:
        return 'Language'
    if 'table' in issue_id_lower or 'list' in issue_id_lower:
        return 'Content Structure'
    if 'label' in issue_id_lower or 'input' in issue_id_lower or 'select' in issue_id_lower or 'button' in issue_id_lower:
        return 'Forms & Inputs'
    if 'focus' in issue_id_lower or 'tabindex' in issue_id_lower or 'keyboard' in issue_id_lower:
        return 'Keyboard & Interactive'
    return 'Other'

# MOCK DATA FALLBACKS (For offline / demo support)
def get_mock_overview():
    return {
        "totalScans": 34,
        "averageScore": 81.4,
        "bestScore": 95,
        "worstScore": 58,
        "latestScore": 86,
        "improvements": 8,
        "regressions": 2,
        "isDemo": True
    }

def get_mock_trends(period):
    if period == 'monthly':
        return {
            "labels": ["Jan 2026", "Feb 2026", "Mar 2026", "Apr 2026", "May 2026", "Jun 2026"],
            "scores": [71.5, 74.0, 75.8, 79.2, 80.5, 81.4]
        }
    elif period == 'weekly':
        return {
            "labels": ["Week 20", "Week 21", "Week 22", "Week 23", "Week 24", "Week 25"],
            "scores": [76.8, 77.5, 79.0, 80.2, 80.9, 81.4]
        }
    else:  # daily
        return {
            "labels": [
                (datetime.now() - timedelta(days=6)).strftime("%Y-%m-%d"),
                (datetime.now() - timedelta(days=5)).strftime("%Y-%m-%d"),
                (datetime.now() - timedelta(days=4)).strftime("%Y-%m-%d"),
                (datetime.now() - timedelta(days=3)).strftime("%Y-%m-%d"),
                (datetime.now() - timedelta(days=2)).strftime("%Y-%m-%d"),
                (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d"),
                datetime.now().strftime("%Y-%m-%d")
            ],
            "scores": [78.2, 79.0, 78.8, 80.5, 82.0, 80.8, 81.4]
        }

def get_mock_issues():
    return {
        "recurringIssues": [
            {"id": "color-contrast", "title": "Elements must have sufficient color contrast", "count": 22, "frequency": 64.7},
            {"id": "image-alt", "title": "Images must have alternate text", "count": 15, "frequency": 44.1},
            {"id": "label", "title": "Form elements must have labels", "count": 11, "frequency": 32.4},
            {"id": "link-name", "title": "Links must have discernible text", "count": 8, "frequency": 23.5},
            {"id": "html-has-lang", "title": "<html> element must have a lang attribute", "count": 6, "frequency": 17.6}
        ],
        "distribution": [
            {"category": "Contrast", "count": 22},
            {"category": "Text Alternatives", "count": 15},
            {"category": "Forms & Inputs", "count": 11},
            {"category": "Navigation", "count": 8},
            {"category": "Language", "count": 6},
            {"category": "ARIA", "count": 4},
            {"category": "Other", "count": 3}
        ]
    }


# ================== API ENDPOINTS ==================

@analytics_bp.route('/api/analytics/overview', methods=['GET'])
def get_overview():
    if not is_db_connected():
        return jsonify(get_mock_overview()), 200

    try:
        # 1. Total, average, best, and worst score metrics
        stats_pipeline = [
            {"$match": {"status": "completed", "results.score": {"$exists": True}}},
            {"$group": {
                "_id": None,
                "totalScans": {"$sum": 1},
                "averageScore": {"$avg": "$results.score"},
                "bestScore": {"$max": "$results.score"},
                "worstScore": {"$min": "$results.score"}
            }}
        ]
        stats = list(scans_collection.aggregate(stats_pipeline))
        
        if not stats or stats[0]["totalScans"] == 0:
            return jsonify({
                "totalScans": 0,
                "averageScore": 0,
                "bestScore": 0,
                "worstScore": 0,
                "latestScore": 0,
                "improvements": 0,
                "regressions": 0,
                "isDemo": False
            }), 200

        # 2. Latest score
        latest_scan = scans_collection.find_one(
            {"status": "completed", "results.score": {"$exists": True}},
            sort=[("date", -1)]
        )
        latest_score = latest_scan["results"]["score"] if latest_scan else 0

        # 3. Improvements & Regressions calculation
        # Group chronologically sorted scans by URL, get the last 2 scores, and compare them.
        diff_pipeline = [
            {"$match": {"status": "completed", "results.score": {"$exists": True}}},
            {"$sort": {"date": 1}},
            {"$group": {
                "_id": "$url",
                "scores": {"$push": "$results.score"}
            }},
            {"$project": {
                "last_two": {"$slice": ["$scores", -2]}
            }},
            {"$project": {
                "diff": {
                    "$cond": {
                        "if": {"$eq": [{"$size": "$last_two"}, 2]},
                        "then": {"$subtract": [{"$arrayElemAt": ["$last_two", 1]}, {"$arrayElemAt": ["$last_two", 0]}]},
                        "else": 0
                    }
                }
            }},
            {"$group": {
                "_id": None,
                "improvements": {"$sum": {"$cond": [{"$gt": ["$diff", 0]}, 1, 0]}},
                "regressions": {"$sum": {"$cond": [{"$lt": ["$diff", 0]}, 1, 0]}}
            }}
        ]
        diffs = list(scans_collection.aggregate(diff_pipeline))
        improvements = diffs[0]["improvements"] if diffs else 0
        regressions = diffs[0]["regressions"] if diffs else 0

        return jsonify({
            "totalScans": stats[0]["totalScans"],
            "averageScore": round(stats[0]["averageScore"], 1),
            "bestScore": stats[0]["bestScore"],
            "worstScore": stats[0]["worstScore"],
            "latestScore": latest_score,
            "improvements": improvements,
            "regressions": regressions,
            "isDemo": False
        }), 200

    except Exception as e:
        print(f"Error in database aggregation for overview: {str(e)}")
        # Graceful fallback to mock data on query/parse exception
        return jsonify(get_mock_overview()), 200


@analytics_bp.route('/api/analytics/trends', methods=['GET'])
def get_trends():
    period = request.args.get('period', 'daily').lower()
    
    if not is_db_connected():
        return jsonify(get_mock_trends(period)), 200

    try:
        # Date string formatting based on requested period
        if period == 'monthly':
            date_format = "%Y-%m"
        elif period == 'weekly':
            date_format = "%Y-W%V"
        else:  # daily
            date_format = "%Y-%m-%d"

        trend_pipeline = [
            {"$match": {
                "status": "completed", 
                "results.score": {"$exists": True}, 
                "date": {"$exists": True}
            }},
            # Convert date field to BSON date format if it was saved as a string
            {"$project": {
                "score": "$results.score",
                "parsedDate": {
                    "$cond": {
                        "if": {"$eq": [{"$type": "$date"}, "date"]},
                        "then": "$date",
                        "else": {"$toDate": "$date"}
                    }
                }
            }},
            {"$group": {
                "_id": {"$dateToString": {"format": date_format, "date": "$parsedDate"}},
                "avgScore": {"$avg": "$score"},
                "sortDate": {"$min": "$parsedDate"}
            }},
            {"$sort": {"sortDate": 1}}
        ]
        
        trend_results = list(scans_collection.aggregate(trend_pipeline))
        labels = [r["_id"] for r in trend_results]
        scores = [round(r["avgScore"], 1) for r in trend_results]
        
        return jsonify({
            "labels": labels,
            "scores": scores
        }), 200

    except Exception as e:
        print(f"Error in database aggregation for trends: {str(e)}")
        return jsonify(get_mock_trends(period)), 200


@analytics_bp.route('/api/analytics/issues', methods=['GET'])
def get_issues():
    if not is_db_connected():
        return jsonify(get_mock_issues()), 200

    try:
        total_scans = scans_collection.count_documents({"status": "completed"}) or 1

        # 1. Top 10 Recurring issues aggregation
        recurring_pipeline = [
            {"$match": {"status": "completed", "results.issues": {"$exists": True, "$type": "array"}}},
            {"$unwind": "$results.issues"},
            {"$group": {
                "_id": "$results.issues.id",
                "title": {"$first": "$results.issues.title"},
                "count": {"$sum": 1}
            }},
            {"$sort": {"count": -1}},
            {"$limit": 10}
        ]
        recurring_results = list(scans_collection.aggregate(recurring_pipeline))

        recurring_issues = []
        for r in recurring_results:
            recurring_issues.append({
                "id": r["_id"],
                "title": r["title"] or r["_id"],
                "count": r["count"],
                "frequency": round((r["count"] / total_scans) * 100, 1)
            })

        # 2. Issue category distribution aggregation
        distribution_pipeline = [
            {"$match": {"status": "completed", "results.issues": {"$exists": True, "$type": "array"}}},
            {"$unwind": "$results.issues"},
            {"$group": {
                "_id": "$results.issues.id",
                "count": {"$sum": 1}
            }}
        ]
        dist_results = list(scans_collection.aggregate(distribution_pipeline))

        categories_map = {}
        for d in dist_results:
            cat = get_issue_category(d["_id"])
            categories_map[cat] = categories_map.get(cat, 0) + d["count"]

        # Format sorted by count descending
        distribution = [{"category": k, "count": v} for k, v in categories_map.items()]
        distribution.sort(key=lambda x: x["count"], reverse=True)

        return jsonify({
            "recurringIssues": recurring_issues,
            "distribution": distribution
        }), 200

    except Exception as e:
        print(f"Error in database aggregation for issues: {str(e)}")
        return jsonify(get_mock_issues()), 200
