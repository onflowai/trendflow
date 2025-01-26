import { SitemapStream, streamToPromise } from 'sitemap';
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
      // Add more static URLs here
    ];

    // TODO: Fetch dynamic URLs from your database
    /*
    const blogs = await Blog.find({});
    blogs.forEach(blog => {
      links.push({
        url: `/blogs/${blog.slug}`,
        changefreq: 'weekly',
        priority: 0.8,
      });
    });
    */

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
