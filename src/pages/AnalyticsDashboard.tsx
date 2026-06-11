import React, { useEffect, useState } from 'react';
import { Loader2, AlertCircle, Info, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

import {
  getOverview,
  getTrendData,
  getIssueAnalytics,
} from '../services/analyticsService';
import type {
  AnalyticsOverview,
  TrendData,
  IssueAnalytics,
} from '../services/analyticsService';

import { AnalyticsSummaryCards } from '../components/analytics/AnalyticsSummaryCards';
import { AccessibilityTrendChart } from '../components/analytics/AccessibilityTrendChart';
import { IssueDistributionChart } from '../components/analytics/IssueDistributionChart';
import { RecurringIssuesTable } from '../components/analytics/RecurringIssuesTable';
import { ImprovementMetrics } from '../components/analytics/ImprovementMetrics';

const AnalyticsDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [trendData, setTrendData] = useState<TrendData | null>(null);
  const [issuesData, setIssuesData] = useState<IssueAnalytics | null>(null);
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  // Load all initial page metrics
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch overview, issues, and initial trends in parallel
      const [overviewRes, trendRes, issuesRes] = await Promise.all([
        getOverview(),
        getTrendData(period),
        getIssueAnalytics(),
      ]);

      setOverview(overviewRes);
      setTrendData(trendRes);
      setIssuesData(issuesRes);
    } catch (err: any) {
      console.error(err);
      setError('Failed to fetch analytics. Please make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  // Reload trends specifically when period toggle changes
  const handlePeriodChange = async (newPeriod: 'daily' | 'weekly' | 'monthly') => {
    try {
      setPeriod(newPeriod);
      const res = await getTrendData(newPeriod);
      setTrendData(res);
    } catch (err) {
      console.error(err);
      setError('Failed to update trend period view.');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-primary-600" />
        <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
          Gathering accessibility trend reports...
        </span>
      </div>
    );
  }

  if (error || !overview || !trendData || !issuesData) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <div className="rounded-full bg-red-100 dark:bg-red-950/20 p-4 border border-red-200 dark:border-red-900/30">
          <AlertCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
        </div>
        <div className="max-w-md">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Could Not Load Analytics</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {error || 'An unexpected error occurred while processing scan data.'}
          </p>
        </div>
        <button onClick={loadData} className="btn btn-primary mt-2">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Accessibility Trend Analytics
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Analyze historical scores, recurring violations, and optimization progression.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 font-semibold bg-gray-100 dark:bg-gray-800/40 border border-gray-200/50 dark:border-gray-700/50 rounded-lg px-3.5 py-2 w-fit">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span>Last updated: {new Date().toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
        </div>
      </div>

      {/* Demo Warning Banner */}
      {overview.isDemo && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 p-4 bg-primary-50 dark:bg-primary-950/20 border border-primary-100 dark:border-primary-900/30 text-primary-800 dark:text-primary-400 rounded-xl"
        >
          <Info className="h-5 w-5 mt-0.5 text-primary-600 dark:text-primary-400 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-sm">MongoDB Connection Offline</h4>
            <p className="text-xs mt-0.5 leading-relaxed opacity-90">
              The backend is currently unable to reach a live MongoDB instance on port 27017. To allow you to preview and evaluate the dashboard aesthetics, the service has securely fallen back to displaying realistic mock trend data.
            </p>
          </div>
        </motion.div>
      )}

      {/* Section 1: Summary Cards */}
      <AnalyticsSummaryCards overview={overview} />

      {/* Section 2: Trends and Improvement Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AccessibilityTrendChart
            trendData={trendData}
            period={period}
            onPeriodChange={handlePeriodChange}
          />
        </div>
        <div>
          <ImprovementMetrics
            improvements={overview.improvements}
            regressions={overview.regressions}
          />
        </div>
      </div>

      {/* Section 3: Issues Table and Category Distribution Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecurringIssuesTable recurringIssues={issuesData.recurringIssues} />
        </div>
        <div>
          <IssueDistributionChart distribution={issuesData.distribution} />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
