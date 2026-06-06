import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { AiOutlineFileDone, AiOutlineWarning, AiOutlineCloseCircle, AiOutlineLoading3Quarters, AiOutlineExclamationCircle } from 'react-icons/ai';
import { useScanner } from '../hooks/useScanner';

interface AccessibilityIssue {
  id: string;
  title: string;
  description: string;
  impact: 'minor' | 'moderate' | 'serious' | 'critical';
  affectedElements: string[];
  recommendation: string;
  wcagCriteria: string[];
}

interface IssuesBySeverity {
  critical: number;
  serious: number;
  moderate: number;
  minor: number;
}

interface ScanMetrics {
  performance?: number;
  accessibility?: number;
  bestPractices?: number;
  seo?: number;
  [key: string]: unknown;
}

interface ScanIssue {
  id?: string;
  title?: string;
  description?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  category?: string;
  impact?: 'minor' | 'moderate' | 'serious' | 'critical';
  affectedElements?: string[];
  recommendation?: string;
  wcagCriteria?: string[];
  [key: string]: unknown;
}

interface ScanResults {
  score: number;
  metrics: ScanMetrics;
  issues: AccessibilityIssue[] | ScanIssue[];
  issuesBySeverity?: IssuesBySeverity;
}

interface BaseScanData {
  _id?: string;
  id?: string;
  url?: string;
  date?: string;
  score?: number;
  status?: string;
}

interface ScanResult extends BaseScanData {
  results?: ScanResults;
  metadata?: Record<string, unknown>;
  scanType?: string;
}

interface ReportData extends BaseScanData {
  url: string;
  date: string;
  score: number;
  pass?: number;
  warning?: number;
  fail?: number;
  summary?: string;
  vulnerabilities?: {
    [key: string]: {
      count: number;
      message: string;
    };
  };
  results?: ScanResults;
}

type ScanDataUnion = ReportData | ScanResult;

const ReportPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { scanId, id } = useParams<{ scanId?: string; id?: string }>();
  const queryParams = new URLSearchParams(location.search);
  const urlFromQuery = queryParams.get('url') || '';

  const [reportData, setReportData] = useState<ScanDataUnion | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const { fetchReport } = useScanner();
  const scanInProgress = useRef(false);
  const lastScanId = useRef<string | null>(null);
  const lastScannedUrl = useRef<string | null>(null);

  const isLikelyScanId = (value?: string) => {
    if (!value) return false;
    const cleanValue = value.trim();
    return (
      /^[a-f\d]{24}$/i.test(cleanValue) || 
      /^[\w\d-]{36}$/.test(cleanValue) || 
      /^https?:\/\//i.test(cleanValue) ||
      cleanValue.includes('.')
    );
  };

  const getSeverityBadgeStyle = (impact: string): string => {
    switch (impact.toLowerCase()) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'serious':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'minor':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'critical':
        return <AiOutlineCloseCircle className="text-red-600" size={20} />;
      case 'serious':
        return <AiOutlineExclamationCircle className="text-orange-600" size={20} />;
      case 'moderate':
        return <AiOutlineWarning className="text-yellow-600" size={20} />;
      case 'minor':
        return <AiOutlineFileDone className="text-blue-600" size={20} />;
      default:
        return <AiOutlineWarning className="text-gray-600 dark:text-gray-300" size={20} />;
    }
  };

  const formatWcagCriteria = (criteria: string[]): string[] => {
    return criteria.filter(c => c.startsWith('wcag')).map(c => c.toUpperCase());
  };

  const truncateHtml = (html: string, maxLength: number = 100): string => {
    if (html.length <= maxLength) return html;
    return html.substring(0, maxLength) + '...';
  };
  const copyReportLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  } catch (error) {
    console.error("Failed to copy link:", error);
  }
};
  useEffect(() => {
    const fetchScanResults = async () => {
      if (scanInProgress.current) return;
      scanInProgress.current = true;
      setLoading(true);
      setError(null);

      const rawScanId = scanId || id;
      const currentScanId = rawScanId ? decodeURIComponent(rawScanId) : undefined;

      // Defensive checking for invalid domains right before calling the APIs
      const isTargetInvalid = currentScanId && 
        (!currentScanId.includes('.') || 
         currentScanId.replace('https://', '').replace('http://', '').length < 4);

      if (isTargetInvalid) {
        setError('Invalid Scan Target Format. Please return to the dashboard and supply a valid website domain address (e.g., example.com).');
        setLoading(false);
        scanInProgress.current = false;
        return;
      }

      try {
        if (isLikelyScanId(currentScanId)) {
          if (lastScanId.current === currentScanId) {
            scanInProgress.current = false;
            setLoading(false);
            return;
          }
          lastScanId.current = currentScanId ?? null;

          console.log('Fetching report for scan ID:', currentScanId);

          try {
            const hookResult = await fetchReport(currentScanId!);
            if (hookResult) {
              const normalizedResult = {
                ...hookResult,
                date: hookResult.date instanceof Date ? hookResult.date.toISOString() : hookResult.date,
              };
              setReportData(normalizedResult);
              setLoading(false);
              scanInProgress.current = false;
              return;
            }
          } catch (hookError) {
            console.warn('Hook fetchReport failed:', hookError);
          }

          let response: Response | null = null;
          try {
            const encodedParam = encodeURIComponent(currentScanId!);
            response = await fetch(`http://localhost:5000/api/scan-report/${encodedParam}`);
            if (!response.ok) {
              response = await fetch(`http://localhost:5000/api/reports/${encodedParam}`);
            }
            if (response.ok) {
              const data: ReportData = await response.json();
              setReportData(data);
              setLoading(false);
              scanInProgress.current = false;
              return;
            }
          } catch (apiError) {
            console.warn('API calls failed:', apiError);
          }
        }

        const urlToScan = urlFromQuery || (!isLikelyScanId(currentScanId) ? currentScanId : '');
        if (urlToScan) {
          if (lastScannedUrl.current === urlToScan) {
            scanInProgress.current = false;
            setLoading(false);
            return;
          }
          lastScannedUrl.current = urlToScan;

          const scanResponse = await fetch(`http://localhost:5000/api/scan`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: urlToScan }),
          });

          if (!scanResponse.ok) {
            const errorText = await scanResponse.text();
            throw new Error(`Scan failed: ${scanResponse.status} - ${errorText}`);
          }

          const scanData = await scanResponse.json();
          const newScanId = scanData.scanId || scanData.id;
          if (!newScanId) {
            throw new Error('Scan started but no scan ID returned.');
          }

          const safeNewScanId = encodeURIComponent(newScanId);
          window.history.replaceState({}, '', `/report/${safeNewScanId}`);

          let resultData: ReportData | null = null;
          const pollForResult = async (retries = 20) => {
            for (let i = 0; i < retries; i++) {
              const encodedReportParam = encodeURIComponent(newScanId);
              const resultResponse = await fetch(`http://localhost:5000/api/scan-report/${encodedReportParam}`);
              if (resultResponse.ok) {
                resultData = await resultResponse.json();
                if (resultData && resultData.status === 'completed') {
                  setReportData(resultData);
                  setLoading(false);
                  scanInProgress.current = false;
                  return;
                }
              }
              await new Promise(res => setTimeout(res, 5000));
            }
            throw new Error('Scan did not complete in time.');
          };

          await pollForResult();
          return;
        }

        throw new Error('No valid scan ID or URL provided for report generation.');
      } catch (err: unknown) {
        console.error('Scan error caught:', err);
        setReportData(null);

        if (currentScanId && (currentScanId.startsWith('http') || currentScanId.includes('.'))) {
          setError('WebAble Backend Offline. Frontend routing parsed successfully. Turn on the backend server (port 5000) to pull real database accessibility metrics.');
          setLoading(false);
          scanInProgress.current = false;
          return;
        }

        if (err instanceof Error) {
          setError(err.message || 'Error occurred while fetching scan results.');
        } else {
          setError('Error occurred while fetching scan results.');
        }
        setLoading(false);
        navigate('/404', { replace: true });
        return;
      } finally {
        if (!error && (!currentScanId || (!currentScanId.startsWith('http') && !currentScanId.includes('.')))) {
          setLoading(false);
          scanInProgress.current = false;
        }
      }
    };

    if (scanId || id || urlFromQuery) {
      fetchScanResults();
    } else {
      setError('No scan ID or URL provided for report generation.');
    }
  }, [scanId, id, urlFromQuery, fetchReport, navigate, error]);

  const getScoreBadgeColor = (score: number): string => {
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 75) return 'bg-blue-100 text-blue-800';
    if (score >= 50) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const isReportData = (data: ScanDataUnion): data is ReportData => {
    return data && typeof data === 'object' && 'pass' in data && 'warning' in data && 'fail' in data;
  };

  const getScore = (): number => {
    if (!reportData) return 0;
    if (reportData.score !== undefined) return reportData.score;
    if (reportData.results?.score !== undefined) return reportData.results.score;
    return 0;
  };

  const currentScore = getScore();

  const getRecommendationsForIssues = (issues: (AccessibilityIssue | ScanIssue)[]) => {
    const recs: { key: string; label: string; detail?: string }[] = [];
    const seen = new Set<string>();

    issues.forEach(issue => {
      if (!issue.title) return;
      
      if (/lang|language/i.test(issue.title) && !seen.has('lang')) {
        recs.push({
          key: 'lang',
          label: 'Add language attribute to HTML',
          detail: 'Add lang="en" (or appropriate language) to your <html> element.'
        });
        seen.add('lang');
      }
      if (/landmark|main/i.test(issue.title) && !seen.has('landmarks')) {
        recs.push({
          key: 'landmarks',
          label: 'Add proper page landmarks',
          detail: 'Use semantic HTML elements like <main>, <nav>, <header>, and <footer>.'
        });
        seen.add('landmarks');
      }
      if (/region|content/i.test(issue.title) && !seen.has('regions')) {
        recs.push({
          key: 'regions',
          label: 'Structure content with landmarks',
          detail: 'Ensure all page content is contained within appropriate landmark regions.'
        });
        seen.add('regions');
      }
    });

    if (recs.length === 0) {
      recs.push({
        key: 'generic',
        label: 'Follow WCAG guidelines',
        detail: 'Review Web Content Accessibility Guidelines to improve accessibility.'
      });
    }

    return recs;
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
  <h1 className="text-3xl font-bold text-gray-900">
    Accessibility Scan Report
  </h1>
  {copied && (
  <div className="mb-4 text-green-600 font-medium">
    Link copied successfully!
  </div>
)}
  <button
    onClick={copyReportLink}
    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
  >
    Copy Report Link
  </button>
</div>
        {(reportData?.url || urlFromQuery) && (
          <div className="flex items-center space-x-2">
            <span className="text-gray-600 dark:text-gray-300">URL:</span>
            <span className="text-blue-600 font-medium break-all">
              {reportData?.url || urlFromQuery}
            </span>
          </div>
        )}
        {(scanId || id || reportData?.id || reportData?._id) && (
          <div className="flex items-center space-x-2 mt-2">
            <span className="text-gray-500 text-sm dark:text-gray-300">Scan ID:</span>
            <span className="text-gray-700 text-sm font-mono dark:text-gray-300">
              {scanId || id || reportData?.id || reportData?._id}
            </span>
          </div>
        )}
      </div>

      {loading && !error && (
        <div className="flex items-center justify-center p-12">
          <div className="text-center">
            <AiOutlineLoading3Quarters className="animate-spin mx-auto mb-4 text-blue-600" size={48} />
            <p className="text-gray-600 dark:text-gray-300 text-lg">Analyzing website accessibility...</p>
            <p className="text-gray-500 text-sm mt-2">This may take a few moments</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 my-4">
          <div className="flex items-center">
            <AiOutlineCloseCircle className="text-red-600 mr-3 flex-shrink-0" size={24} />
            <div>
              <h3 className="text-red-800 font-semibold text-lg">Scan Status Notice</h3>
              <p className="text-red-600 mt-1 font-medium">{error}</p>
              <div className="mt-4 text-xs text-red-500 border-t border-red-200 pt-2 space-y-1">
                <p><span className="font-semibold">Scan Parameter:</span> {scanId || id || 'Not provided'}</p>
                <p><span className="font-semibold">Query Target:</span> {urlFromQuery || 'Not provided'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {reportData && (
        <div className="space-y-8">
          {currentScore !== undefined && currentScore > 0 && (
            <div className="bg-white dark:bg-gray-800  rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Overall Accessibility Score</h2>
                <div className={`px-4 py-2 rounded-full text-2xl font-bold ${getScoreBadgeColor(currentScore)}`}>
                  {currentScore}/100
                </div>
              </div>
              {reportData.status && (
                <div className="mt-2">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Status: </span>
                  <span className={`text-sm font-medium ${
                    reportData.status === 'completed' ? 'text-green-600' : 
                    reportData.status === 'failed' ? 'text-red-600' : 'text-yellow-600'
                  }`}>
                    {reportData.status}
                  </span>
                </div>
              )}
            </div>
          )}

          {reportData.results?.issuesBySeverity && (
            <div className="bg-white dark:bg-gray-800  rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Issues Summary</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-lg border border-red-200">
                  <AiOutlineCloseCircle className="text-red-600" size={24} />
                  <div>
                    <p className="text-2xl font-bold text-red-600">
                      {reportData.results.issuesBySeverity.critical}
                    </p>
                    <p className="text-red-700 font-medium text-sm">Critical</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <AiOutlineExclamationCircle className="text-orange-600" size={24} />
                  <div>
                    <p className="text-2xl font-bold text-orange-600">
                      {reportData.results.issuesBySeverity.serious}
                    </p>
                    <p className="text-orange-700 font-medium text-sm">Serious</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <AiOutlineWarning className="text-yellow-600" size={24} />
                  <div>
                    <p className="text-2xl font-bold text-yellow-600">
                      {reportData.results.issuesBySeverity.moderate}
                    </p>
                    <p className="text-yellow-700 font-medium text-sm">Moderate</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <AiOutlineFileDone className="text-blue-600" size={24} />
                  <div>
                    <p className="text-2xl font-bold text-blue-600">
                      {reportData.results.issuesBySeverity.minor}
                    </p>
                    <p className="text-blue-700 font-medium text-sm">Minor</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {reportData.results?.issues && reportData.results.issues.length > 0 && (
            <div className="bg-white dark:bg-gray-800  rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Issues Found</h2>
              <div className="space-y-6">
                {reportData.results.issues.map((issue: AccessibilityIssue | ScanIssue, index: number) => (
                  <div key={issue.id || index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-start space-x-3 mb-3">
                      {getSeverityIcon(issue.impact || 'moderate')}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{issue.title || `Issue ${index + 1}`}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getSeverityBadgeStyle(issue.impact || 'moderate')}`}>
                            {(issue.impact || 'moderate').toUpperCase()}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-3">{issue.description || 'No description available'}</p>
                        
                        {'wcagCriteria' in issue && issue.wcagCriteria && issue.wcagCriteria.length > 0 && (
                          <div className="mb-3">
                            <h4 className="text-sm font-medium text-gray-700 mb-1">WCAG Guidelines:</h4>
                            <div className="flex flex-wrap gap-1">
                              {formatWcagCriteria(issue.wcagCriteria).map((criteria, idx) => (
                                <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md border border-blue-200">
                                  {criteria}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {'affectedElements' in issue && issue.affectedElements && issue.affectedElements.length > 0 && (
                          <div className="mb-3">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Affected Elements:</h4>
                            <div className="space-y-2">
                              {issue.affectedElements.map((element, idx) => (
                                <div key={idx} className="bg-gray-50 border border-gray-200 rounded p-2">
                                  <code className="text-sm text-gray-800 break-all">
                                    {truncateHtml(element)}
                                  </code>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {'recommendation' in issue && issue.recommendation && (
                          <div>
                            <a 
                              href={issue.recommendation} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                               How to Fix this issue Click ME 
                            </a>
                          </div>
                        )} 
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {reportData.results?.issues && reportData.results.issues.length > 0 && (
            <div className="bg-white dark:bg-gray-800  rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recommendations</h2>
              <div className="space-y-3">
                {getRecommendationsForIssues(reportData.results.issues).map(rec => (
                  <div key={rec.key} className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-900 rounded-lg border border-green-200 dark:border-green-600">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mt-0.5">
                      <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-green-800">{rec.label}</h3>
                      {rec.detail && (
                        <p className="text-green-700 text-sm mt-1">{rec.detail}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {reportData && isReportData(reportData) && (
            <>
              <div className="bg-white dark:bg-gray-800  rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Results</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-900 rounded-lg">
                    <AiOutlineFileDone className="text-green-600 dark:text-green-400" size={32} />
                    <div>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {typeof reportData.pass === 'number' ? reportData.pass : 0}
                      </p>
                      <p className="text-green-700 dark:text-green-300 font-medium">Passed</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-yellow-50 dark:bg-yellow-900 rounded-lg">
                    <AiOutlineWarning className="text-yellow-600 dark:text-yellow-400" size={32} />
                    <div>
                      <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                        {typeof reportData.warning === 'number' ? reportData.warning : 0}
                      </p>
                      <p className="text-yellow-700 dark:text-yellow-300 font-medium">Warnings</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-red-50 dark:bg-red-900 rounded-lg">
                    <AiOutlineCloseCircle className="text-red-600 dark:text-red-400" size={32} />
                    <div>
                      <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {typeof reportData.fail === 'number' ? reportData.fail : 0}
                      </p>
                      <p className="text-red-700 dark:text-red-300 font-medium">Failed</p>
                    </div>
                  </div>
                </div>
              </div>

              {reportData.summary && (
                <div className="bg-white dark:bg-gray-800  rounded-lg border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Summary</h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{reportData.summary}</p>
                </div>
              )}

              {reportData.vulnerabilities && Object.keys(reportData.vulnerabilities).length > 0 && (
                <div className="bg-white dark:bg-gray-800  rounded-lg border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Detailed Findings</h2>
                  <div className="space-y-4">
                    {Object.entries(reportData.vulnerabilities).map(([key, vuln]) => {
                      const typedVuln = vuln as { count: number; message: string };
                      return (
                        <div key={key} className="border-l-4 border-orange-400 pl-4 py-2">
                          <div className="flex items-start space-x-3">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                              {typedVuln.count} {typedVuln.count === 1 ? 'issue' : 'issues'}
                            </span>
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h3>
                              <p className="text-gray-600 dark:text-gray-300 mt-1">{typedVuln.message}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}

          <button
            className="inline-flex items-center px-4 py-2 mt-4 bg-blue-200 text-blue-800 text-sm font-medium rounded-md hover:bg-blue-300 transition-colors duration-200"
            onClick={() => navigate('/')}
          >
            Back to Dashboard
          </button>

          {reportData.date && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Scan completed on: {new Date(reportData.date).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReportPage;