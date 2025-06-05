import axios from 'axios';
import type { ScanResult } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 300000, // 5 minutes for scanning operations
  withCredentials: false, // Set to true only if you need cookies
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.data);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('API Error Response:', error.response.data);
      console.error('Status:', error.response.status);
    } else if (error.request) {
      console.error('Network Error - No Response:', error.request);
    } else {
      console.error('Request Setup Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Define error interface for better type safety
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
  message?: string;
}

export const scanWebsite = async (url: string): Promise<ScanResult> => {
  try {
    console.log('Scanning URL:', url);
    const response = await api.post('/scan', { url });
    console.log('Scan Response:', response.data);
    return response.data;
  } catch (error: unknown) {
    console.error('Scan Error:', error);
    const apiError = error as ApiError;
    const errorMessage = apiError.response?.data?.message || 'Failed to scan website. Please try again later.';
    throw new Error(errorMessage);
  }
};

export const getReport = async (id: string): Promise<ScanResult> => {
  try {
    console.log('Fetching report for ID:', id);
    const response = await api.get(`/reports/${id}`);
    return response.data;
  } catch (error: unknown) {
    console.error('Get Report Error:', error);
    const apiError = error as ApiError;
    const errorMessage = apiError.response?.data?.message || 'Failed to fetch report. Please try again later.';
    throw new Error(errorMessage);
  }
};

export const getReports = async (limit = 10, skip = 0): Promise<ScanResult[]> => {
  try {
    const response = await api.get(`/reports?limit=${limit}&skip=${skip}`);
    return response.data;
  } catch (error: unknown) {
    console.error('Get Reports Error:', error);
    const apiError = error as ApiError;
    const errorMessage = apiError.response?.data?.message || 'Failed to fetch reports. Please try again later.';
    throw new Error(errorMessage);
  }
};

export const getRecentScans = async (limit = 10): Promise<ScanResult[]> => {
  try {
    const response = await api.get(`/recent-scans?limit=${limit}`);
    return response.data;
  } catch (error: unknown) {
    console.error('Get Recent Scans Error:', error);
    const apiError = error as ApiError;
    const errorMessage = apiError.response?.data?.message || 'Failed to fetch recent scans. Please try again later.';
    throw new Error(errorMessage);
  }
};

// Alternative endpoint for getting scan reports
export const getScanReport = async (id: string): Promise<ScanResult> => {
  try {
    const response = await api.get(`/scan-report/${id}`);
    return response.data;
  } catch (error: unknown) {
    console.error('Get Scan Report Error:', error);
    const apiError = error as ApiError;
    const errorMessage = apiError.response?.data?.message || 'Failed to fetch scan report. Please try again later.';
    throw new Error(errorMessage);
  }
};

// Health check function
export const checkHealth = async (): Promise<boolean> => {
  try {
    const response = await api.get('/health');
    return response.status === 200;
  } catch (error) {
    console.error('Health Check Failed:', error);
    return false;
  }
};