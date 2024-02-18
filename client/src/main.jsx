import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import { ToastContainer } from 'react-toastify';

/**
 * Main Entry Point this is where top-level React component gets rendered.
 * ReactDOM
 * React Strict Mode will creates additional checks
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <ToastContainer
      position="bottom-center"
      hideProgressBar={true}
      closeOnClick
      rtl={false}
      draggable
      icon={false}
    />
  </React.StrictMode>
);
