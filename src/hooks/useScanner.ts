import { useState } from 'react';
import { scanWebsite, getReport, getRecentScans } from '../services/api';
import type { ScanResult } from '../types';

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
      console.log('Scan completed:', scanResult);
      
      setResult(scanResult);
      return scanResult;
    } catch (err) {
      console.error('Scan failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during the scan';
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