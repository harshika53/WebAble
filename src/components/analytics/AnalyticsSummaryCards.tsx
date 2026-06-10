import React from 'react';
import { BarChart2, CheckCircle2, TrendingUp, ShieldAlert, Award } from 'lucide-react';
import type { AnalyticsOverview } from '../../services/analyticsService';

interface AnalyticsSummaryCardsProps {
  overview: AnalyticsOverview;
}

export const AnalyticsSummaryCards: React.FC<AnalyticsSummaryCardsProps> = ({ overview }) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 75) return 'text-blue-600 dark:text-blue-400';
    if (score >= 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const cards = [
    {
      title: 'Total Scans',
      value: overview.totalScans,
      icon: <BarChart2 className="h-6 w-6 text-primary-500" />,
      description: 'Total accessibility audits',
      bgColor: 'bg-primary-50 dark:bg-primary-950/20',
      borderColor: 'border-primary-100 dark:border-primary-900/30',
    },
    {
      title: 'Average Score',
      value: `${overview.averageScore}/100`,
      icon: <TrendingUp className="h-6 w-6 text-accent-500" />,
      description: 'Overall aggregate score',
      bgColor: 'bg-accent-50 dark:bg-accent-950/20',
      borderColor: 'border-accent-100 dark:border-accent-900/30',
      valueClass: getScoreColor(overview.averageScore),
    },
    {
      title: 'Best Score',
      value: `${overview.bestScore}/100`,
      icon: <Award className="h-6 w-6 text-green-500" />,
      description: 'Highest score achieved',
      bgColor: 'bg-success-50 dark:bg-success-950/20',
      borderColor: 'border-success-100 dark:border-success-900/30',
      valueClass: getScoreColor(overview.bestScore),
    },
    {
      title: 'Worst Score',
      value: `${overview.worstScore}/100`,
      icon: <ShieldAlert className="h-6 w-6 text-red-500" />,
      description: 'Lowest score recorded',
      bgColor: 'bg-error-50 dark:bg-error-950/20',
      borderColor: 'border-error-100 dark:border-error-900/30',
      valueClass: getScoreColor(overview.worstScore),
    },
    {
      title: 'Latest Score',
      value: `${overview.latestScore}/100`,
      icon: <CheckCircle2 className="h-6 w-6 text-blue-500" />,
      description: 'Latest scan accessibility',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
      borderColor: 'border-blue-100 dark:border-blue-900/30',
      valueClass: getScoreColor(overview.latestScore),
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`card border transition-all duration-300 hover:shadow-md hover:-translate-y-1 ${card.bgColor} ${card.borderColor}`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {card.title}
            </span>
            <div className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700/50">
              {card.icon}
            </div>
          </div>
          <div className="flex flex-col">
            <span className={`text-2xl font-bold tracking-tight ${card.valueClass || 'text-gray-900 dark:text-white'}`}>
              {card.value}
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {card.description}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
