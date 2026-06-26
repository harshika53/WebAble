import React from 'react';
import { ArrowUpRight, ArrowDownRight, RefreshCw, Milestone } from 'lucide-react';

interface ImprovementMetricsProps {
  improvements: number;
  regressions: number;
}

export const ImprovementMetrics: React.FC<ImprovementMetricsProps> = ({
  improvements,
  regressions,
}) => {
  const getTrendStatus = () => {
    if (improvements > regressions) {
      return {
        label: 'Improving',
        colorClass: 'bg-green-150 text-green-800 dark:bg-green-950/30 dark:text-green-400 border border-green-200 dark:border-green-800/50',
        icon: <TrendingUpIcon className="h-5 w-5 text-green-600 dark:text-green-400" />,
        message: 'Accessibility scores are trending upwards across monitored websites.',
      };
    } else if (improvements < regressions) {
      return {
        label: 'Declining',
        colorClass: 'bg-red-105 text-red-800 dark:bg-red-950/30 dark:text-red-400 border border-red-200 dark:border-red-800/50',
        icon: <TrendingDownIcon className="h-5 w-5 text-red-600 dark:text-red-400" />,
        message: 'Regressions have been detected. More websites are showing a drop in accessibility scores.',
      };
    } else if (improvements === 0 && regressions === 0) {
      return {
        label: 'No Scans Yet',
        colorClass: 'bg-gray-100 text-gray-800 dark:bg-gray-800/40 dark:text-gray-400 border border-gray-200 dark:border-gray-700/50',
        icon: <Milestone className="h-5 w-5 text-gray-500" />,
        message: 'Run multiple scans on the same URLs to see accessibility improvements or regressions over time.',
      };
    } else {
      return {
        label: 'Stable',
        colorClass: 'bg-blue-50 text-blue-800 dark:bg-blue-950/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50',
        icon: <RefreshCw className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
        message: 'Improvements and regressions are balanced. Accessibility is stable.',
      };
    }
  };

  const TrendingUpIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-9 9-4-4-6 6" />
    </svg>
  );

  const TrendingDownIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8l-9-9-4 4-6-6" />
    </svg>
  );

  const trend = getTrendStatus();

  return (
    <div className="card h-full flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Trends & Health Metrics</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">Comparing consecutive scan results by unique domains</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        {/* Improvements count box */}
        <div className="flex items-center gap-3 p-4 bg-green-50/50 dark:bg-green-950/10 rounded-xl border border-green-100 dark:border-green-900/20">
          <div className="p-2.5 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400">
            <ArrowUpRight className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-black text-green-600 dark:text-green-400 leading-none">{improvements}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-semibold">Improvements</p>
          </div>
        </div>

        {/* Regressions count box */}
        <div className="flex items-center gap-3 p-4 bg-red-50/50 dark:bg-red-950/10 rounded-xl border border-red-100 dark:border-red-900/20">
          <div className="p-2.5 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400">
            <ArrowDownRight className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-black text-red-600 dark:text-red-400 leading-none">{regressions}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-semibold">Regressions</p>
          </div>
        </div>
      </div>

      <div className="mt-5 p-4 rounded-xl border border-gray-100 dark:border-gray-700/40 bg-gray-50/50 dark:bg-gray-900/20">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Overall Trend</span>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${trend.colorClass}`}>
            {trend.icon}
            {trend.label}
          </span>
        </div>
        <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400">
          {trend.message}
        </p>
      </div>
    </div>
  );
};
