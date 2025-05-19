import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, ChevronDown, AlertTriangle } from 'lucide-react';
import ScanUrlForm from '../components/ScanUrlForm';

const ScanPage = () => {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [expandedOptions, setExpandedOptions] = useState(false);

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

  const handleSubmit = (url: string) => {
  console.log("Scanning URL:", url); // 👈 Now it's used

  setIsScanning(true);
  
  let step = 0;
  const interval = setInterval(() => {
    if (step < steps.length) {
      setCurrentStep(step);
      step++;
    } else {
      clearInterval(interval);
      navigate(`/report/${encodeURIComponent(url)}`); // 👈 use it here optionally
    }
  }, 800);
};


  // Toggle advanced options visibility
  const toggleOptions = () => {
    setExpandedOptions(!expandedOptions);
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
        <h2 className="text-xl font-semibold mb-4">Website URL</h2>
        <ScanUrlForm onSubmit={handleSubmit} isScanning={isScanning} />
        
        <div className="mt-6">
          <button 
            onClick={toggleOptions} 
            className="flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ChevronDown className={`h-4 w-4 mr-1 transition-transform ${expandedOptions ? 'rotate-180' : ''}`} />
            Advanced options
          </button>
          
          {expandedOptions && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
              className="mt-4 pt-4 border-t border-gray-200"
            >
              <h3 className="text-sm font-medium text-gray-900 mb-3">Scan Configuration</h3>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="mobile"
                    className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                    defaultChecked={true}
                  />
                  <label htmlFor="mobile" className="ml-2 text-sm text-gray-600">
                    Mobile viewport
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="desktop"
                    className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                    defaultChecked={true}
                  />
                  <label htmlFor="desktop" className="ml-2 text-sm text-gray-600">
                    Desktop viewport
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="crawl"
                    className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                  />
                  <label htmlFor="crawl" className="ml-2 text-sm text-gray-600">
                    Crawl additional pages (up to 5)
                  </label>
                </div>
              </div>
              
              <h3 className="text-sm font-medium text-gray-900 mt-6 mb-3">Test Standards</h3>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="wcag2a"
                    className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                    defaultChecked={true}
                  />
                  <label htmlFor="wcag2a" className="ml-2 text-sm text-gray-600">
                    WCAG 2.1 A
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="wcag2aa"
                    className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                    defaultChecked={true}
                  />
                  <label htmlFor="wcag2aa" className="ml-2 text-sm text-gray-600">
                    WCAG 2.1 AA
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="wcag2aaa"
                    className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                  />
                  <label htmlFor="wcag2aaa" className="ml-2 text-sm text-gray-600">
                    WCAG 2.1 AAA
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="section508"
                    className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                  />
                  <label htmlFor="section508" className="ml-2 text-sm text-gray-600">
                    Section 508
                  </label>
                </div>
              </div>
            </motion.div>
          )}
        </div>
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
                animate={{ width: `${(currentStep + 1) / steps.length * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-500">
                Step {currentStep + 1} of {steps.length}
              </span>
              <span className="text-xs text-gray-500">
                {Math.floor((currentStep + 1) / steps.length * 100)}% complete
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className={`flex items-center p-2 rounded-md ${
                  index === currentStep 
                    ? "bg-primary-50 text-primary-700" 
                    : index < currentStep 
                      ? "text-gray-600" 
                      : "text-gray-400"
                }`}
              >
                {index < currentStep ? (
                  <CheckCircle2 className="h-5 w-5 text-success-500 mr-2" />
                ) : index === currentStep ? (
                  <motion.div
                    className="h-5 w-5 rounded-full border-2 border-primary-500 border-t-transparent mr-2"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                ) : (
                  <div className="h-5 w-5 rounded-full border-2 border-gray-300 mr-2" />
                )}
                <span className={index <= currentStep ? "font-medium" : ""}>{step}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <div className="card bg-amber-50 border-amber-100">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-amber-800">Important Note</h3>
            <div className="mt-2 text-sm text-amber-700">
              <p>
                Automated accessibility testing can identify many issues, but it cannot catch everything. For a complete evaluation, we recommend:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Manual testing with screen readers</li>
                <li>Keyboard navigation testing</li>
                <li>Testing with real users who have disabilities</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanPage;