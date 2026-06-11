import React from 'react';
import type { RecurringIssue } from '../../services/analyticsService';

interface RecurringIssuesTableProps {
  recurringIssues: RecurringIssue[];
}

export const RecurringIssuesTable: React.FC<RecurringIssuesTableProps> = ({
  recurringIssues,
}) => {
  const getFrequencyBarColor = (freq: number) => {
    if (freq >= 50) return 'bg-error-500';
    if (freq >= 25) return 'bg-warning-500';
    return 'bg-primary-500';
  };

  const getImpactBadge = (issueId: string) => {
    // Basic severity heuristics based on standard issues
    const isCritical = ['color-contrast', 'html-has-lang', 'image-alt'].includes(issueId);
    const isSerious = ['label', 'link-name'].includes(issueId);
    
    if (isCritical) {
      return (
        <span className="inline-flex items-center rounded-full bg-red-50 dark:bg-red-950/20 px-2 py-0.5 text-xs font-semibold text-red-700 dark:text-red-400 border border-red-150 dark:border-red-900/30">
          Critical
        </span>
      );
    } else if (isSerious) {
      return (
        <span className="inline-flex items-center rounded-full bg-orange-50 dark:bg-orange-950/20 px-2 py-0.5 text-xs font-semibold text-orange-700 dark:text-orange-400 border border-orange-150 dark:border-orange-900/30">
          Serious
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center rounded-full bg-yellow-50 dark:bg-yellow-950/20 px-2 py-0.5 text-xs font-semibold text-yellow-700 dark:text-yellow-400 border border-yellow-155 dark:border-yellow-900/30">
          Moderate
        </span>
      );
    }
  };

  const isEmpty = recurringIssues.length === 0;

  return (
    <div className="card h-full flex flex-col justify-between overflow-hidden">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recurring Issues</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">Most frequent accessibility violations across audited websites</p>
      </div>

      <div className="flex-1 overflow-x-auto">
        {isEmpty ? (
          <div className="text-center py-12">
            <p className="text-gray-400 dark:text-gray-500 text-sm">No recurring violations recorded.</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700/50">
            <thead>
              <tr className="text-left text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                <th className="pb-3 pr-4">Issue</th>
                <th className="pb-3 px-4">Severity</th>
                <th className="pb-3 px-4 text-right">Occurrences</th>
                <th className="pb-3 pl-4">Frequency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700/50 text-sm">
              {recurringIssues.map((issue) => (
                <tr
                  key={issue.id}
                  className="hover:bg-gray-50/50 dark:hover:bg-gray-900/10 transition-colors"
                >
                  <td className="py-3.5 pr-4 font-medium text-gray-900 dark:text-white max-w-xs sm:max-w-md truncate">
                    <div className="flex flex-col">
                      <span>{issue.title}</span>
                      <span className="text-xs text-gray-400 dark:text-gray-500 font-mono mt-0.5">ID: {issue.id}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {getImpactBadge(issue.id)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-gray-700 dark:text-gray-300">
                    {issue.count}
                  </td>
                  <td className="py-3.5 pl-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getFrequencyBarColor(issue.frequency)}`}
                          style={{ width: `${Math.min(issue.frequency, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 min-w-[2.5rem]">
                        {issue.frequency}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
