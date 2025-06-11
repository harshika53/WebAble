import { useNavigate } from 'react-router-dom';
import ScanUrlForm from '../components/ScanUrlForm';
import { useScanner } from '../hooks/useScanner';

const ScanPage = () => {
  const navigate = useNavigate();
  const { scan, isScanning } = useScanner();

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
        {isScanning && (
          <>
          <div className="mt-4 text-blue-700 font-medium">
            Scanning started, this may take a few minutes... 
          </div>
          </>
        )}
      </div>
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