import { useState } from 'react';
import { scanWebsite } from '../services/api';
import type { ScanResult } from '../types';

export const useScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);

  const scan = async (url: string) => {
    try {
      setIsScanning(true);
      setError(null);
      const scanResult = await scanWebsite(url);
      setResult(scanResult);
      return scanResult;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during the scan');
      return null;
    } finally {
      setIsScanning(false);
    }
  };

  return {
    scan,
    isScanning,
    error,
    result,
  };
};