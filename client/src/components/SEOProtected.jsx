import React from 'react';
import * as ReactHelmetAsync from 'react-helmet-async';
const { Helmet, HelmetProvider } = ReactHelmetAsync;
/**
 * SEOProtected component to prevent indexing of protected pages.
 * @returns {JSX.Element}
 */
const SEOProtected = () => {
  return (
    <Helmet>
      <meta name="robots" content="noindex, nofollow" />
      <meta name="googlebot" content="noindex, nofollow" />
      <meta name="bingbot" content="noindex, nofollow" />
    </Helmet>
  );
};

export default SEOProtected;
