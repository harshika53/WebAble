import { useState } from 'react';
import { scanWebsite, getReport, getRecentScans } from '../services/api';
import type { ScanResult } from '../types';

// Define a type that includes possible scanId/id fields
type ScanIdentifier = { scanId?: string; id?: string };

export const useScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);

  const scan = async (url: string): Promise<ScanResult | null> => {
    try {
      setIsScanning(true);
      setError(null);
      console.log('Starting scan for:', url);

      const scanResult = await scanWebsite(url);
      console.log('Initial scan result:', scanResult);
      setResult(scanResult);

      // Use id or scanId as identifier
      const identifier =
        (scanResult as ScanIdentifier).scanId ||
        (scanResult as ScanIdentifier).id;
      let currentResult = { ...scanResult, identifier } as ScanResult & {
        status?: string;
        identifier?: string;
      };
      const pollInterval = 3000; // 3 seconds

      if (!currentResult || !currentResult.identifier) {
        throw new Error('Scan did not return a valid scan identifier.');
      }
      if (!currentResult.status) {
        // If status is missing, try to fetch the report once
        const fetched = (await getReport(currentResult.identifier)) as ScanResult & {
          status?: string;
          identifier?: string;
        };
        setResult(fetched);
        return fetched;
      }

      // Poll until scan is completed
      while (currentResult.status === 'in_progress') {
        await new Promise((resolve) => setTimeout(resolve, pollInterval));
        if (!currentResult.identifier) {
          throw new Error('Scan identifier is missing during polling.');
        }
        const updatedReport = (await getReport(currentResult.identifier)) as ScanResult & {
          status?: string;
          identifier?: string;
        };
        console.log('Polled report:', updatedReport);
        setResult(updatedReport);
        currentResult = {
          ...updatedReport,
          identifier:
            (updatedReport as ScanIdentifier).scanId ||
            (updatedReport as ScanIdentifier).id,
        };
        if (!currentResult.status) break;
      }

      return currentResult;
    } catch (err) {
      console.error('Scan failed:', err);
      const errorMessage =
        err instanceof Error ? err.message : 'An error occurred during the scan';
      setError(errorMessage);
      return null;
    } finally {
      setIsScanning(false);
    }
  };

  const fetchReport = async (id: string): Promise<ScanResult | null> => {
    try {
      setError(null);
      console.log('Fetching report for ID:', id);

      const reportData = await getReport(id);
      console.log('Report fetched:', reportData);

      setResult(reportData);
      return reportData;
    } catch (err) {
      console.error('Failed to fetch report:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch report';
      setError(errorMessage);
      return null;
    }
  };

  const fetchRecentScans = async (limit = 10): Promise<ScanResult[]> => {
    try {
      setError(null);
      return await getRecentScans(limit);
    } catch (err) {
      console.error('Failed to fetch recent scans:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch recent scans';
      setError(errorMessage);
      return [];
    }
  };

  const clearError = () => {
    setError(null);
  };

  const clearResult = () => {
    setResult(null);
  };

  return {
    // Main functions
    scan,
    fetchReport,
    fetchRecentScans,

    // State
    isScanning,
    error,
    result,

    // Utility functions
    clearError,
    clearResult,
  };
};