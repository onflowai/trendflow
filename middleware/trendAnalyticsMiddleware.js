// import { redisClient } from '../redisClient.js';
import trendModel from '../models/trendModel.js';
/**
 * Here calculation are made for statistics metrics such as count of views per each trend viewed
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const incrementViews = async (req, res, next) => {
  const { slug } = req.params;
  try {
    const trend = await trendModel.findOneAndUpdate(
      { slug: slug },
      { $inc: { views: 1 } },
      { new: true }
    );
    // await redisClient.hIncrBy('trend_views', slug, 1); //storing trend view in a hash structure within Redis under name 'trend_views'
    // //check if the trend document was found and updated successfully
    if (!trend) {
      console.error('Trend not found for slug:', slug);
      next(new Error('Trend not found'));
      return; // Stop further execution if you are calling next with an error
    }
    next();
  } catch (error) {
    console.error('Error incrementing views for slug:', slug, error);
    //here logging the error and optionally continuing to the next middleware.
    next(error); //pass the error to the next middleware (possibly a centralized error handler)
  }
};
