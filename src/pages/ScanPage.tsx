import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2} from 'lucide-react';
import ScanUrlForm from '../components/ScanUrlForm';
import { useScanner } from '../hooks/useScanner';

const ScanPage = () => {
  const navigate = useNavigate();
  const { scan, isScanning } = useScanner();

  const steps = [
    "Initializing scan",
    "Analyzing HTML structure",
    "Checking ARIA attributes",
    "Evaluating color contrast",
    "Testing keyboard navigation",
    "Verifying forms and inputs",
    "Checking media elements",
    "Generating report"
  ];

  const handleSubmit = async (url: string) => {
    const result = await scan(url);
    if (result) {
      navigate(`/report/${result.id}`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold mb-4">Start a New Accessibility Scan</h1>
        <p className="text-gray-600">
          Enter a URL to analyze your website for accessibility issues and get detailed recommendations.
        </p>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Scan Website URL</h2>
        <ScanUrlForm onSubmit={handleSubmit} isScanning={isScanning} />
      </div>

      {isScanning && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="card"
        >
          <h2 className="text-xl font-semibold mb-4">Scan in Progress</h2>

          <div className="mb-6">
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `12.5%` }} // Adjusted static progress
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-500">
                Step 1 of {steps.length}
              </span>
              <span className="text-xs text-gray-500">
                12% complete
              </span>
            </div>
          </div>

          <div className="space-y-2">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex items-center p-2 rounded-md ${
                  index === 0
                    ? "bg-primary-50 text-primary-700"
                    : index < 0
                      ? "text-gray-600"
                      : "text-gray-400"
                }`}
              >
                {index < 0 ? (
                  <CheckCircle2 className="h-5 w-5 text-success-500 mr-2" />
                ) : index === 0 ? (
                  <motion.div
                    className="h-5 w-5 rounded-full border-2 border-primary-500 border-t-transparent mr-2"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                ) : (
                  <div className="h-5 w-5 rounded-full border-2 border-gray-300 mr-2" />
                )}
                <span className={index <= 0 ? "font-medium" : ""}>{step}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Accessibility Score Explained Section */}
      <div className="card bg-slate-200 border-blue-100">
        <div className="flex">
          <div className="ml-3 flex items-center">
            <h3 className="text-lg font-semibold text-blue-950 flex items-center">
              Understanding Accessibility Score
              <span className="ml-2">
                <svg className="inline h-5 w-5 text-blue-700" fill="none" viewBox="0 0 20 20">
                  <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14.5A6.5 6.5 0 1110 3.5a6.5 6.5 0 010 13zm.75-10.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm-1.5 2.5a.75.75 0 011.5 0v5a.75.75 0 01-1.5 0v-5z" fill="currentColor"/>
                </svg>
              </span>
            </h3>
          </div>
        </div>
        <div className="ml-3 mt-2 text-sm">
          <ul className="list-disc list-inside space-y-1">
            <li className="font-semibold text-green-700">90–100: Great! Your website is mostly accessible </li>
            <li className="font-semibold text-blue-600">70–89: Good, but a few issues to fix.</li>
            <li className="font-semibold text-yellow-600">Below 70: Needs improvement — see the issues listed.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ScanPage;