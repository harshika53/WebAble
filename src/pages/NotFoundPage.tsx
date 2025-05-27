import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, Home } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center text-center max-w-md mx-auto py-12"
    >
      <div className="rounded-full bg-error-100 p-6 mb-6">
        <AlertTriangle className="h-16 w-16 text-error-500" />
      </div>
      
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
      
      <p className="text-lg text-gray-600 mb-8">
        We couldn't find the page you're looking for. The link might be incorrect or the page may have been moved.
      </p>
      
      <div className="space-x-4">
        <Link to="/" className="btn btn-primary">
          <Home className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>
      </div>
    </motion.div>
  );
};

export default NotFoundPage;