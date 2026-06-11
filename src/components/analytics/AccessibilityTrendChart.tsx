import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import type { TrendData } from '../../services/analyticsService';

interface AccessibilityTrendChartProps {
  trendData: TrendData;
  period: 'daily' | 'weekly' | 'monthly';
  onPeriodChange: (period: 'daily' | 'weekly' | 'monthly') => void;
}

export const AccessibilityTrendChart: React.FC<AccessibilityTrendChartProps> = ({
  trendData,
  period,
  onPeriodChange,
}) => {
  // Format trend data for Recharts: list of objects { name: label, score: value }
  const chartData = trendData.labels.map((label, idx) => ({
    name: label,
    score: trendData.scores[idx],
  }));

  const isEmpty = chartData.length === 0;

  // Custom tool-tip component for clean UI styling
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border border-gray-200 dark:border-gray-700 p-3 rounded-lg shadow-lg">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{label}</p>
          <p className="text-sm font-bold text-primary-600 dark:text-primary-400 mt-1">
            Score: <span className="text-lg font-extrabold">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card h-full flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Accessibility Score Progress</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Score trends by daily, weekly, or monthly aggregations</p>
        </div>

        {/* Period selection controls */}
        <div className="inline-flex rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 p-1">
          {(['daily', 'weekly', 'monthly'] as const).map((p) => (
            <button
              key={p}
              onClick={() => onPeriodChange(p)}
              className={`rounded-md px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                period === p
                  ? 'bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 shadow-sm border border-gray-100 dark:border-gray-700/30'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 min-h-[300px] flex items-center justify-center">
        {isEmpty ? (
          <div className="text-center py-10">
            <p className="text-gray-400 dark:text-gray-500 text-sm">No historical data points available in this period.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="scoreGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-gray-800/40" />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                dy={10}
                style={{ fontSize: '11px', fill: '#94a3b8' }}
              />
              <YAxis
                domain={[0, 100]}
                tickLine={false}
                axisLine={false}
                dx={-10}
                style={{ fontSize: '11px', fill: '#94a3b8' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ r: 4, stroke: '#2563eb', strokeWidth: 2, fill: '#ffffff' }}
                activeDot={{ r: 6, strokeWidth: 0, fill: '#3b82f6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
