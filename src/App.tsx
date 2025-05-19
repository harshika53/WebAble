import { Routes, Route } from 'react-router-dom';
//import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
//import ScanPage from './pages/ScanPage';
//import ReportPage from './pages/ReportPage';
//import HistoryPage from './pages/HistoryPage';
//import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Routes>
      <Route index element={<Dashboard />} />
     {/* <Route path="/" element={<Layout />}>
        <Route path="scan" element={<ScanPage />} />
        <Route path="report/:id" element={<ReportPage />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>*/}
    </Routes>
  );
}

export default App;