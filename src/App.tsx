import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import Navbar from './components/Navbar';

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="text-center mt-10">
        <h1 className="text-2l font-bold">Accessibility Analyzer</h1>
      </div>
    </BrowserRouter>
  );
};

export default App;
