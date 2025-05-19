import { useNavigate } from 'react-router-dom';
import { ExternalLink, Clock, ArrowUpRight, ChevronRight } from 'lucide-react';
import { formatDistanceToNow } from "date-fns";


// Mock data for recent scans
const recentScans = [
  {
    id: 'scan123',
    url: 'example.com',
    date: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    score: 86
  },
  {
    id: 'scan456',
    url: 'accessibility-demo.org',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    score: 68
  },
  {
    id: 'scan789',
    url: 'web-standards.net',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    score: 92
  }
];

const RecentScansSection = () => {
  const navigate = useNavigate();
  
  // Get score color based on value
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-success-500 bg-success-50';
    if (score >= 75) return 'text-primary-500 bg-primary-50';
    if (score >= 50) return 'text-warning-500 bg-warning-50';
    return 'text-error-500 bg-error-50';
  };

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Recent Scans
        </h2>
        <button 
          className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center"
          onClick={() => navigate('/history')}
        >
          View all <ChevronRight className="h-4 w-4 ml-1" />
        </button>
      </div>
      
      {recentScans.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <ul className="divide-y divide-gray-200">
            {recentScans.map((scan) => (
              <li key={scan.id}>
                <button
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  onClick={() => navigate(`/report/${scan.id}`)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                      <ExternalLink className="h-5 w-5 text-gray-500" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium text-gray-900">{scan.url}</span>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        {formatDistanceToNow(scan.date, { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className={`flex items-center justify-center rounded-full ${getScoreColor(scan.score)} h-8 w-8 mr-2`}>
                      <span className="text-xs font-medium">{scan.score}</span>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-gray-400" />
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white p-6 text-center">
          <p className="text-gray-500">No recent scans found. Start by analyzing a website.</p>
          <button 
            className="mt-4 btn btn-primary"
            onClick={() => navigate('/scan')}
          >
            New Scan
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentScansSection;