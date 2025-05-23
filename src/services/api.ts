import axios from 'axios';
import type { ScanResult } from '../types';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const scanWebsite = async (url: string): Promise<ScanResult> => {
  const response = await api.post('/scan', { url });
  return response.data;
};

export const getReport = async (id: string): Promise<ScanResult> => {
  const response = await api.get(`/reports/${id}`);
  return response.data;
};

export const getReports = async (limit = 10, skip = 0): Promise<ScanResult[]> => {
  const response = await api.get(`/reports?limit=${limit}&skip=${skip}`);
  return response.data;
};