import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ExternalLink, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  ChevronDown, 
  Download, 
  Share2, 
  Clock, 
  Printer 
} from 'lucide-react';
import AccessibilityScoreCard from '../components/AccessibilityScoreCard';

// Mock data for the report
const reportData = {
  url: 'example.com',
  date: new Date(),
  totalIssues: 15,
  score: 72,
  metrics: {
    performance: 85,
    accessibility: 72,
    bestPractices: 92,
    seo: 88
  },
  issuesBySeverity: {
    critical: 3,
    serious: 5,
    moderate: 4,
    minor: 3
  },
  issues: [
    {
      id: 'issue1',
      title: 'Images lack alternative text',
      description: '5 images on the page lack alt text, making them inaccessible to screen reader users.',
      impact: 'critical',
      wcagCriteria: '1.1.1 Non-text Content (Level A)',
      affectedElements: [
        '.hero-image', '.product-gallery img:nth-child(2)', '.product-gallery img:nth-child(3)', '.footer-logo', '.banner-img'
      ],
      recommendation: 'Add descriptive alt text to all images that convey information. Use empty alt attributes for decorative images.'
    },
    {
      id: 'issue2',
      title: 'Insufficient color contrast',
      description: 'Text elements do not have sufficient color contrast with their background, making content difficult to read for users with low vision.',
      impact: 'serious',
      wcagCriteria: '1.4.3 Contrast (Minimum) (Level AA)',
      affectedElements: [
        '.nav-link', '.cta-button', '.pricing-highlight', '.footer-link'
      ],
      recommendation: 'Ensure text has a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text.'
    },
    {
      id: 'issue3',
      title: 'Missing form labels',
      description: 'Form controls lack properly associated text labels, making it difficult for screen reader users to understand their purpose.',
      impact: 'critical',
      wcagCriteria: '3.3.2 Labels or Instructions (Level A)',
      affectedElements: [
        '#search-input', '#email-subscription', '#contact-form input[name="phone"]'
      ],
      recommendation: 'Add explicit <label> elements with for attributes that match the input IDs, or use aria-label attributes.'
    },
    {
      id: 'issue4',
      title: 'Keyboard focus not visible',
      description: 'Interactive elements lack a visible focus indicator, making it difficult for keyboard users to know which element is currently focused.',
      impact: 'serious',
      wcagCriteria: '2.4.7 Focus Visible (Level AA)',
      affectedElements: [
        '.nav-item', '.button', '.accordion-header', '.dropdown-toggle'
      ],
      recommendation: 'Ensure all interactive elements have a visible focus state using :focus CSS styles.'
    }
  ]
};

