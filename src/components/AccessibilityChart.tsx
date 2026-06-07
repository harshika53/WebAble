// Radar/bar chart showing category scores using recharts
// Install: npm install recharts

import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, Tooltip,
} from 'recharts';

interface ChartData {
  category: string;
  score: number;
}

interface AccessibilityChartProps {
  data: ChartData[];
}

export const AccessibilityChart = ({ data }: AccessibilityChartProps) => (
  <div className="w-full h-72 bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
    <h3 className="text-sm font-semibold text-gray-700 mb-2">Score Breakdown</h3>
    <ResponsiveContainer width="100%" height="90%">
      <RadarChart data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="category" tick={{ fontSize: 12 }} />
        <Radar
          name="Score"
          dataKey="score"
          stroke="#6366f1"
          fill="#6366f1"
          fillOpacity={0.3}
        />
        <Tooltip />
      </RadarChart>
    </ResponsiveContainer>
  </div>
);