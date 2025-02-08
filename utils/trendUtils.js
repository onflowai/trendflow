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
}; //end constructQueryObject

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
}; //end constructSortKey

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
}; //end calculateCombinedScore

/**
 * PAGINATE AND SORT TRENDS SKIP BASED
 * Handles the sorting
 * @param {Object} queryObject - the Mongoose query filters
 * @param {Object} sortKey     - the Mongoose sort fields
 * @param {number} page        - which page (1-based)
 * @param {number} limit       - how many items per page
 * @param {number} trendLimit  - optional cap on totalTrends
 * @returns
 */
export const paginateAndSortSkip = async (
  queryObject,
  sortKey,
  page,
  limit,
  trendLimit,
  cursor
) => {
  //let skip = 0;
  const skip = (page - 1) * limit; //computing how many docs to skip

  // skip-based pagination: no need for skip
  const trendsQuery = trendModel
    .find(queryObject)
    .select('-generatedBlogPost -trendUse') // exclude unnecessary fields
    .populate('createdBy', 'username githubUsername profile_img privacy -_id')
    .sort(sortKey) // sort the trends based on the sortKey
    .skip(skip)
    .limit(adjustedLimit) // limit trends fetched overall
    .limit(limit); //query trends with pagination fetch one extra to determine if there’s a next page

  const [trends, totalTrendsCount] = await Promise.all([
    trendsQuery,
    trendModel.countDocuments(queryObject),
  ]); //getting total trends based on query

  const cappedTotalTrends = trendLimit
    ? Math.min(totalTrendsCount, trendLimit)
    : totalTrendsCount; //totalTrends to a `trendLimit`

  const pagesNumber = Math.ceil(cappedTotalTrends / limit); // computing how many pages in total

  const hasNextPage = page < pagesNumber;
  return {
    totalTrends: cappedTotalTrends,
    pagesNumber,
    currentPage: page,
    trends,
    hasNextPage,
  }; //return the pages + hasNextPage
}; //end paginateAndSortSkip

/**
 * PAGINATE AND SORT TRENDS CURSOR BASED
 * Handles the cursor based sorting
 * @param {*} queryObject
 * @param {*} sortKey
 * @param {*} page
 * @param {*} limit
 * @param {*} cursor
 * @returns
 */
export const paginateAndSortCursor = async (
  queryObject,
  sortKey,
  limit,
  cursor,
  trendLimit // optional
) => {
  const sortFields = { ...sortKey, _id: 1 }; // sort by chosen fields + tie-break by _id

  if (cursor) {
    const [updatedAtCursor, idCursor] = cursor.split('|');
    queryObject.$or = [
      { updatedAt: { $lt: updatedAtCursor } },
      {
        updatedAt: updatedAtCursor,
        _id: { $gt: idCursor },
      },
    ];
  } //if a cursor is provided, parse it into [updatedAtCursor, idCursor]
  const findLimit = limit + 1; //always fetch (limit + 1) to detect if theres another page

  //cursor-based pagination: no need for skip
  const trendsQuery = trendModel
    .find(queryObject)
    .select('-generatedBlogPost -trendUse')
    .populate('createdBy', 'username githubUsername profile_img privacy -_id')
    .sort(sortFields)
    .limit(findLimit);
  const [trends, totalTrends] = await Promise.all([
    trendsQuery,
    trendModel.countDocuments(queryObject),
  ]); // compute totalTrends for info if needed
  const hasNextPage = trends.length > limit;
  if (hasNextPage) {
    trends.pop(); // removing the extra doc only return “limit” docs
  } //if we limit+1 docs next page
  let nextCursorValue = null;
  if (hasNextPage && trends.length > 0) {
    const lastTrend = trends[trends.length - 1];
    nextCursorValue = `${lastTrend.updatedAt.toISOString()}|${lastTrend._id}`;
  } // building nextCursor from the last doc’s updatedAt + _id if next page

  return {
    totalTrends,
    trends,
    nextCursor: nextCursorValue,
    hasNextPage,
  };
}; //end paginateAndSortCursor

/**
 * PAGINATE AND SORT TRENDS CURSOR BASED
 * cursor-based pagination by descending views with a global trendLimit cap
 * if totalTrendsCount in the DB is over trendLimit we refuse to paginate more
 * @param {*} queryObject
 * @param {*} sortKey
 * @param {*} limit
 * @param {*} cursor
 * @param {*} trendLimit
 * @returns
 */
export const paginateAndSortCursorViews = async (
  queryObject,
  sortKey,
  limit,
  cursor,
  trendLimit
) => {
  const sortFields = { ...sortKey, _id: -1 }; //descending on sortKey plus _id: -1 for tie-break
  if (cursor) {
    const [viewsCursor, idCursor] = cursor.split('|');
    queryObject.$or = [
      { views: { $lt: Number(viewsCursor) } },
      {
        views: Number(viewsCursor),
        _id: { $lt: idCursor },
      },
    ]; //next chunk is docs with strictly fewer views (views: -1)
  } //if there is a cursor parse it [viewsCursor, idCursor]
  const findLimit = limit + 1; //fetching limit+1 docs to see if there's another page
  const trendsQuery = trendModel
    .find(queryObject)
    .select('-generatedBlogPost -trendUse')
    .populate('createdBy', 'username githubUsername profile_img privacy -_id')
    .sort(sortFields)
    .limit(findLimit);

  const [trends, totalTrendsCount] = await Promise.all([
    trendsQuery,
    trendModel.countDocuments(queryObject),
  ]);
  let hasNextPage = trends.length > limit;
  if (hasNextPage) {
    trends.pop(); // remove extra doc only 'limit' remain
  } // basic hasNextPage check
  let nextCursorValue = null;
  if (hasNextPage && trends.length > 0) {
    const lastTrend = trends[trends.length - 1];
    nextCursorValue = `${lastTrend.views}|${lastTrend._id}`;
  } //building nextCursor from the last doc if we still have a next page
  const usedLimit = trendLimit || Infinity; //enforcing a global trendLimit cap
  const hasReachedCap = totalTrendsCount > usedLimit; //first page if totalTrendsCount > usedLimit
  if (hasReachedCap) {
    hasNextPage = false;
    nextCursorValue = null;
  } // ff actual DB total is > trendLimit set "no next page"
  const cappedTotalTrends = hasReachedCap ? usedLimit : totalTrendsCount; // changes the reported totalTrends

  return {
    totalTrends: cappedTotalTrends,
    trends,
    nextCursor: nextCursorValue,
    hasNextPage,
  };
}; //end paginateAndSortCursorViews
