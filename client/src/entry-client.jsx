import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext.jsx';
import routes from './routes.jsx';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

import { HelmetProvider } from 'react-helmet-async';

/**
 * entry-client is the main client entry point for the app
 * it sets up:
 *  - createBrowserRouter with your universal routes
 *  - ThemeProvider for theming
 *  - HelmetProvider for SEO meta tags in the client
 *  - ToastContainer for react-toastify
 *  - React.StrictMode for additional checks
 */
const router = createBrowserRouter(routes); //creating the browser router from universal routes

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <ThemeProvider>
        <RouterProvider router={router} />
        <ToastContainer
          position="bottom-center"
          hideProgressBar={true}
          closeButton={true}
          closeOnClick
          rtl={false}
          draggable
          icon={false}
        />
      </ThemeProvider>
    </HelmetProvider>
  </React.StrictMode>
); //rendering everything to #root
