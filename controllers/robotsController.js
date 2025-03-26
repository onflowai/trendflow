/**
 * Controller to serve robots.txt
 *
 * @param {Request} req
 * @param {Response} res
 */
export const serveRobotsTxt = (req, res) => {
  const env = process.env.NODE_ENV || 'development';
  const PROD_URL = process.env.PROD_URL;
  console.log('PROD_URL: ', PROD_URL);
  const FRONT_URL = env === 'production' ? PROD_URL : process.env.DEV_URL;
  const SERVER_URL =
    env === 'production' ? PROD_URL : process.env.DEV_URL_SERVER;

  const robotsTxt = `
User-agent: *
Allow: /
Disallow: /dashboard
Disallow: /create-blog
Disallow: /edit-blog
Disallow: /submit
Disallow: /admin
Disallow: /profile
Disallow: /edit-trend
Disallow: /trend
Disallow: /settings
Sitemap: ${
    env === 'production'
      ? `${PROD_URL}/sitemap.xml`
      : `${SERVER_URL}/sitemap.xml`
  }
`.trim();

  res.type('text/plain');
  res.send(robotsTxt);
};
