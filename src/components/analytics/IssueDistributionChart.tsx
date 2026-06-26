import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';
import type { IssueDistribution } from '../../services/analyticsService';

interface IssueDistributionChartProps {
  distribution: IssueDistribution[];
}

// Tailored premium color palette
const COLORS = [
  '#2563eb', // Blue (Contrast)
  '#8b5cf6', // Violet (Text Alternatives)
  '#10b981', // Emerald (Forms & Inputs)
  '#f97316', // Orange (Navigation)
  '#eab308', // Yellow (Language)
  '#06b6d4', // Cyan (ARIA)
  '#64748b', // Slate (Other)
  '#f43f5e', // Rose
  '#ec4899', // Pink
];

export const IssueDistributionChart: React.FC<IssueDistributionChartProps> = ({
  distribution,
}) => {
  const chartData = distribution.map((item) => ({
    name: item.category,
    value: item.count,
  }));

  const totalIssues = chartData.reduce((acc, curr) => acc + curr.value, 0);
  const isEmpty = chartData.length === 0;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const percentage = totalIssues > 0
        ? ((payload[0].value / totalIssues) * 100).toFixed(1)
        : '0';
      return (
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border border-gray-200 dark:border-gray-700 p-3 rounded-lg shadow-lg">
          <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{payload[0].name}</p>
          <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 mt-1">
            Violations: <span className="text-base font-bold">{payload[0].value}</span>
            <span className="text-xs text-gray-400 dark:text-gray-500 ml-1.5">({percentage}%)</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card h-full flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Issues by Category</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">Distribution of violations by WCAG feature categories</p>
      </div>

      <div className="flex-1 min-h-[300px] flex items-center justify-center mt-4">
        {isEmpty ? (
          <div className="text-center py-10">
            <p className="text-gray-400 dark:text-gray-500 text-sm">No issues detected to categorize.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="45%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={50}
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: '11px', color: '#64748b' }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
