import trendModel from '../models/trendModel.js';
import { TREND_CATEGORY, TECHNOLOGIES } from '../utils/constants.js';
import { StatusCodes } from 'http-status-codes';
import { sanitizeHTML } from '../utils/sanitization.js';
//import { executePythonScript } from '../utils/script_controller.js';
import { generatePostContent } from '../api/trendPostGenerator.js';
import { trendflowPyApi } from '../api/trendflowPyApi.js';
import { trendflowPyManualApi } from '../api/trendflowPyManualApi.js';
import { fetchRelatedTrends } from '../utils/trendRelatedUtils.js';
import { validateAndSanitizeCSVData } from '../utils/csvValidator.js';
import { cloudinary2 } from '../config/cloudinary.js'; //using dif set of credentials
import fs from 'fs/promises'; //allows to remove the image
import {
  constructSortKey,
  constructQueryObject,
  paginateAndSortTrends,
  calculateCombinedScore,
} from '../utils/trendUtils.js';
import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from '../errors/customErrors.js';
/**
 * This is where functionality of trends implemented.
 * Automatic Error Handling: the import 'express-async-errors'; in server.js allows
 * no need of set up custom try/catch blocks in the controllers, uncaught errors are
 * automatically forwarded to the error handler.
 * @param {*} req
 * @param {*} res
 * @returns
 */
//test data for local storage set as 'let' for modification
// let trends = [
//   { id: nanoid(), trend: 'chatgpt', category: 'language model' },
//   { id: nanoid(), trend: 'react', category: 'javascript framework' },
// ];
/**
 * SUBMIT TREND
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const submitTrend = async (req, res, next) => {
  let { trend } = req.body; //using scoped variable
  trend = sanitizeHTML(trend); //sanitize the trend input to prevent XSS
  const existingTrend = await trendModel.findOne({ trend });
  if (existingTrend) {
    throw new BadRequestError('Trend already exists');
  }
  req.body.createdBy = req.user.userID; //adding createdBy property storing user id
  const trendObject = await trendModel.create({
    ...req.body,
    isApproved: false,
  }); //create a new document spreading current properties
  res.status(StatusCodes.CREATED).json({ trendObject });
}; //end SUBMIT

/**
 * GET USER TREND (setting up a retrieve/read all trends in a route /api/v1/trends belonging to user)
 * @param {*} req
 * @param {*} res
 */
export const getUserTrends = async (req, res) => {
  const trends = await trendModel.find({ createdBy: req.user.userID }); //getting the trends belonging to user that provided cookie and token
  res.status(StatusCodes.OK).json({ trends }); //if there is anything but response 200 resource is not found response fot the client
};

/**
 * CREATE TREND created in AddTrend.jsx
 * @param {*} req
 * @param {*} res
 */
export const createTrend = async (req, res) => {
  req.body.createdBy = req.user.userID; //createdBy populated with userDI
  const trendObject = await trendModel.create(req.body); //async adding a new trend object to the database (create looks for an object)
  res.status(StatusCodes.CREATED).json({ trendObject }); //response fot the client with created trend is 201
};

