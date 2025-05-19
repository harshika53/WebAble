import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Info, ArrowRight, ExternalLink } from 'lucide-react';
import ScanUrlForm from '../components/ScanUrlForm';
import AccessibilityScoreCard from '../components/AccessibilityScoreCard';
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
            Scan your website for accessibility issues and get actionable recommendations to make your site more inclusive.
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

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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
          <a 
            href="#" 
            className="group flex items-center text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            Learn more <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
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
          <a 
            href="#" 
            className="group flex items-center text-sm font-medium text-warning-600 hover:text-warning-700"
          >
            View examples <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="card bg-success-50 border-success-100"
        >
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-success-100">
            <CheckCircle2 className="h-5 w-5 text-success-600" />
          </div>
          <h3 className="mb-2 text-lg font-medium">Business Benefits</h3>
          <p className="mb-4 text-gray-600">
            Accessible websites reach larger audiences, improve SEO, and help avoid legal complications.
          </p>
          <a 
            href="#" 
            className="group flex items-center text-sm font-medium text-success-600 hover:text-success-700"
          >
            Read case studies <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
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
                  Simply paste any website URL to begin the accessibility analysis.
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
                <p className="text-gray-600">
                  Our system scans your website using Lighthouse and axe-core for comprehensive testing.
                </p>
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

      {/* Demo section with sample data */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="card bg-gray-50 border-gray-100 mt-12"
      >
        <h2 className="mb-6 text-2xl font-bold text-gray-900">
          Sample Analysis
        </h2>
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="flex items-center space-x-2 mb-4">
                <ExternalLink className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-600">example.com</span>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Critical Issues</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-error-500 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Low contrast text</p>
                        <p className="text-xs text-gray-500">Button text does not meet 4.5:1 contrast ratio</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-error-500 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Missing image alt text</p>
                        <p className="text-xs text-gray-500">5 images missing alternative text</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-warning-500 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Form label missing</p>
                        <p className="text-xs text-gray-500">Search form input has no associated label</p>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Recommendations</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-success-500 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Increase text contrast</p>
                        <p className="text-xs text-gray-500">Change button text to #FFFFFF and background to #2563EB</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-success-500 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Add alt text to images</p>
                        <p className="text-xs text-gray-500">Provide descriptive alternative text for all images</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <AccessibilityScoreCard 
              score={72}
              metrics={{
                performance: 85,
                accessibility: 72,
                bestPractices: 92,
                seo: 88
              }}
            />
          </div>
        </div>
      </motion.div>

      <RecentScansSection />
    </div>
  );
};

export default Dashboard;