import trendModel from '../models/trendModel.js';
import { sanitizeHTML } from '../utils/sanitization.js';
/**
 * This file is used for query construction and execution
 *
 * @returns
 */
/**
 * CONSTRUCT QUERY OBJECT
 * @param {*} search
 * @param {*} trendTech
 * @param {*} trendCategory
 * @param {*} isApproved
 * @returns
 */
export const constructQueryObject = (
  search,
  trendTech,
  trendCategory,
  isApproved
) => {
  const queryObject = {}; // initialize an empty query object
  if (isApproved !== undefined) {
    queryObject.isApproved = isApproved;
  }
  if (search) {
    queryObject.$or = [
      { trend: { $regex: sanitizeHTML(search), $options: 'i' } },
      { trendTech: { $regex: sanitizeHTML(search), $options: 'i' } },
      { trendCategory: { $regex: sanitizeHTML(search), $options: 'i' } },
    ]; //Matching against 'trend', 'trendTech', and 'trendCategory' fields using a 'i' case-insensitive '$regex' regex
  } // if search term exists, add a $or condition to match any of the fields, match trend field with case-insensitive regex
  if (trendTech && trendTech !== 'all') {
    queryObject.trendTech = trendTech; //dropdown query for trendTech
  } // if trendTech is specified and not 'all' add trendTech to the query object
  if (trendCategory && trendCategory !== 'all') {
    queryObject.trendCategory = trendCategory; //dropdown query for trendCategory
  }
  return queryObject; // return the constructed query object
}; //END CONSTRUCT QUERY OBJECT

/**
 * CONSTRUCT SORT KEY
 * Provides sorting keys
 * @param {*} sort
 * @returns
 */
export const constructSortKey = (topRated, topViewed, updated) => {
  const sortingOptions = {
    newest: { updatedAt: -1 },
    oldest: { updatedAt: 1 },
    newestMonth: { updatedAt: -1 },
    newestYear: { updatedAt: -1 },
    topRatedNow: { combinedScore: -1 },
    topRatedYear: { combinedScore: -1 },
    topRatedMonth: { combinedScore: -1 },
    topViewedNow: { views: -1 },
    topViewedYear: { views: -1 },
    topViewedMonth: { views: -1 },
  }; // define sorting options, sort by newest (descending updatedAt) or sort by oldest (ascending updatedAt)
  //return sortingOptions[sort] || { updatedAt: -1 }; // efault to sorting by newest
  const sortKey = {};

  // Apply sorting for topRated if provided
  if (topRated && sortingOptions[topRated]) {
    Object.assign(sortKey, sortingOptions[topRated]);
  }

  // Apply sorting for topViewed if provided
  if (topViewed && sortingOptions[topViewed]) {
    Object.assign(sortKey, sortingOptions[topViewed]);
  }

  // Apply sorting for updated if provided
  if (updated && sortingOptions[updated]) {
    Object.assign(sortKey, sortingOptions[updated]);
  }

  // Default to sorting by 'newest' if no valid sort key is provided
  return Object.keys(sortKey).length > 0 ? sortKey : { updatedAt: -1 };
  // return sortingOptions[sort] || null; // return the corresponding sort key or null if not found
}; //END CONSTRUCT SORT KEY

/**
 * PAGINATE AND SORT TRENDS
 * Handles the sorting
 * @param {*} queryObject
 * @param {*} sortKey
 * @param {*} page
 * @param {*} limit
 * @param {*} cursor
 * @returns
 */
export const paginateAndSortTrends = async (
  queryObject,
  sortKey,
  page,
  limit,
  cursor
) => {
  let skip = 0;
  if (cursor) {
    queryObject._id = { $gt: cursor }; // Fetch documents after this _id for cursor-based pagination
  } else {
    skip = (page - 1) * limit; // calculate the number of documents to skip (skipping 0 trends, displaying all 10 then skipping them to next 10)
  } // check if cursor-based pagination is used
  const [trends, totalTrends] = await Promise.all([
    // execute both queries in parallel
    trendModel
      .find(queryObject)
      .select('-generatedBlogPost -trendUse')
      .populate('createdBy', 'username githubUsername profile_img privacy -_id')
      .sort(sortKey) // sort the trends based on the sortKey
      .skip(skip || 0) // apply skip only if not using cursor
      .limit(limit + 1), // query trends with pagination and sorting
    trendModel.countDocuments(queryObject), //getting total trends based on query
  ]); // query trends with pagination and sorting

  const hasNextPage = trends.length > limit; // check if there is a next page
  if (hasNextPage) {
    trends.pop(); // remove the extra document from results
  }

  const nextCursor = hasNextPage ? trends[trends.length - 1]._id : null; // set nextCursor for the next batch
  const pagesNumber = Math.ceil(totalTrends / limit); //calculating the page
  return { totalTrends, pagesNumber, trends, nextCursor, hasNextPage };
}; //END PAGINATE AND SORT TRENDS

/**
 * CALCULATE SCORE
 * @param {*} t_score
 * @param {*} views
 * @param {*} trendStatus
 * @param {*} f_score
 * @returns
 */
export const calculateCombinedScore = (
  t_score,
  views,
  trendStatus,
  f_score
) => {
  const weights = {
    t_score: 0.4,
    views: 0.3,
    trendStatus: 0.1,
    f_score: 0.2,
  };
  const statusValue = (() => {
    switch (trendStatus) {
      case 'breakout':
        return 1.2;
      case 'trending':
        return 1.1;
      case 'cool-off':
        return 0.9;
      case 'static':
        return 0.8;
      case 'undefined':
      default:
        return null; // If status is undefined, do not use statusValue
    }
  })();
  const combinedScore =
    t_score * weights.t_score +
    views * weights.views +
    f_score * weights.f_score;
  if (statusValue !== null) {
    return combinedScore + statusValue * weights.trendStatus;
  }
  return combinedScore;
};
