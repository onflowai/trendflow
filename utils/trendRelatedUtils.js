import trendModel from '../models/trendModel.js';

/**
 * Fetch related trends based on category, technology, and views with fallback logic for insufficient results.
 *
 * @param {Object} trendObject - The main trend object
 * @returns {Array} - Array of related trends
 */
export const fetchRelatedTrends = async (trendObject) => {
  try {
    // primary query: finds trends in the same category and tech
    let relatedTrends = await trendModel
      .find({
        _id: { $ne: trendObject._id }, // exclude current trend
        trendCategory: trendObject.trendCategory, // match category
        trendTech: trendObject.trendTech, // match technology
        isApproved: true, // only approved trends
      })
      .sort({ views: -1 }) // sort primarily by views
      .limit(5); // limit results to 5 for now

    // fallback 1: if fewer than 5 results, remove the trendTech filter
    if (relatedTrends.length < 5) {
      const fallbackTrends = await trendModel
        .find({
          _id: { $ne: trendObject._id },
          trendCategory: trendObject.trendCategory, // only match category
          isApproved: true,
        })
        .sort({ views: -1 }) // sort by views
        .limit(5 - relatedTrends.length);

      relatedTrends = [...relatedTrends, ...fallbackTrends];
    }

    // fallback 2: if continue fewer than 5 after fallback 1, return the most popular trends overall
    if (relatedTrends.length < 5) {
      const moreFallbackTrends = await trendModel
        .find({
          _id: { $ne: trendObject._id },
          isApproved: true,
        })
        .sort({ views: -1 }) // sort by views
        .limit(5 - relatedTrends.length);

      relatedTrends = [...relatedTrends, ...moreFallbackTrends];
    }

    return relatedTrends;
  } catch (error) {
    console.error('Error fetching related trends:', error.message);
    throw new Error('Error fetching related trends');
  }
};