/**
 * GET SINGLE TREND fetches trend based on the slug
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const getSingleTrend = async (req, res) => {
  const { slug } = req.params; //retrieving the id
  try {
    const trendObject = await trendModel
      .findOne({ slug: slug })
      .populate(
        'createdBy',
        'username profile_img githubUsername privacy -_id'
      ); //retrieve the trend if it equals the id in the data
    if (!trendObject) {
      //return res.status(404).json({ msg: 'Trend not found' });
      throw new NotFoundError('Trend not found');
    }
    if (trendObject.createdBy && trendObject.createdBy.privacy) {
      trendObject.createdBy.githubUsername = ''; // setting githubUsername to an empty string if privacy is enabled
    }
    trendObject.generatedBlogPost = sanitizeHTML(trendObject.generatedBlogPost); //sanitizing html
    const relatedTrends = await fetchRelatedTrends(trendObject); // fetching related trends from utility function

    const sanitizedRelatedTrends = relatedTrends.map((relatedTrend) => {
      if (relatedTrend.createdBy && relatedTrend.createdBy.privacy) {
        relatedTrend.createdBy.githubUsername = ''; // Remove if privacy is enabled
      }
      return relatedTrend;
    }); // apply privacy logic to each related trend

    res
      .status(StatusCodes.OK)
      .json({ trendObject, relatedTrends: sanitizedRelatedTrends }); // return trend and related trends
  } catch (error) {
    // DEBUG detailed response for debugging
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: 'Server Error',
      error: error.message,
      stack: error.stack,
      slug: slug,
    });
  }
}; //end single trend

/**
 * UPDATE TREND only accessible before the Trend has been approved, after this controller is not reachable
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const editTrend = async (req, res) => {
  const { slug } = req.params;
  // use Mongoose's findOneAndUpdate method to find a trend by its slug and update it with the new data provided in req.body.
  // the option { new: true } ensures that the method returns the modified document rather than the original.
  const updateTrend = await trendModel.findOneAndUpdate(
    { slug: slug }, // the filter to find the document by slug.
    req.body,
    {
      new: true, // option to return the updated document instead of the original document before the update.
    }
  );
  if (!updateTrend) {
    throw new NotFoundError('Trend not found');
  }
  //response
  res
    .status(StatusCodes.OK)
    .json({ msg: 'trend modified', trend: updateTrend }); //returning the found trend
}; //end editTrend

/**
 * DELETE TREND
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const deleteTrend = async (req, res) => {
  const { slug } = req.params; //1: find trend
  const removeTrend = await trendModel.findOneAndDelete({ slug: slug });
  if (!removeTrend) {
    throw new NotFoundError('Trend not found');
  }
  res.status(StatusCodes.OK).json({ msg: 'Trend deleted', trend: removeTrend });
};

/**
 * APPROVE TREND
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const approveTrend = async (req, res) => {
  const { slug } = req.params; // Use slug from the request parameters
  try {
    const trend = await trendModel.findOne({ slug: slug }); // Find the trend using the slug
    if (!trend) {
      throw new NotFoundError('Trend not found');
    }
    //CALLING THE SCRIPT and OPENAI (executing both asynchronous functions concurrently)
    const [trendflowPyApiResponse, openAIResult] = await Promise.all([
      trendflowPyApi(trend.trend), //api call to python scripts
      //executePythonScript(trend.trend), // Execute Python script
      generatePostContent(trend.trend, trend.trendCategory, trend.trendTech), // Generate content with OpenAI
    ]);

    // Handle Python API response
    if (!trendflowPyApiResponse.success) {
      throw new Error(
        trendflowPyApiResponse.error || 'Python API returned an error'
      );
    }

    const data = trendflowPyApiResponse.trends_data;
    const { trendPost, trendDesc, trendUse } = openAIResult; // Destructure the OPENAI result
    const safeTrendPost = sanitizeHTML(trendPost); //content sanitization from external sources before saving
    const combinedScore = calculateCombinedScore(
      data.t_score,
      0,
      data.status,
      data.f_score
    ); //updating the combined score on initial generation with Views passed as 0

    //UPDATING MONGO
    const updatedTrend = await trendModel.findOneAndUpdate(
      { slug: slug },
      {
        $set: {
          interestOverTime: data.trends_data,
          trendStatus: data.status,
          flashChart: data.flashChart,
          generatedBlogPost: safeTrendPost,
          trendDesc: trendDesc,
          trendUse: trendUse,
          isApproved: true,
          forecast: data.forecast,
          t_score: data.t_score,
          f_score: data.f_score,
          combinedScore: combinedScore, // Store the initial combined score
        },
      },
      { new: true } //returns the updated document instead of the original
    ); // updating the trend with the 'data' fetched from the script and approve it

    // await trend.save(); // save the updated trend document

    res
      .status(StatusCodes.OK)
      .json({ msg: 'Trend approved', trend: updatedTrend });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
  }
}; //end APPROVE TREND

/**
 * MANUAL APPROVE TREND
 * @param {Object} req - express request object
 * @param {Object} res - express response object
 * @returns {Object} - JSON response with status and message
 */
export const approveTrendManual = async (req, res) => {
  const { slug } = req.params; // extracting slug from URL parameters
  let { data } = req.body; // extracting data from request body
  try {
    const sanitizedData = validateAndSanitizeCSVData(data); // validating and sanitize CSV data
    const trend = await trendModel.findOne({ slug: slug });
    if (!trend) {
      throw new NotFoundError('Trend not found');
    } // finding the trend by slug

    const trendflowPyApiResponse = await trendflowPyManualApi(
      slug,
      sanitizedData
    ); // calling the manual trendflowPyManualApi with slug and sanitized data

    if (!trendflowPyApiResponse.success) {
      throw new Error(
        trendflowPyApiResponse.error || 'trendflowPyManualApi returned an error'
      );
    } // handling trendflowPyManualApi response

    const processedData = trendflowPyApiResponse.trends_data;

    const openAIResult = await generatePostContent(
      trend.trend,
      trend.trendCategory,
      trend.trendTech
    ); // generating content using OpenAI based on the processed data

    const { trendPost, trendDesc, trendUse } = openAIResult; // destructuring OpenAI result
    const safeTrendPost = sanitizeHTML(trendPost); // sanitizing the generated content

    const combinedScore = calculateCombinedScore(
      processedData.t_score,
      0,
      processedData.status,
      processedData.f_score
    ); // calculating the combined score

    const updatedTrend = await trendModel.findOneAndUpdate(
      { slug: slug },
      {
        $set: {
          interestOverTime: processedData.trends_data,
          trendStatus: processedData.status,
          flashChart: processedData.flashChart,
          generatedBlogPost: safeTrendPost,
          trendDesc: trendDesc,
          trendUse: trendUse,
          isApproved: true,
          forecast: processedData.forecast,
          t_score: processedData.t_score,
          f_score: processedData.f_score,
          combinedScore: combinedScore, // Store the updated combined score
        },
      },
      { new: true } // return the updated document
    ); // updating the trend document in MongoDB

    // respond with success
    res
      .status(StatusCodes.OK)
      .json({ msg: 'Trend manually approved', trend: updatedTrend });
  } catch (error) {
    console.error('Error in approveTrendManual:', error.message);

    // determine appropriate status code
    const statusCode =
      error instanceof NotFoundError
        ? StatusCodes.NOT_FOUND
        : error.message.startsWith('Invalid')
        ? StatusCodes.BAD_REQUEST
        : StatusCodes.INTERNAL_SERVER_ERROR;

    // respond with error message
    res
      .status(statusCode)
      .json({ msg: error.message || 'Internal Server Error' });
  }
}; //end MANUAL APPROVE TREND

/**
 * GET ALL TRENDS (only for ADMIN)
 * Returns all trends with filtering, sorting, and pagination.
 * @param {*} req
 * @param {*} res
 */
export const getAllTrends = async (req, res) => {
  let {
    search,
    trendTech,
    trendCategory,
    sort,
    page,
    limit,
    topRated,
    topViewed,
    updated,
    status,
    cursor,
  } = req.query; // destructuring query parameters from the request

  // constructing the query object based on provided filters
  const queryObject = constructQueryObject(
    search,
    trendTech,
    trendCategory,
    undefined,
    status
  ); //passing isApproved based on status + no status passed (undefined)

  // building the sort key based on sorting parameters
  const sortKey = constructSortKey(topRated, topViewed, updated);

  // set default values for page and limit if not provided
  page = Number(page) || 1;
  limit = Number(limit) || 36;

  // getting the current date components
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  // 'updated' filter
  if (updated === 'newestMonth') {
    queryObject.updatedAt = {
      $gte: new Date(currentYear, currentMonth - 1, 1),
    };
  } else if (updated === 'newestYear') {
    queryObject.updatedAt = { $gte: new Date(currentYear - 1, 0, 1) };
  }

  // 'topRated' and 'topViewed' time-frame filters if 'updatedAt' is not already set
  if (!queryObject.updatedAt) {
    if (topRated === 'topRatedYear' || topViewed === 'topViewedYear') {
      queryObject.updatedAt = { $gte: new Date(currentYear, 0, 1) };
    } else if (topRated === 'topRatedMonth' || topViewed === 'topViewedMonth') {
      queryObject.updatedAt = { $gte: new Date(currentYear, currentMonth, 1) };
    }
  }

  try {
    let { totalTrends, pagesNumber, trends, nextCursor, hasNextPage } =
      await paginateAndSortTrends(queryObject, sortKey, page, limit, cursor); // fetch trends using pagination, sorting, and optional cursor

    //privacy logic if necessary (e.g., hide GitHub username if privacy is enabled)
    trends = trends.map((trend) => {
      if (trend.createdBy && trend.createdBy.privacy) {
        trend.createdBy.githubUsername = '';
      }
      return trend;
    });
    //   'Admin Trends fetched after applying cursor:',
    //   trends.map((trend) => trend.trend)
    // );

    res.status(StatusCodes.OK).json({
      totalTrends,
      pagesNumber,
      currentPage: page,
      trends,
      nextCursor,
      hasNextPage,
    }); // sending the response with trends data and pagination info
  } catch (error) {
    // handling any errors during the database query
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
  }
}; // end of getAllTrends

