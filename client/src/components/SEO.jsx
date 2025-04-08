import React from 'react';
import { Helmet } from 'react-helmet-async';
/**
 * SEO used in pages
 * using react-helmet to inject various meta tags into the <head> section of your HTML
 * these meta tags include the page title, description, canonical URL, Open Graph data for social media sharing
 * NOTE: sitemap.xml and robots.txt are generated automatically in sitemapController and robotsController
 * @param {*} param0
 * @returns
 */
const FRONTEND_BASE_URL = import.meta.env.VITE_DEV_BASE_URL;
const SEO = ({
  title = 'TrendFlow - Find Tech Trends',
  description = 'TrendFlow helps you track the latest trends in tech.',
  url = `${FRONTEND_BASE_URL}`,
  img_small = `${FRONTEND_BASE_URL}/og-image-twitter.jpg`,
  img_large = `${FRONTEND_BASE_URL}/og-image.jpg`,
  twitterCardType = 'summary_large_image',
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={img_large} />
      <meta name="twitter:card" content={twitterCardType} />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={img_small} />
    </Helmet>
  );
};

export default SEO;
