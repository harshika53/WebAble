import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { AiOutlineFileDone, AiOutlineWarning, AiOutlineCloseCircle, AiOutlineLoading3Quarters } from 'react-icons/ai';

interface ReportData {
  _id?: string;
  url: string;
  date: string;
  score: number;
  pass: number;
  warning: number;
  fail: number;
  summary: string;
  vulnerabilities: {
    [key: string]: {
      count: number;
      message: string;
    };
  };
}

const ReportPage: React.FC = () => {
  const location = useLocation();
  const { scanId } = useParams<{ scanId: string }>();
  const queryParams = new URLSearchParams(location.search);
  const urlFromQuery = queryParams.get('url') || '';

  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScanResults = async () => {
      setLoading(true);
      setError(null);

      try {
        let response;
        
        // If we have a scanId, fetch the specific scan report
        if (scanId) {
          // Try both endpoints for backward compatibility
          try {
            response = await fetch(`http://localhost:5000/api/scan-report/${scanId}`);
            if (!response.ok) {
              // Fallback to reports endpoint
              response = await fetch(`http://localhost:5000/api/reports/${scanId}`);
            }
          } catch {
            response = await fetch(`http://localhost:5000/api/reports/${scanId}`);
          }
        } 
        // If we have a URL from query params, perform a new scan
        else if (urlFromQuery) {
          response = await fetch(`http://localhost:5000/api/scan?url=${encodeURIComponent(urlFromQuery)}`);
        } 
        // No scan ID or URL provided
        else {
          setError('No scan ID or URL provided for report generation.');
          return;
        }

        if (!response.ok) {
          throw new Error(`Scan failed with status ${response.status}: ${response.statusText}`);
        }

        const data: ReportData = await response.json();
        setReportData(data);
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

    fetchScanResults();
  }, [scanId, urlFromQuery]);


  const getScoreBadgeColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 75) return 'bg-blue-100 text-blue-800';
    if (score >= 50) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

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
            </div>
          </div>
        </div>
      )}

      {/* Report Data */}
      {reportData && (
        <div className="space-y-8">
          {/* Overall Score */}
          {reportData.score !== undefined && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Overall Security Score</h2>
                <div className={`px-4 py-2 rounded-full text-2xl font-bold ${getScoreBadgeColor(reportData.score)}`}>
                  {reportData.score}/100
                </div>
              </div>
            </div>
          )}

          {/* Test Results Summary */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                <AiOutlineFileDone className="text-green-600" size={32} />
                <div>
                  <p className="text-2xl font-bold text-green-600">{reportData.pass}</p>
                  <p className="text-green-700 font-medium">Passed</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-lg">
                <AiOutlineWarning className="text-yellow-600" size={32} />
                <div>
                  <p className="text-2xl font-bold text-yellow-600">{reportData.warning}</p>
                  <p className="text-yellow-700 font-medium">Warnings</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-lg">
                <AiOutlineCloseCircle className="text-red-600" size={32} />
                <div>
                  <p className="text-2xl font-bold text-red-600">{reportData.fail}</p>
                  <p className="text-red-700 font-medium">Failed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          {reportData.summary && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Summary</h2>
              <p className="text-gray-700 leading-relaxed">{reportData.summary}</p>
            </div>
          )}

          {/* Vulnerabilities */}
          {reportData.vulnerabilities && Object.keys(reportData.vulnerabilities).length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Detailed Findings</h2>
              <div className="space-y-4">
                {Object.entries(reportData.vulnerabilities).map(([key, vuln]) => (
                  <div key={key} className="border-l-4 border-orange-400 pl-4 py-2">
                    <div className="flex items-start space-x-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        {vuln.count} {vuln.count === 1 ? 'issue' : 'issues'}
                      </span>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h3>
                        <p className="text-gray-600 mt-1">{vuln.message}</p>
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