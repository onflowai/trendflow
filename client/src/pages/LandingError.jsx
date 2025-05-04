import React from 'react';
import { useRouteError, Link } from 'react-router-dom';
import Container from '../assets/wrappers/ErrorPageContainer';
import errorLogo from '../assets/images/trendflow-error.svg';

/**
 * Public-facing error page (SSR safe).
 */
const LandingError = () => {
  const error = useRouteError();
  const message =
    error?.statusText ||
    error?.message ||
    'Sorry, something went wrong loading this page.';

  return (
    <Container>
      <div className="content">
        <div className="top-bar">
          <img src={errorLogo} alt="TrendFlow Logo" className="logo" />
        </div>
        <div className="text-wrapper">
          <h3>Something Went Wrong</h3>
          <p>{message}</p>
          <Link to="/" className="btn">
            Go Back Home
          </Link>
        </div>
      </div>
    </Container>
  );
};

export default LandingError;
