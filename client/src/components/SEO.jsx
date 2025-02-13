import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
/**
 * SEO used in pages
 * using react-helmet to inject various meta tags into the <head> section of your HTML
 * these meta tags include the page title, description, canonical URL, Open Graph data for social media sharing
 * NOTE: sitemap.xml and robots.txt are generated automatically in sitemapController and robotsController
 * @param {*} param0
 * @returns
 */
const SEO = ({ title, description, url, image }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
    </Helmet>
  );
};

export default SEO;
