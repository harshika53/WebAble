import axios from 'axios';
import type { ScanResult } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add timeout and error handling
  timeout: 30000,
  withCredentials: true,
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.request);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export const scanWebsite = async (url: string): Promise<ScanResult> => {
  try {
    const response = await api.post('/scan', { url });
    return response.data;
  } catch {
    throw new Error('Failed to scan website. Please try again later.');
  }
};

export const getReport = async (id: string): Promise<ScanResult> => {
  try {
    const response = await api.get(`/reports/${id}`);
    return response.data;
  } catch {
    throw new Error('Failed to fetch report. Please try again later.');
  }
};

export const getReports = async (limit = 10, skip = 0): Promise<ScanResult[]> => {
  try {
    const response = await api.get(`/reports?limit=${limit}&skip=${skip}`);
    return response.data;
  } catch {
    throw new Error('Failed to fetch reports. Please try again later.');
  }
};