/**
 * GET APPROVED TRENDS returns trends & sorts them according to the filter 'sort'
 * @param {*} req
 * @param {*} res
 */
export const getApprovedTrends = async (req, res) => {
  let {
    search,
    trendTech,
    trendCategory,
    sort,
    page,
    limit,
    topRated,
    topViewed,
    updated,
    status,
    cursor,
  } = req.query; //destructuring the values coming from query which sent from the users search and dropdowns
  const queryObject = constructQueryObject(
    search,
    trendTech,
    trendCategory,
    true,
    status
  ); // adding hardcoded isApproved: true, constructQueryObject will create query parameters as an object
  const sortKey = constructSortKey(topRated, topViewed, updated);
  page = Number(page) || 1; //value page will be provided in the req
  limit = Number(limit) || 36; //limit will be provided, defaulting to 36 trends initially

  const currentYear = new Date().getFullYear(); //this is the full year of the current date '2024'
  const currentMonth = new Date().getMonth(); //month of the current date, represented as an index from 0 (January) to 11 (December)
  const now = new Date(); // current date

  if (updated === 'newestMonth') {
    queryObject.updatedAt = {
      $gte: new Date(currentYear, currentMonth - 1, 1),
    };
  } else if (updated === 'newestYear') {
    queryObject.updatedAt = { $gte: new Date(currentYear - 1, 0, 1) };
  } // applying the 'updated' filter if provided

  if (!queryObject.updatedAt) {
    if (topRated === 'topRatedYear' || topViewed === 'topViewedYear') {
      queryObject.updatedAt = { $gte: new Date(currentYear, 0, 1) }; // trends updated from the start of the current year
    } else if (topRated === 'topRatedMonth' || topViewed === 'topViewedMonth') {
      queryObject.updatedAt = {
        $gte: new Date(currentYear, currentMonth, 1),
      }; // trends updated from the start of the current month
    }
  } // applying 'topRated' and 'topViewed' time-frame filters only if 'updated' didn't already set an 'updatedAt' filter

  try {
    // query the database for trends where isApproved is true (return without: generatedBlogPost, trendUse)
    let { totalTrends, pagesNumber, trends, nextCursor, hasNextPage } =
      await paginateAndSortTrends(
        queryObject,
        sortKey,
        page,
        limit,
        undefined,
        cursor
      ); //undefined is set so that all trends will be pulled from the controller
    // privacy logic
    trends = trends.map((trend) => {
      if (trend.createdBy && trend.createdBy.privacy) {
        trend.createdBy.githubUsername = ''; // removing githubUsername if privacy is enabled
      }
      return trend;
    });

    // console.log(
    //   'Trends fetched after applying cursor:',
    //   trends.map((trend) => trend.trend)
    // );
    res.status(StatusCodes.OK).json({
      totalTrends,
      pagesNumber,
      currentPage: page,
      trends,
      nextCursor,
      hasNextPage,
    }); // Directly respond with the list of approved trends (could be an empty array)
  } catch (error) {
    // Handle any potential errors during the database query
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
  }
}; //end GET APPROVED TRENDS

