import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

export interface AnalyticsOverview {
  totalScans: number;
  averageScore: number;
  bestScore: number;
  worstScore: number;
  latestScore: number;
  improvements: number;
  regressions: number;
  isDemo?: boolean;
}

export interface TrendData {
  labels: string[];
  scores: number[];
}

export interface RecurringIssue {
  id: string;
  title: string;
  count: number;
  frequency: number;
}

export interface IssueDistribution {
  category: string;
  count: number;
}

export interface IssueAnalytics {
  recurringIssues: RecurringIssue[];
  distribution: IssueDistribution[];
}

export const getOverview = async (): Promise<AnalyticsOverview> => {
  try {
    const response = await api.get<AnalyticsOverview>('/analytics/overview');
    return response.data;
  } catch (error) {
    console.error('Error in getOverview:', error);
    throw new Error('Failed to fetch accessibility overview.');
  }
};

export const getTrendData = async (period: 'daily' | 'weekly' | 'monthly'): Promise<TrendData> => {
  try {
    const response = await api.get<TrendData>(`/analytics/trends?period=${period}`);
    return response.data;
  } catch (error) {
    console.error('Error in getTrendData:', error);
    throw new Error(`Failed to fetch ${period} trend data.`);
  }
};

export const getIssueAnalytics = async (): Promise<IssueAnalytics> => {
  try {
    const response = await api.get<IssueAnalytics>('/analytics/issues');
    return response.data;
  } catch (error) {
    console.error('Error in getIssueAnalytics:', error);
    throw new Error('Failed to fetch issue analytics.');
  }
};
