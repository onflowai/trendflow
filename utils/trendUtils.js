import trendModel from '../models/trendModel.js';
import { sanitizeHTML } from '../utils/sanitization.js';

//CONSTRUCT QUERY OBJECT
export const constructQueryObject = (search, trendTech, trendCategory) => {
  const queryObject = {}; // initialize an empty query object

  if (search) {
    queryObject.$or = [
      { trend: { $regex: sanitizeHTML(search), $options: 'i' } },
      { trendTech: { $regex: sanitizeHTML(search), $options: 'i' } },
      { trendCategory: { $regex: sanitizeHTML(search), $options: 'i' } },
    ];
  } // if search term exists, add a $or condition to match any of the fields, match trend field with case-insensitive regex

  if (trendTech && trendTech !== 'all') {
    queryObject.trendTech = trendTech;
  } // if trendTech is specified and not 'all' add trendTech to the query object

  if (trendCategory && trendCategory !== 'all') {
    queryObject.trendCategory = trendCategory;
  }

  return queryObject; // return the constructed query object
}; //END CONSTRUCT QUERY OBJECT

// CONSTRUCT SORT KEY
export const constructSortKey = (sort) => {
  const sortingOptions = {
    newest: { updatedAt: -1 },
    oldest: { updatedAt: 1 },
  }; // define sorting options, sort by newest (descending updatedAt) or sort by oldest (ascending updatedAt)

  return sortingOptions[sort] || null; // return the corresponding sort key or null if not found
}; //END CONSTRUCT SORT KEY

//PAGINATE AND SORT TRENDS
export const paginateAndSortTrends = async (
  queryObject,
  sortKey,
  page,
  limit
) => {
  const skip = (page - 1) * limit; // calculate the number of documents to skip

  const [trends, totalTrends] = await Promise.all([
    // execute both queries in parallel
    trendModel
      .find(queryObject)
      .select('-generatedBlogPost -trendUse')
      .populate('createdBy', 'username profile_img -_id')
      .sort(sortKey)
      .skip(skip)
      .limit(limit),
    trendModel.countDocuments(queryObject),
  ]);

  const pagesNumber = Math.ceil(totalTrends / limit);

  return { totalTrends, pagesNumber, trends };
}; //END PAGINATE AND SORT TRENDS
