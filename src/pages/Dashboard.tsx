import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import ScanUrlForm from '../components/ScanUrlForm';
import RecentScansSection from '../components/RecentScansSection';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);

  const handleSubmit = (url: string) => {
  setIsScanning(true);

  setTimeout(() => {
    setIsScanning(false);
    navigate(`/report/${encodeURIComponent(url)}`);
  }, 2000);
};


  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card"
      >
        <div className="mx-auto max-w-2xl text-center mb-8">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Analyze Your Website's Accessibility
          </h1>
          <p className="text-lg text-gray-600">
            Enter a URL to analyze its accessibility compliance and get detailed recommendations.
          </p>
        </div>
        
        <ScanUrlForm onSubmit={handleSubmit} isScanning={isScanning} />

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <div className="flex items-center text-sm text-gray-600">
            <CheckCircle2 className="mr-2 h-5 w-5 text-success-500" />
            <span>WCAG Guidelines</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <CheckCircle2 className="mr-2 h-5 w-5 text-success-500" />
            <span>Performance Metrics</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <CheckCircle2 className="mr-2 h-5 w-5 text-success-500" />
            <span>SEO Impact</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <CheckCircle2 className="mr-2 h-5 w-5 text-success-500" />
            <span>Detailed Reports</span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="card bg-primary-50 border-primary-100"
        >
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
            <Info className="h-5 w-5 text-primary-600" />
          </div>
          <h3 className="mb-2 text-lg font-medium">Why Accessibility Matters</h3>
          <p className="mb-4 text-gray-600">
            Web accessibility ensures your content is usable by everyone, including people with disabilities.
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="card bg-warning-50 border-warning-100"
        >
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-warning-100">
            <AlertTriangle className="h-5 w-5 text-warning-600" />
          </div>
          <h3 className="mb-2 text-lg font-medium">Common Issues</h3>
          <p className="mb-4 text-gray-600">
            Low contrast text, missing alt tags, and keyboard navigation issues are frequent accessibility problems.
          </p>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-12"
      >
        <h2 className="mb-6 text-2xl font-bold text-gray-900">
          How It Works
        </h2>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="relative">
            <div className="absolute left-8 top-8 -ml-px h-full w-0.5 bg-gray-200 lg:left-0 lg:ml-0 lg:w-full lg:h-0.5 lg:top-8"></div>
            <div className="relative flex flex-col pb-8 lg:pb-0">
              <div className="flex items-center mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 text-white">
                  1
                </div>
                <h3 className="ml-4 text-lg font-medium">Enter Your URL</h3>
              </div>
              <div className="ml-14 lg:ml-0 lg:mt-3">
                <p className="text-gray-600">
                  Enter any website URL to begin the accessibility analysis.
                </p>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute left-8 top-8 -ml-px h-full w-0.5 bg-gray-200 lg:left-0 lg:ml-0 lg:w-full lg:h-0.5 lg:top-8"></div>
            <div className="relative flex flex-col pb-8 lg:pb-0">
              <div className="flex items-center mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 text-white">
                  2
                </div>
                <h3 className="ml-4 text-lg font-medium">Automated Analysis</h3>
              </div>
              <div className="ml-14 lg:ml-0 lg:mt-3">
               
                  The system scans your website using Lighthouse and axe-core for comprehensive testing.
               
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="relative flex flex-col">
              <div className="flex items-center mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 text-white">
                  3
                </div>
                <h3 className="ml-4 text-lg font-medium">Get Results</h3>
              </div>
              <div className="ml-14 lg:ml-0 lg:mt-3">
                <p className="text-gray-600">
                  Receive a detailed report with scores, issues, and specific recommendations for improvement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <RecentScansSection />
    </div>
  );
};

export default Dashboard;