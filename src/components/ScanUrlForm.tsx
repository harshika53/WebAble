import { useState } from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useScanner } from '../hooks/useScanner';

interface ScanUrlFormProps {
  onSubmit?: (url: string) => void;
  isScanning?: boolean;
}

const ScanUrlForm = ({ onSubmit, isScanning: externalIsScanning }: ScanUrlFormProps) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { scan, isScanning: hookIsScanning, error: scanError } = useScanner();

  // Use external isScanning if provided, otherwise use hook's isScanning
  const isCurrentlyScanning = externalIsScanning !== undefined ? externalIsScanning : hookIsScanning;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic URL validation
    if (!url) {
      setError('Please enter a URL');
      return;
    }
    
    let processedUrl = url;
    
    // Add protocol if missing
    if (!/^https?:\/\//i.test(url)) {
      processedUrl = `https://${url}`;
    }
    
    try {
      new URL(processedUrl);
      setError('');
      
      // If onSubmit prop is provided, use it (for external control)
      if (onSubmit) {
        onSubmit(processedUrl);
      } else {
        // Otherwise, handle scan internally
        console.log('Starting scan for URL:', processedUrl);
        const result = await scan(processedUrl);
        
        if (result && result.id) {
          console.log('Scan successful, navigating to report:', result.id);
          navigate(`/report/${result.id}`);
        } else if (scanError) {
          setError(scanError);
        } else {
          setError('Scan failed. Please try again.');
        }
      }
    } catch (err) {
      console.error('URL validation error:', err);
      setError('Please enter a valid URL');
    }
  };

  // Show scan error if it exists
  const displayError = error || scanError;

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-xl">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="input pl-10 w-full"
          placeholder="Enter any website URL"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            // Clear errors when user starts typing
            if (error) setError('');
          }}
          disabled={isCurrentlyScanning}
          aria-label="Website URL"
        />
        <button
          type="submit"
          className="btn btn-primary absolute right-1 top-1 bottom-1"
          disabled={isCurrentlyScanning || !url.trim()}
        >
          {isCurrentlyScanning ? (
            <>
              <motion.div
                className="h-4 w-4 rounded-full border-2 border-white border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <span className="ml-2">Scanning...</span>
            </>
          ) : (
            "Analyze"
          )}
        </button>
      </div>
      {displayError && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-error-600"
        >
          {displayError}
        </motion.p>
      )}
    </form>
  );
};

export default ScanUrlForm;