import { useState } from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useScanner } from '../hooks/useScanner';

interface ScanUrlFormProps {
  onSubmit?: (url: string) => void;
  isScanning?: boolean;
  disabled?: boolean;
}

const ScanUrlForm = ({ onSubmit, isScanning: externalIsScanning, disabled }: ScanUrlFormProps) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { scan, isScanning: hookIsScanning, error: scanError } = useScanner();

  const isCurrentlyScanning = externalIsScanning !== undefined ? externalIsScanning : hookIsScanning;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      setError('Please enter a URL');
      return;
    }
    
    let processedUrl = trimmedUrl;
    
    if (!/^https?:\/\//i.test(processedUrl)) {
      processedUrl = `https://${processedUrl}`;
    }
    
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i;
    if (!urlPattern.test(processedUrl)) {
      setError('Please enter a valid website URL (e.g., example.com)');
      return;
    }
    
    try {
      new URL(processedUrl);
      setError('');
      
      if (onSubmit) {
        onSubmit(processedUrl);
      } else {
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
            if (error) setError('');
          }}
          disabled={disabled || isCurrentlyScanning}
          aria-label="Website URL"
        />
        <button
          type="submit"
          disabled={disabled || isCurrentlyScanning || !url.trim()}
          aria-live="polite"
          className="btn btn-primary absolute right-1 top-1 bottom-1 disabled:!cursor-not-allowed disabled:opacity-80"
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