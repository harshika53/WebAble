import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import ScanPage from './pages/ScanPage';
// import Layout from './components/Layout';
// import ReportPage from './pages/ReportPage';
// import HistoryPage from './pages/HistoryPage';
// import NotFoundPage from './pages/NotFoundPage';

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="text-center mt-10">
        <h1 className="text-2xl font-bold">WebAble</h1>
      </div>
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="scan" element={<ScanPage />} />
        {/* <Route path="/" element={<Layout />}>
          <Route path="scan" element={<ScanPage />} />
          <Route path="report/:id" element={<ReportPage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route> */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
