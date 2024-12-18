// utils/fetchRelatedTrends.js
import trendModel from '../models/trendModel.js';

/**
 * Fetch related trends based on category, technology, and views with fallback logic for insufficient results.
 *
 * @param {Object} trendObject - The main trend object
 * @returns {Array} - Array of related trends
 */
export const fetchRelatedTrends = async (trendObject) => {
  try {
    // Keep track of fetched trend IDs to prevent duplicates
    const fetchedTrendIds = new Set();
    fetchedTrendIds.add(trendObject._id.toString());

    // Primary query: finds trends in the same category and tech
    let relatedTrends = await trendModel
      .find({
        _id: { $nin: Array.from(fetchedTrendIds) }, // exclude current trend and already fetched trends
        trendCategory: trendObject.trendCategory, // match category
        trendTech: trendObject.trendTech, // match technology
        isApproved: true, // only approved trends
      })
      .populate('createdBy', 'username profile_img githubUsername privacy -_id') // populate createdBy
      .sort({ views: -1 }) // sort primarily by views
      .limit(6); // limit results to 5

    // Add fetched trend IDs to the set
    relatedTrends.forEach((trend) => {
      fetchedTrendIds.add(trend._id.toString());
    });

    // Fallback 1: if fewer than 5 results, remove the trendTech filter
    if (relatedTrends.length < 5) {
      const fallbackTrends = await trendModel
        .find({
          _id: { $nin: Array.from(fetchedTrendIds) }, // exclude already fetched trends
          trendCategory: trendObject.trendCategory, // only match category
          isApproved: true,
        })
        .populate(
          'createdBy',
          'username profile_img githubUsername privacy -_id'
        ) // populate createdBy
        .sort({ views: -1 }) // sort by views
        .limit(6 - relatedTrends.length);

      relatedTrends = [...relatedTrends, ...fallbackTrends];

      // Add fetched trend IDs to the set
      fallbackTrends.forEach((trend) => {
        fetchedTrendIds.add(trend._id.toString());
      });
    }

    // Fallback 2: if still fewer than 5, get most popular trends overall
    if (relatedTrends.length < 5) {
      const moreFallbackTrends = await trendModel
        .find({
          _id: { $nin: Array.from(fetchedTrendIds) }, // exclude already fetched trends
          isApproved: true,
        })
        .populate(
          'createdBy',
          'username profile_img githubUsername privacy -_id'
        ) // populate createdBy
        .sort({ views: -1 }) // sort by views
        .limit(6 - relatedTrends.length);

      relatedTrends = [...relatedTrends, ...moreFallbackTrends];

      // Add fetched trend IDs to the set
      moreFallbackTrends.forEach((trend) => {
        fetchedTrendIds.add(trend._id.toString());
      });
    }

    return relatedTrends;
  } catch (error) {
    console.error('Error fetching related trends:', error.message);
    throw new Error('Error fetching related trends');
  }
};
