import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { AiOutlineFileDone, AiOutlineWarning, AiOutlineCloseCircle, AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useScanner } from '../hooks/useScanner';

// Define proper types for metrics and issues
interface ScanMetrics {
  performance?: number;
  accessibility?: number;
  bestPractices?: number;
  seo?: number;
  [key: string]: unknown; // Allow for additional dynamic properties
}

interface ScanIssue {
  id?: string;
  title?: string;
  description?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  category?: string;
  [key: string]: unknown; // Allow for additional dynamic properties
}

interface ScanResults {
  score: number;
  metrics: ScanMetrics;
  issues: ScanIssue[];
}

// Base interface for common properties
interface BaseScanData {
  _id?: string;
  id?: string;
  url?: string;
  date?: string;
  score?: number;
  status?: string;
}

// Hook result type (what your useScanner hook returns)
interface ScanResult extends BaseScanData {
  results?: ScanResults;
  // Add other specific properties that your hook might return
  metadata?: Record<string, unknown>;
  scanType?: string;
  // Remove the index signature to avoid unknown type issues
}

// Full report data type (what your API returns)
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

// Union type for handling both cases
type ScanDataUnion = ReportData | ScanResult;

const ReportPage: React.FC = () => {
  const location = useLocation();
  const { scanId, id } = useParams<{ scanId?: string; id?: string }>();
  const queryParams = new URLSearchParams(location.search);
  const urlFromQuery = queryParams.get('url') || '';

  const [reportData, setReportData] = useState<ScanDataUnion | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use the scanner hook
  const { fetchReport } = useScanner();

  useEffect(() => {
    const fetchScanResults = async () => {
      setLoading(true);
      setError(null);

      try {
        // Get the scan ID from either scanId or id parameter
        const currentScanId = scanId || id;

        // Priority 1: Use scan ID if available
        if (currentScanId) {
          console.log('Fetching report for ID:', currentScanId);
          
          try {
            // Use the hook's fetchReport function first
            const hookResult = await fetchReport(currentScanId);
            if (hookResult) {
              // Convert date to string if it's a Date object
              const normalizedResult = {
                ...hookResult,
                date: hookResult.date instanceof Date ? hookResult.date.toISOString() : hookResult.date,
              };
              setReportData(normalizedResult);
              return;
            }
          } catch (hookError) {
            console.warn('Hook fetchReport failed:', hookError);
            // Continue to fallback API calls
          }

          // Fallback to direct API calls if hook fails
          let response: Response | null = null;
          
          try {
            // Try scan-report endpoint first
            response = await fetch(`http://localhost:5000/api/scan-report/${currentScanId}`);
            
            if (!response.ok) {
              // Fallback to reports endpoint
              response = await fetch(`http://localhost:5000/api/reports/${currentScanId}`);
            }
            
            if (response.ok) {
              const data: ReportData = await response.json();
              setReportData(data);
              return;
            }
          } catch (apiError) {
            console.warn('API calls failed:', apiError);
            // Try last fallback
            try {
              response = await fetch(`http://localhost:5000/api/reports/${currentScanId}`);
              if (response.ok) {
                const data: ReportData = await response.json();
                setReportData(data);
                return;
              }
            } catch (finalError) {
              console.error('All API attempts failed:', finalError);
            }
          }
        }
        
        // Priority 2: Use URL from query params to perform new scan
        if (urlFromQuery) {
  console.log('Performing new scan for URL:', urlFromQuery);
  const scanResponse = await fetch(`http://localhost:5000/api/scan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url: urlFromQuery }),
  });

  if (!scanResponse.ok) {
    const errorText = await scanResponse.text();
    throw new Error(`Scan failed: ${scanResponse.status} - ${errorText}`);
  }

  const { scanId: newScanId } = await scanResponse.json();

  if (!newScanId) {
    throw new Error('Scan started but no scan ID returned.');
  }

  console.log('Scan started with ID:', newScanId);

  // Poll every 5 seconds for scan result
  const pollForResult = async (retries = 20) => {
    for (let i = 0; i < retries; i++) {
      const resultResponse = await fetch(`http://localhost:5000/api/scan-report/${newScanId}`);
      if (resultResponse.ok) {
        const resultData: ReportData = await resultResponse.json();
        if (resultData.status === 'completed') {
          setReportData(resultData);
          return;
        }
      }
      // wait before retrying
      await new Promise(res => setTimeout(res, 5000));
    }
    throw new Error('Scan did not complete in time.');
  };

  await pollForResult();
  return;
}


        // No scan ID or URL provided
        throw new Error('No scan ID or URL provided for report generation.');

      } catch (err: unknown) {
        console.error('Scan error:', err);
        if (err instanceof Error) {
          setError(err.message || 'Error occurred while fetching scan results.');
        } else {
          setError('Error occurred while fetching scan results.');
        }
        setReportData(null);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if we have a scan ID or URL
    if (scanId || id || urlFromQuery) {
      fetchScanResults();
    } else {
      setError('No scan ID or URL provided for report generation.');
    }
  }, [scanId, id, urlFromQuery, fetchReport]);

  const getScoreBadgeColor = (score: number): string => {
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 75) return 'bg-blue-100 text-blue-800';
    if (score >= 50) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  // Helper function to check if data has ReportData structure
  const isReportData = (data: ScanDataUnion): data is ReportData => {
    return data && typeof data === 'object' && 'pass' in data && 'warning' in data && 'fail' in data;
  };

  // Helper function to check if data has ReportData structure

  // Extract score from different possible data structures
  const getScore = (): number => {
    if (!reportData) return 0;
    if (reportData.score !== undefined) return reportData.score;
    if (reportData.results?.score !== undefined) return reportData.results.score;
    return 0;
  };

  const currentScore = getScore();

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Scan Report</h1>
        {(reportData?.url || urlFromQuery) && (
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">URL:</span>
            <span className="text-blue-600 font-medium break-all">
              {reportData?.url || urlFromQuery}
            </span>
          </div>
        )}
        {/* Show scan ID if available */}
        {(scanId || id || reportData?.id || reportData?._id) && (
          <div className="flex items-center space-x-2 mt-2">
            <span className="text-gray-500 text-sm">Scan ID:</span>
            <span className="text-gray-700 text-sm font-mono">
              {scanId || id || reportData?.id || reportData?._id}
            </span>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center p-12">
          <div className="text-center">
            <AiOutlineLoading3Quarters className="animate-spin mx-auto mb-4 text-blue-600" size={48} />
            <p className="text-gray-600 text-lg">Analyzing website security...</p>
            <p className="text-gray-500 text-sm mt-2">This may take a few moments</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <AiOutlineCloseCircle className="text-red-600 mr-3" size={24} />
            <div>
              <h3 className="text-red-800 font-semibold">Scan Failed</h3>
              <p className="text-red-600 mt-1">{error}</p>
              {/* Debug info */}
              <div className="mt-2 text-xs text-red-500">
                <p>Scan ID: {scanId || id || 'Not provided'}</p>
                <p>URL: {urlFromQuery || 'Not provided'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report Data */}
      {reportData && (
        <div className="space-y-8">
          {/* Overall Score */}
          {currentScore !== undefined && currentScore > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Overall Security Score</h2>
                <div className={`px-4 py-2 rounded-full text-2xl font-bold ${getScoreBadgeColor(currentScore)}`}>
                  {currentScore}/100
                </div>
              </div>
              {/* Show status if available */}
              {reportData.status && (
                <div className="mt-2">
                  <span className="text-sm text-gray-600">Status: </span>
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

          {/* Test Results Summary */}
          {reportData && isReportData(reportData) && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                  <AiOutlineFileDone className="text-green-600" size={32} />
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {typeof reportData.pass === 'number' ? reportData.pass : 0}
                    </p>
                    <p className="text-green-700 font-medium">Passed</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-lg">
                  <AiOutlineWarning className="text-yellow-600" size={32} />
                  <div>
                    <p className="text-2xl font-bold text-yellow-600">
                      {typeof reportData.warning === 'number' ? reportData.warning : 0}
                    </p>
                    <p className="text-yellow-700 font-medium">Warnings</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-lg">
                  <AiOutlineCloseCircle className="text-red-600" size={32} />
                  <div>
                    <p className="text-2xl font-bold text-red-600">
                      {typeof reportData.fail === 'number' ? reportData.fail : 0}
                    </p>
                    <p className="text-red-700 font-medium">Failed</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Summary */}
          {isReportData(reportData) && reportData.summary && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Summary</h2>
              <p className="text-gray-700 leading-relaxed">{reportData.summary}</p>
            </div>
          )}

          {/* Vulnerabilities */}
          {isReportData(reportData) && reportData.vulnerabilities && Object.keys(reportData.vulnerabilities).length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
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
                          <p className="text-gray-600 mt-1">{typedVuln.message}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Show results if available in different format */}
          {reportData.results?.issues && reportData.results.issues.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Issues Found</h2>
              <div className="space-y-3">
                {reportData.results.issues.map((issue: ScanIssue, index: number) => (
                  <div key={issue.id || index} className="border-l-4 border-red-400 pl-4 py-2">
                    <div className="flex items-start space-x-3">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{issue.title || `Issue ${index + 1}`}</h3>
                        <p className="text-gray-600 mt-1">
                          {issue.description || 'No description available'}
                        </p>
                        {issue.severity && (
                          <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                            issue.severity === 'critical' ? 'bg-red-100 text-red-800' :
                            issue.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                            issue.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {issue.severity}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Scan Metadata */}
          {reportData.date && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">
                Scan completed on: <span className="font-medium">{new Date(reportData.date).toLocaleString()}</span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReportPage;