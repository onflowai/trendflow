import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
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
    url: 'https://yourdomain.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://yourdomain.com/search?q={search_term_string}',
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