const ReportPage = () => {
  // const { id } = useParams<{ id: string }>();
  const [expandedIssues, setExpandedIssues] = useState<Record<string, boolean>>({});
  const [filterSeverity, setFilterSeverity] = useState<string | null>(null);
  
  // Initialize expandedIssues
  useEffect(() => {
    const initialExpandedState = reportData.issues.reduce((acc, issue) => {
      acc[issue.id] = false;
      return acc;
    }, {} as Record<string, boolean>);
    setExpandedIssues(initialExpandedState);
  }, []);

  const toggleIssueExpanded = (issueId: string) => {
    setExpandedIssues(prev => ({
      ...prev,
      [issueId]: !prev[issueId]
    }));
  };
  
  // Get color for severity level
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-error-600 bg-error-50 border-error-200';
      case 'serious':
        return 'text-error-600 bg-error-50 border-error-200';
      case 'moderate':
        return 'text-warning-600 bg-warning-50 border-warning-200';
      case 'minor':
        return 'text-primary-600 bg-primary-50 border-primary-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };
  
  // Get icon for severity level
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'serious':
        return <AlertTriangle className="h-5 w-5" />;
      case 'moderate':
        return <Info className="h-5 w-5" />;
      case 'minor':
        return <Info className="h-5 w-5" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };
  
  // Filter issues by severity
  const filteredIssues = filterSeverity 
    ? reportData.issues.filter(issue => issue.impact === filterSeverity)
    : reportData.issues;

  return (
    <div className="space-y-8">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
              <ExternalLink className="h-4 w-4" />
              <span>{reportData.url}</span>
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              <Clock className="h-4 w-4" />
              <span>{reportData.date.toLocaleDateString()}</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Accessibility Report</h1>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button className="btn btn-secondary">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </button>
            <button className="btn btn-secondary">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
            <button className="btn btn-secondary">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-wrap gap-y-6 gap-x-8">
              <div>
                <h3 className="text-xs text-gray-500 uppercase mb-1">Total Issues</h3>
                <p className="text-xl font-semibold text-gray-900">{reportData.totalIssues}</p>
              </div>
              
              <div>
                <h3 className="text-xs text-gray-500 uppercase mb-1">Critical</h3>
                <p className="text-xl font-semibold text-error-600">{reportData.issuesBySeverity.critical}</p>
              </div>
              
              <div>
                <h3 className="text-xs text-gray-500 uppercase mb-1">Serious</h3>
                <p className="text-xl font-semibold text-error-500">{reportData.issuesBySeverity.serious}</p>
              </div>
              
              <div>
                <h3 className="text-xs text-gray-500 uppercase mb-1">Moderate</h3>
                <p className="text-xl font-semibold text-warning-500">{reportData.issuesBySeverity.moderate}</p>
              </div>
              
              <div>
                <h3 className="text-xs text-gray-500 uppercase mb-1">Minor</h3>
                <p className="text-xl font-semibold text-primary-500">{reportData.issuesBySeverity.minor}</p>
              </div>
            </div>
          </div>
          
          <div>
            <AccessibilityScoreCard score={reportData.score} metrics={reportData.metrics} />
          </div>
        </div>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-xl font-semibold text-gray-900">Detected Issues</h2>
            
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-2">Filter:</span>
              <select 
                className="text-sm border border-gray-300 rounded-md px-3 py-1.5"
                value={filterSeverity || ''}
                onChange={(e) => setFilterSeverity(e.target.value || null)}
              >
                <option value="">All issues</option>
                <option value="critical">Critical</option>
                <option value="serious">Serious</option>
                <option value="moderate">Moderate</option>
                <option value="minor">Minor</option>
              </select>
            </div>
          </div>
        </div>
        
        {filteredIssues.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {filteredIssues.map((issue) => (
              <li key={issue.id}>
                <div className="px-6 py-4">
                  <button
                    className="w-full flex items-start justify-between text-left"
                    onClick={() => toggleIssueExpanded(issue.id)}
                  >
                    <div className="flex items-start">
                      <div className={`flex-shrink-0 ${getSeverityColor(issue.impact)} p-1.5 rounded-md mr-4`}>
                        {getSeverityIcon(issue.impact)}
                      </div>
                      <div>
                        <h3 className="text-base font-medium text-gray-900">{issue.title}</h3>
                        <p className="mt-1 text-sm text-gray-600 line-clamp-2">{issue.description}</p>
                      </div>
                    </div>
                    <ChevronDown 
                      className={`flex-shrink-0 h-5 w-5 text-gray-400 mt-1 transition-transform ${
                        expandedIssues[issue.id] ? 'transform rotate-180' : ''
                      }`} 
                    />
                  </button>
                  
                  {expandedIssues[issue.id] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 pl-12"
                    >
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">
                        <div>
                          <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">WCAG Criteria</h4>
                          <p className="text-sm text-gray-900">{issue.wcagCriteria}</p>
                        </div>
                        
                        <div>
                          <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">Impact</h4>
                          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            issue.impact === 'critical' || issue.impact === 'serious' 
                              ? 'bg-error-100 text-error-800' 
                              : issue.impact === 'moderate' 
                                ? 'bg-warning-100 text-warning-800' 
                                : 'bg-primary-100 text-primary-800'
                          }`}>
                            {issue.impact.charAt(0).toUpperCase() + issue.impact.slice(1)}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">Affected Elements</h4>
                          <div className="space-y-1">
                            {issue.affectedElements.map((element, index) => (
                              <code key={index} className="block text-xs bg-gray-100 p-1 rounded">{element}</code>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">Recommendation</h4>
                          <p className="text-sm text-gray-900">{issue.recommendation}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-6 py-12 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-success-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No issues found</h3>
            <p className="text-gray-600">
              {filterSeverity 
                ? `No ${filterSeverity} issues were detected.`
                : 'Your website passed all the accessibility tests!'}
            </p>
          </div>
        )}
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Next Steps</h2>
        
        <div className="space-y-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                1
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-base font-medium text-gray-900">Fix Critical Issues First</h3>
              <p className="mt-1 text-sm text-gray-600">
                Focus on fixing critical issues that impact the largest number of users or completely block access for some users.
              </p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                2
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-base font-medium text-gray-900">Implement Recommendations</h3>
              <p className="mt-1 text-sm text-gray-600">
                Follow our specific recommendations for each issue to improve your website's accessibility.
              </p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                3
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-base font-medium text-gray-900">Re-scan After Changes</h3>
              <p className="mt-1 text-sm text-gray-600">
                After implementing fixes, run another scan to verify the improvements and identify any remaining issues.
              </p>
              <div className="mt-2">
                <Link to="/scan" className="btn btn-primary">
                  Run New Scan
                </Link>
              </div>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                4
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-base font-medium text-gray-900">Conduct Manual Testing</h3>
              <p className="mt-1 text-sm text-gray-600">
                Remember that automated testing can't catch everything. Perform manual testing with screen readers and keyboard navigation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;