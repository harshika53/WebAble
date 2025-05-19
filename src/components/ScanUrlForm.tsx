import { useState } from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

interface ScanUrlFormProps {
  onSubmit: (url: string) => void;
  isScanning: boolean;
}

const ScanUrlForm = ({ onSubmit, isScanning }: ScanUrlFormProps) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
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
      onSubmit(processedUrl);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError('Please enter a valid URL');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-xl">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="input pl-10 w-full"
          placeholder="Enter website URL (e.g., example.com)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={isScanning}
          aria-label="Website URL"
        />
        <button
          type="submit"
          className="btn btn-primary absolute right-1 top-1 bottom-1"
          disabled={isScanning}
        >
          {isScanning ? (
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
      {error && <p className="mt-2 text-sm text-error-600">{error}</p>}
    </form>
  );
};

export default ScanUrlForm;