import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
// import '../firebase'; // Ensure the correct path to your firebase config file

// If your firebase config is in the same folder as main.tsx, use:
import './firebase';

// Or, if it's in the src folder:
 // import './firebase';

// Uncomment the correct import above and ensure the firebase.ts file exists at that location.

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);