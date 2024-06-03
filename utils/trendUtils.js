import trendModel from '../models/trendModel.js';
import { sanitizeHTML } from '../utils/sanitization.js';
/**
 * This file is used for query construction and execution
 * @param {*} search
 * @param {*} trendTech
 * @param {*} trendCategory
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
 *
 * @param {*} sort
 * @returns
 */
export const constructSortKey = (sort) => {
  const sortingOptions = {
    newest: { updatedAt: -1 },
    oldest: { updatedAt: 1 },
    topRatedNow: { combinedScore: -1 },
    topRatedYear: {
      combinedScore: -1,
      updatedAt: { $gte: new Date(new Date().getFullYear(), 0, 1) },
    },
    topRatedMonth: {
      combinedScore: -1,
      updatedAt: {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      },
    },
    topViewedNow: { viewCount: -1 },
    topViewedYear: {
      viewCount: -1,
      updatedAt: { $gte: new Date(new Date().getFullYear(), 0, 1) },
    },
    topViewedMonth: {
      viewCount: -1,
      updatedAt: {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      },
    },
  }; // define sorting options, sort by newest (descending updatedAt) or sort by oldest (ascending updatedAt)
  return sortingOptions[sort] || { updatedAt: -1 }; // default to sorting by newest
  // return sortingOptions[sort] || null; // return the corresponding sort key or null if not found
}; //END CONSTRUCT SORT KEY

//PAGINATE AND SORT TRENDS
export const paginateAndSortTrends = async (
  queryObject,
  sortKey,
  page,
  limit
) => {
  const skip = (page - 1) * limit; // calculate the number of documents to skip (skipping 0 trends, displaying all 10 then skipping them to next 10)
  const [trends, totalTrends] = await Promise.all([
    // execute both queries in parallel
    trendModel
      .find(queryObject)
      .select('-generatedBlogPost -trendUse')
      .populate('createdBy', 'username profile_img -_id')
      .sort(sortKey)
      .skip(skip)
      .limit(limit),
    trendModel.countDocuments(queryObject), //getting total trends based on query
  ]);
  const pagesNumber = Math.ceil(totalTrends / limit); //calculating the page
  return { totalTrends, pagesNumber, trends };
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

  const statusValue =
    trendStatus === 'breakout' ? 1.2 : trendStatus === 'stable' ? 1.0 : 0.8;

  return (
    t_score * weights.t_score +
    views * weights.views +
    statusValue * weights.trendStatus +
    f_score * weights.f_score
  );
};
