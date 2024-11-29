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
  isApproved,
  status
) => {
  const queryObject = {}; // initialize an empty query object
  if (status === 'approved') {
    queryObject.isApproved = true;
  } else if (status === 'un-approved') {
    queryObject.isApproved = false;
  } else {
    if (status && status !== 'all') {
      queryObject.trendStatus = status;
    }
    if (isApproved !== undefined) {
      queryObject.isApproved = isApproved;
    } //important if
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
  // if (status && status !== 'all') {
  //   queryObject.trendStatus = status;
  // }
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
  //let skip = 0;
  const sortFields = { ...sortKey, _id: 1 }; // add _id as a tie-breaker
  if (cursor) {
    const [updatedAtCursor, idCursor] = cursor.split('|'); // split the cursor into updatedAt and _id
    queryObject.$or = [
      { updatedAt: { $lt: updatedAtCursor } }, // fetch records with earlier updatedAt
      {
        updatedAt: updatedAtCursor, // handle tie-breaking for trends with the same updatedAt
        _id: { $gt: idCursor },
      },
    ];
  }

  // cursor-based pagination: no need for skip
  const trendsQuery = trendModel
    .find(queryObject)
    .select('-generatedBlogPost -trendUse') // exclude unnecessary fields
    .populate('createdBy', 'username githubUsername profile_img privacy -_id')
    .sort(sortFields) // sort the trends based on the sortKey
    .limit(limit + 1); //query trends with pagination fetch one extra to determine if there’s a next page

  const [trends, totalTrends] = await Promise.all([
    trendsQuery,
    trendModel.countDocuments(queryObject),
  ]); //getting total trends based on query

  const hasNextPage = trends.length > limit; // check if there is a next page
  if (hasNextPage) {
    trends.pop(); // remove the extra document from results
  }

  const nextCursor = hasNextPage
    ? `${trends[trends.length - 1].updatedAt}|${trends[trends.length - 1]._id}`
    : null; // generate the nextCursor using updatedAt and _id of the last document

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
