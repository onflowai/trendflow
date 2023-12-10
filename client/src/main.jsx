import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
/**
 * Main Entry Point this is where top-level React component gets rendered.
 * ReactDOM
 * React Strict Mode will creates additional checks
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
