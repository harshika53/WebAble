import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, 
  ExternalLink, 
  Clock, 
  ChevronRight, 
  Filter, 
  ArrowUpDown,
  Trash2
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

// Mock data for scan history
const initialScans = [
  {
    id: 'scan123',
    url: 'example.com',
    date: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    score: 86,
    issues: 6
  },
  {
    id: 'scan456',
    url: 'accessibility-demo.org',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    score: 68,
    issues: 14
  },
  {
    id: 'scan789',
    url: 'web-standards.net',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    score: 92,
    issues: 3
  },
  {
    id: 'scan101',
    url: 'design-system.io',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    score: 79,
    issues: 9
  },
  {
    id: 'scan202',
    url: 'portfolio-site.dev',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    score: 64,
    issues: 17
  },
  {
    id: 'scan303',
    url: 'tech-blog.com',
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    score: 88,
    issues: 5
  }
];

const HistoryPage = () => {
  const navigate = useNavigate();
  const [scanHistory, setScanHistory] = useState(initialScans);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'score' | 'url'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedScans, setSelectedScans] = useState<string[]>([]);
  
  // Get score color based on value
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-success-500 bg-success-50';
    if (score >= 75) return 'text-primary-500 bg-primary-50';
    if (score >= 50) return 'text-warning-500 bg-warning-50';
    return 'text-error-500 bg-error-50';
  };

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Toggle sort order
  const toggleSort = (key: 'date' | 'score' | 'url') => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('desc');
    }
  };

  // Handle scan selection
  const toggleScanSelection = (id: string) => {
    setSelectedScans(prev => 
      prev.includes(id) 
        ? prev.filter(scanId => scanId !== id)
        : [...prev, id]
    );
  };

  // Select all scans
  const toggleSelectAll = () => {
    if (selectedScans.length === filteredAndSortedScans.length) {
      setSelectedScans([]);
    } else {
      setSelectedScans(filteredAndSortedScans.map(scan => scan.id));
    }
  };

  // Delete selected scans
  const deleteSelectedScans = () => {
    setScanHistory(prev => prev.filter(scan => !selectedScans.includes(scan.id)));
    setSelectedScans([]);
  };

  // Filter scans
  const filteredScans = searchTerm
    ? scanHistory.filter(scan => 
        scan.url.toLowerCase().includes(searchTerm.toLowerCase()))
    : scanHistory;

  // Sort scans
  const filteredAndSortedScans = [...filteredScans].sort((a, b) => {
    if (sortBy === 'date') {
      return sortOrder === 'asc' 
        ? a.date.getTime() - b.date.getTime()
        : b.date.getTime() - a.date.getTime();
    } else if (sortBy === 'score') {
      return sortOrder === 'asc' 
        ? a.score - b.score
        : b.score - a.score;
    } else {
      return sortOrder === 'asc' 
        ? a.url.localeCompare(b.url)
        : b.url.localeCompare(a.url);
    }
  });

  const getSortIcon = (key: 'date' | 'score' | 'url') => {
    if (sortBy !== key) return <ArrowUpDown className="h-4 w-4 text-gray-400" />;
    return sortOrder === 'asc' 
      ? <ChevronRight className="h-4 w-4 text-gray-900 rotate-90" />
      : <ChevronRight className="h-4 w-4 text-gray-900 -rotate-90" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Scan History</h1>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/scan')}
        >
          New Scan
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="pl-10 input text-sm w-full sm:w-64"
                placeholder="Search by URL..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              {selectedScans.length > 0 && (
                <button 
                  className="btn btn-secondary text-error-600"
                  onClick={deleteSelectedScans}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete ({selectedScans.length})
                </button>
              )}
              
              <button className="btn btn-secondary">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </button>
            </div>
          </div>
        </div>
        
        {filteredAndSortedScans.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-3 text-left w-10">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                      checked={selectedScans.length === filteredAndSortedScans.length && filteredAndSortedScans.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th 
                    className="px-6 py-3 text-left cursor-pointer"
                    onClick={() => toggleSort('url')}
                  >
                    <div className="flex items-center">
                      <span>URL</span>
                      <span className="ml-1">{getSortIcon('url')}</span>
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left cursor-pointer"
                    onClick={() => toggleSort('date')}
                  >
                    <div className="flex items-center">
                      <span>Date</span>
                      <span className="ml-1">{getSortIcon('date')}</span>
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left cursor-pointer"
                    onClick={() => toggleSort('score')}
                  >
                    <div className="flex items-center">
                      <span>Score</span>
                      <span className="ml-1">{getSortIcon('score')}</span>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left">Issues</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAndSortedScans.map((scan) => (
                  <motion.tr 
                    key={scan.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                        checked={selectedScans.includes(scan.id)}
                        onChange={() => toggleScanSelection(scan.id)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <ExternalLink className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900">
                          {scan.url}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{formatDistanceToNow(scan.date, { addSuffix: true })}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`flex items-center justify-center rounded-full ${getScoreColor(scan.score)} h-8 w-8`}>
                        <span className="text-xs font-medium">{scan.score}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {scan.issues} {scan.issues === 1 ? 'issue' : 'issues'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        className="text-primary-600 hover:text-primary-800 font-medium text-sm"
                        onClick={() => navigate(`/report/${scan.id}`)}
                      >
                        View Report
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center">
            <ExternalLink className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No scans found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? `No results found for "${searchTerm}"` : "You haven't performed any scans yet."}
            </p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/scan')}
            >
              Start scanning
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;