/**
 * GET TREND_CATEGORY & TECHNOLOGIES
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const getSelectIconData = (req, res) => {
  try {
    if (!req.user) {
      throw new UnauthenticatedError('User not authenticated');
    }
    res.status(StatusCodes.OK).json({ TREND_CATEGORY, TECHNOLOGIES });
  } catch (error) {
    return next(error);
  }
}; //end getSelectIconData

/**
 * UPLOAD TREND SVG is responsible for allow admin to upload/modify svg belonging to a trend before and after approval
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const uploadTrendSVG = async (req, res) => {
  if (!req.file) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: 'No file uploaded' });
  }
  try {
    const response = await cloudinary2.uploader.upload(req.file.path, {
      folder: 'trend_svgs',
    }); // upload new SVG to Cloudinary
    await fs.unlink(req.file.path); // deleting the temporary local file after upload
    const sanitizedSlug = sanitizeHTML(req.params.slug);
    const currentTrend = await trendModel.findOne({ slug: sanitizedSlug });
    if (!currentTrend) {
      throw new NotFoundError('Trend not found');
    }
    const updatedTrend = {
      svg_url: response.secure_url, // updating trend object with the URL and ID of the uploaded SVG
      svg_public_id: response.public_id, // public_id used for future reference or deletion
    };
    const trend = await trendModel.findByIdAndUpdate(
      currentTrend._id,
      updatedTrend,
      { new: true }
    );
    if (!trend) {
      throw new NotFoundError('Trend not found');
    }
    res
      .status(StatusCodes.OK)
      .json({ msg: 'SVG uploaded successfully', trend });
    if (
      currentTrend.svg_public_id &&
      currentTrend.svg_public_id !== response.public_id
    ) {
      await cloudinary2.uploader.destroy(currentTrend.svg_public_id);
    } // delete old SVG from Cloudinary if it exists and is different from the new one
  } catch (error) {
    console.error('Error uploading SVG:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: 'SVG upload failed' });
  }
}; //end uploadTrendSVG

/**
 * GET TREND SVG
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const getTrendSVG = async (req, res) => {
  const { slug } = req.params;
  try {
    const trend = await trendModel.findOne({ slug });
    if (!trend) {
      throw new NotFoundError('Trend not found');
    }
    res.status(StatusCodes.OK).json({ svg_url: trend.svg_url });
  } catch (error) {
    console.error('Error fetching SVG:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: 'Error fetching SVG' });
  }
}; //end getTrendSVG

/**
 * SEARCH TRENDS
 * Search for trends based on a search query
 * @param {*} req
 * @param {*} res
 */
export const searchTrends = async (req, res, next) => {
  const { search } = req.query;

  if (!search) {
    return next(new BadRequestError('Search query is required'));
  }

  try {
    const trends = await trendModel
      .find({
        trend: { $regex: search, $options: 'i' }, // case-insensitive search
        isApproved: true, // optional: Add any other filters you need, like only approved trends
      })
      .select('trend svg_url slug');

    res.status(StatusCodes.OK).json({ trends });
  } catch (error) {
    return next(error);
  }
};

/**
 * GET TOP VIEWED TRENDS
 * This controller fetches the top viewed approved trends with pagination.
 * It enforces `topViewed=topViewedNow` and restricts `limit` to a fixed number of trends.
 * It excludes `generatedBlogPost` and `trendUse` fields.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getTopViewedTrends = async (req, res, next) => {
  const topViewed = 'topViewedNow'; // Enforce internally
  const page = 1; // page
  const limit = 12; // fixed limit per page
  const trendLimit = 10; //fixed limit of trends for this controller

  const queryObject = { isApproved: true };

  const sortKey = { views: -1 };

  const cursor = req.query.cursor;

  try {
    const { totalTrends, pagesNumber, trends, nextCursor, hasNextPage } =
      await paginateAndSortTrends(
        queryObject,
        sortKey,
        page,
        limit,
        trendLimit,
        cursor
      );

    const sanitizedTrends = trends.map((trend) => {
      if (trend.createdBy && trend.createdBy.privacy) {
        trend.createdBy.githubUsername = '';
      }
      return trend;
    });

    return res.status(StatusCodes.OK).json({
      totalTrends,
      pagesNumber,
      currentPage: page,
      trends: sanitizedTrends,
      nextCursor,
      hasNextPage,
    });
  } catch (error) {
    console.error('Error fetching top viewed trends:', error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: error.message });
  }
};
