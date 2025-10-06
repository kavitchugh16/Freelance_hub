// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // <-- Import Toaster
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Toaster position="top-right" />  {/* <-- Hot toast notifications */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
