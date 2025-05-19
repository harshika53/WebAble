import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type TooltipItem
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface AccessibilityScoreCardProps {
  score: number;
  metrics: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
}

const AccessibilityScoreCard = ({ score, metrics }: AccessibilityScoreCardProps) => {
  // Determine score color
  const getScoreColor = (value: number) => {
    if (value >= 90) return '#22c55e'; // success-500
    if (value >= 75) return '#3b82f6'; // primary-500
    if (value >= 50) return '#f59e0b'; // warning-500
    return '#ef4444'; // error-500
  };

  const scoreColor = getScoreColor(score);

  // Chart data
  const data = {
    labels: ['Performance', 'Accessibility', 'Best Practices', 'SEO'],
    datasets: [
      {
        data: [
          metrics.performance,
          metrics.accessibility,
          metrics.bestPractices,
          metrics.seo,
        ],
        backgroundColor: [
          '#3b82f6', // primary-500
          '#8b5cf6', // accent-500
          '#22c55e', // success-500
          '#f59e0b', // warning-500
        ],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          boxWidth: 10,
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: TooltipItem<'doughnut'>) {
            return `${context.label}: ${context.raw}%`;
          },
        },
      },
    },
    cutout: '70%',
    maintainAspectRatio: false,
  };

  return (
    <div className="card h-full flex flex-col">
      <h3 className="text-lg font-medium mb-4">Accessibility Score</h3>
      
      <div className="flex flex-col items-center justify-center mb-4 flex-1">
        <div className="relative w-full h-48">
          <Doughnut data={data} options={options} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div 
                  className="text-4xl font-bold"
                  style={{ color: scoreColor }}
                >
                  {score}
                </div>
                <div className="text-sm text-gray-500">out of 100</div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {Object.entries(metrics).map(([key, value]) => {
          const formattedKey = key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (str) => str.toUpperCase());
          
          return (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{formattedKey}</span>
              <div className="flex items-center">
                <div className="h-2 w-20 bg-gray-200 rounded-full overflow-hidden mr-2">
                  <motion.div 
                    className="h-full rounded-full"
                    style={{ 
                      backgroundColor: getScoreColor(value),
                      width: `${value}%` 
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900">{value}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AccessibilityScoreCard;
