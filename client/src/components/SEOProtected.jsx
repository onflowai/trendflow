import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
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
