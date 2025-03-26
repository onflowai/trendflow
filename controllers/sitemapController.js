import { SitemapStream, streamToPromise } from 'sitemap';
import trendBlogModel from '../models/trendBlogModel.js';
import { Readable } from 'stream';

/**
 * Controller to generate and serve sitemap.xml
 *
 * @param {Request} req
 * @param {Response} res
 */
export const generateSitemap = async (req, res) => {
  try {
    const env = process.env.NODE_ENV || 'development';
    const FRONT_URL =
      env === 'production' ? process.env.PROD_URL : process.env.DEV_URL;

    const links = [
      { url: '/', changefreq: 'monthly', priority: 1.0 },
      { url: '/blog', changefreq: 'weekly', priority: 0.9 },
      // Add more static URLs here
    ];

    const publicPosts = await trendBlogModel.find({ isPublic: true }); // query DB for public blog posts

    // fetch dynamic URLs from your database
    publicPosts.forEach((post) => {
      links.push({
        url: `/blog/${post.slug}`,
        changefreq: 'weekly',
        priority: 0.8,
      }); // "url" matches the *front-end* route (ex "/blog/my-post-slug")
    });

    // Create a stream to write to
    const stream = new SitemapStream({
      hostname: FRONT_URL,
    });

    // Convert the stream to a promise
    const xmlString = await streamToPromise(
      Readable.from(links).pipe(stream)
    ).then((data) => data.toString());

    // Set the response header
    res.header('Content-Type', 'application/xml');
    res.send(xmlString);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).send('Internal Server Error');
  }
};
