import React from 'react';
import * as ReactHelmetAsync from 'react-helmet-async';
const { Helmet, HelmetProvider } = ReactHelmetAsync;
const FRONTEND_BASE_URL = import.meta.env.VITE_DEV_BASE_URL;
/**
 * StructuredData
 * injects structured data into your webpage using JSON-LD
 * helps search engines understand the content and context of the website
 * enhancing visibility in search results with rich snippets
 * @returns
 */
const StructuredData = () => {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'TrendFlow',
    url: FRONTEND_BASE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${FRONTEND_BASE_URL}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(data)}</script>
    </Helmet>
  );
};

export default StructuredData;
