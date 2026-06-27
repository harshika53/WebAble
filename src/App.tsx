import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ScanPage from './pages/ScanPage';
import ReportPage from './pages/ReportPage';
import HistoryPage from './pages/HistoryPage';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import NotFoundPage from './pages/NotFoundPage';
import { PostHogProvider } from './utils/posthog/PostHogProvider';

function App() {
  return (
    <PostHogProvider>
      <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="scan" element={<ScanPage />} />
        <Route path="report/:scanId" element={<ReportPage />} />
        <Route path="report" element={<ReportPage />} />
        <Route path="analytics" element={<AnalyticsDashboard />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
    </PostHogProvider>
  );
}

export default App;