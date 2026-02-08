import trendModel from '../models/trendModel.js';
//import { TREND_CATEGORY, TECHNOLOGIES } from '../utils/constants.js';
import { StatusCodes } from 'http-status-codes';
import { sanitizeHTML } from '../utils/sanitization.js';
import { sanitizeMarkdown } from '../utils/sanitizeMarkdown.js'
//import { executePythonScript } from '../utils/script_controller.js';
import { generatePostContent } from '../api/trendPostGenerator.js';
import { trendflowPyApi } from '../api/trendflowPyApi.js';
import { trendflowPyManualApi } from '../api/trendflowPyManualApi.js';
import { fetchRelatedTrends } from '../utils/trendRelatedUtils.js';
import { validateAndSanitizeCSVData } from '../utils/csvValidator.js';
import { sanitizeOfficialLink } from '../utils/sanitizeLink.js';
import { assertNoLongStringAbuse } from '../utils/stringGuard.js';
import { cloudinary2 } from '../config/cloudinary.js'; //using dif set of credentials
import fs from 'fs/promises'; //allows to remove the image
import { assertNoProfDump } from '../utils/profGuard.js';
import {
  constructSortKey,
  constructQueryObject,
  paginateAndSortCursor,
  calculateCombinedScore,
  paginateAndSortCursorViews,
} from '../utils/trendUtils.js';
import { normalizeCreatorForTrend } from '../utils/normalizeUserForTrend.js';
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
 * SUBMIT TREND - creates draft trend and saves it immediately to mongo (not in admin queue yet)
 * generate markdown blog immediately return draft for display (user read-only, admin editable)
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const submitTrend = async (req, res) => {
  let { trend } = req.body; //pull trend name from request body
  trend = sanitizeHTML(trend); //sanitize trend

  if (!trend || trend.trim().length < 2) {
    throw new BadRequestError('Trend too short');
  }// reject if trend name too short

  const existingTrend = await trendModel.findOne({ trend });
  if (existingTrend) {
    throw new BadRequestError('Trend already exists');
  }//check if exact trend already exists

  const createdBy = req.user.userID;// storing current authenticated user id as author of created trend

  //only accepting field EXPECTED from UI during submission:
  const {
    trendCategory,
    trendTech,
    techIconUrl,
    cateIconUrl,
    svg_url,
    svg_public_id,
    openSourceStatus,
  } = req.body; //avoiding spreading all req.body blindly reducing mass assignment risk

  const allowedStatuses = ['open', 'partial', 'closed', 'unknown']; //from trend model openSourceStatus must be one of the allowed enum values
  const safeOpenSourceStatus = allowedStatuses.includes(openSourceStatus)
    ? openSourceStatus
    : 'unknown';// fallback if missing/invalid

  const draftTrend = await trendModel.create({
    trend,
    trendCategory,
    trendTech,
    techIconUrl,
    cateIconUrl,
    svg_url,
    svg_public_id,
    openSourceStatus: safeOpenSourceStatus,
    createdBy,
    isApproved: false,
    isSubmittedForApproval: false,
  });//create the trend document as unapproved

  const openAIResult = await generatePostContent(
    draftTrend.trend,
    draftTrend.trendCategory,
    draftTrend.trendTech
  );//generate markdown blog immediately based on trend info

  const { trendPost, trendDesc, trendUse, trendOfficialLink, openSourceStatus: openSourceResponse } = openAIResult || {};// safely destructure result
  const safeMarkdown = sanitizeMarkdown(trendPost || '');// sanitize markdown output before saving
  if (!safeMarkdown || safeMarkdown.length < 20) {// basic guard for failed/empty generation
    throw new BadRequestError('Blog generation failed');
  }
  if (safeMarkdown.length > 8000) {
    throw new BadRequestError('Generated blog too long');
  }// matching model schema max-length for trendBlog
  const safeDesc = sanitizeHTML(trendDesc || '').trim();// normalize desc before saving
  if (safeDesc.length > 1000) {
    throw new BadRequestError('Generated description too long');
  }//match schema maxlength for trendDesc
  const safeUse = sanitizeMarkdown(trendUse || '').trim(); // sanitize usage section
  if (safeUse.length > 2000) {
    throw new BadRequestError('Generated use section too long');
  }// schema max-length for trendUse double check

  draftTrend.generatedBlogPost = safeMarkdown;// store markdown blog post in Mongo
  draftTrend.trendDesc = safeDesc;// sanitize + store description
  draftTrend.trendUse = safeUse;// sanitize + store usage section
  draftTrend.blogLastEditedBy = null;// no editor yet (admin edits later)
  draftTrend.blogEditedAt = null;// no edit timestamp yet
  draftTrend.trendOfficialLink = sanitizeOfficialLink(trendOfficialLink);

  if (draftTrend.openSourceStatus === 'unknown') {
    const aiSafe = allowedStatuses.includes(String(openSourceResponse || '').toLowerCase()) ? String(openSourceResponse).toLowerCase() : 'unknown';
    if (aiSafe !== 'unknown') draftTrend.openSourceStatus = aiSafe;
  }// only override if request was unknown AND ai gave a valid better value

  await draftTrend.save();// persist blog fields onto the created trend document

  res.status(StatusCodes.CREATED).json({ // respond 201 created
    trendObject: draftTrend, // return full draft trend to client
  });
}; //end SUBMIT

/**
 * SUBMIT TREND FOR APPROVAL (Admin only) - only submits the trend as is no updating / editing timestamped automatically via
 * updatedAt
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const submitTrendForApproval = async (req, res) => {
  const { slug } = req.params;//pulling trend from route params
  const trend = await trendModel.findOne({ slug });//find the trend doc by slig
  if (!trend) {
    throw new NotFoundError('Trend not found');
  }//if not found return 404
  const isOwner = String(trend.createdBy) === String(req.user.userID);// check if current user created this trend
  const isAdmin = req.user?.role === 'admin';// check if current user is admin
  if (!isOwner && !isAdmin) {
    throw new UnauthenticatedError('Admin only');
  }
  if (trend.isApproved) {
    throw new BadRequestError('Trend already approved');
  }
  if (trend.isSubmittedForApproval === true){
    return res.status(StatusCodes.OK).json({
      msg: 'Already submitted',
    })
  }
  if (!trend.generatedBlogPost || trend.generatedBlogPost.trim().length < 20) {
    throw new BadRequestError('Trend must have a generated blog before submission');
  }
  trend.isSubmittedForApproval = true;// flip the flag so admin queue can filter it
  await trend.save();
  res.status(StatusCodes.OK).json({
    msg: 'Trend submitted for admin approval',
    trend,
  });
};//end submitTrendForApproval

/**
 * UPDATE TREND BLOG ADMIN (PATCH) (admin only setup in route middleware) - lets admin edit the trendBlog, trendUse and Link before submitTrendForApproval in AddTrend.jsx
 * lets admin update the trend before approving with approveTrendManual or approveTrend trend in EditTrend.jsx
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const updateTrendBlogAdmin = async (req, res) => {
  const { slug } = req.params; // route uses :slug
  //const { id } = req.params;// destructuring trend document id
  let {  generatedBlogPost, trendUse, trendOfficialLink } = req.body;

  if (
    generatedBlogPost === undefined && // blog not provided
    trendUse === undefined && // use not provided
    trendOfficialLink === undefined // link not provided
  ) {
    throw new BadRequestError('No editable fields provided');
  }//requiring at least ONE field to update

  //const trend = await trendModel.findById(id);
  const trend = await trendModel.findOne({ slug });// find by slug
  if (!trend) {
    throw new NotFoundError('Trend not found');
  }//loading trend BEFORE assigning to it if doc missing 404

  // if (trend.isApproved) {
  //   throw new BadRequestError('Cannot edit after approval');
  // }//prevent edits after approval to keep public content stable

  let changed = false;// tracking change to avoid fake audit updates

  if (generatedBlogPost !== undefined) {
    if (!generatedBlogPost) {
      throw new BadRequestError('Blog content required');
    }// reject null/empty
    generatedBlogPost = sanitizeMarkdown(String(generatedBlogPost));// sanitize markdown BEFORE storage
    if (generatedBlogPost.trim().length < 20) {
      throw new BadRequestError('Blog content too short');
    }// avoid saving empty junk
    if (generatedBlogPost.length > 8000) {// match schema maxlength for generatedBlogPost
      throw new BadRequestError('Blog content too long');
    }
    try{
    await assertNoLongStringAbuse(generatedBlogPost);
    await assertNoProfDump(generatedBlogPost, {
      maxTotalHits: 6,//allow a few (quotes / edge cases) block spam dumps
      maxConsecutiveHits: 3,// block "word word word word ..."
      minWordCount: 30,// dont overreact to tiny snippets
      shortConsecutiveHits: 3,
      minShortWords: 8,
    });//prof checker
    }catch(e){
      throw new BadRequestError(e.message); 
    }
    trend.generatedBlogPost = generatedBlogPost;// persist blog markdown
    changed = true;
  }// ONLY update trendBlog if client included it

  if (trendUse !== undefined) {
    trendUse = sanitizeMarkdown(String(trendUse || '')).trim();// sanitize plain text and trim
    if (trendUse.length > 2000) {
      throw new BadRequestError('trendUse too long');
    }// match model schema max-length for trendUse
    try{
    await assertNoLongStringAbuse(trendUse, {
      minChars: 20,//is short guard earlier
      minWordCount: 10,
      maxSameBigramRun: 4,// stricter for shorter field
    });
    await assertNoProfDump(trendUse, {
      maxTotalHits: 4,
      maxConsecutiveHits: 2,
      minWordCount: 18,
      shortConsecutiveHits: 2,
      minShortWords: 6,
    });
    }catch(e){
      throw new BadRequestError(e.message); 
    }
    trend.trendUse = trendUse;// persist trendUse
    changed = true;
  }// ONLY update trendUse if client included it

  if (trendOfficialLink !== undefined) {
    trend.trendOfficialLink = sanitizeOfficialLink(trendOfficialLink);// normalize + validate http/https only
    changed = true;
  }// ONLY update official link if provided

  if (!changed) { 
    return res.status(StatusCodes.OK).json({
      msg: 'No changes applied',
      trend,
    });
  }// if nothing changed dont update audit timestamps

  trend.blogLastEditedBy = req.user.userID;// track who edited
  trend.blogEditedAt = new Date();// track when edited

  await trend.save();// persist changes (+ updatedAt auto updates via timestamps)

  res.status(StatusCodes.OK).json({
    msg: 'Trend content updated',
    trend,
  });
};//end updateTrendBlogAdmin

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
        'username profile_img githubUsername privacy isDeleted'
      )
      .populate(
        'blogLastEditedBy',
        'username profile_img githubUsername privacy isDeleted'
      );//retrieve the trend if it equals the id in the data
    if (!trendObject) {
      //return res.status(404).json({ msg: 'Trend not found' });
      throw new NotFoundError('Trend not found');
    }
    const role = req.user?.role || 'guestUser';
    const userID = req.user?.userID ? String(req.user.userID) : null;
    const createdById = trendObject.createdBy?._id ? String(trendObject.createdBy._id) : null;

    const isOwner = !!userID && !!createdById && userID === createdById;
    const isAdmin = role === 'admin';
    const isApproved = trendObject.isApproved === true;

    if (!isApproved && !isAdmin && !isOwner) {
      throw new NotFoundError('Trend not found');
    }

    trendObject.createdBy = normalizeCreatorForTrend(trendObject.createdBy);
    trendObject.blogLastEditedBy = normalizeCreatorForTrend(trendObject.blogLastEditedBy); // in func applying privacy rules to blogLastEditedBy

    trendObject.generatedBlogPost = sanitizeMarkdown(trendObject.generatedBlogPost); //sanitizing html
    const relatedTrends = await fetchRelatedTrends(trendObject); // fetching related trends from utility function

    const sanitizedRelatedTrends = relatedTrends.map((relatedTrend) => {
      relatedTrend.createdBy = normalizeCreatorForTrend(relatedTrend.createdBy);
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
 * UPDATE TREND (admin only setup in route middleware) only accessible before the Trend has been approved, after this controller is not reachable
 * ADMIN EDITS the trend name, open source status, tech and category
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const editTrend = async (req, res) => {
  const { slug } = req.params;
  const doc = await trendModel.findOne({ slug }); //finding the doc by current slug
  if (!doc) {
    throw new NotFoundError(`No trend found with slug ${slug}`);
  }
  if (doc.isApproved && req.body.trend && req.body.trend !== doc.trend) {
    throw new BadRequestError('Cannot change slug once approved');
  } // if the trend is already approved, forbid changing the slug/trend
  const oldSlug = doc.slug; //storing old slug to compare after save

  const allowedStatuses = ['open', 'partial', 'closed', 'unknown'];
  let openSourceStatus = doc.openSourceStatus; // fallback to existing value
  if (
    req.body.openSourceStatus &&
    allowedStatuses.includes(req.body.openSourceStatus)
  ) {
    openSourceStatus = req.body.openSourceStatus;
  }

  doc.set({
    trend: !doc.isApproved && req.body.trend ? req.body.trend : doc.trend,
    trendCategory: req.body.trendCategory,
    cateIconUrl: req.body.cateIconUrl,
    trendTech: req.body.trendTech,
    techIconUrl: req.body.techIconUrl,
    openSourceStatus,
  }); //updating the doc with request body fields
  await doc.save();

  if (doc.slug !== oldSlug) {
    return res.status(StatusCodes.OK).json({
      msg: 'trend modified, new slug generated',
      redirectTo: `/dashboard/edit-trend/${doc.slug}`,
      trend: doc,
    });
  } //if slug changed sending redirect and return JSON

  res.status(StatusCodes.OK).json({
    msg: 'trend modified',
    trend: doc,
  }); //if slug didn’t change respond normally
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
 * APPROVE TREND - takes existing trend and generated blogpost adds scores interestOverTime and flags it as isApproved true automatically
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
    const trendflowPyApiResponse = await Promise.all([
      trendflowPyApi(trend.trend), //api call to python scripts
      //executePythonScript(trend.trend), // Execute Python script
    ]);

    // Handle Python API response
    if (!trendflowPyApiResponse.success) {
      throw new Error(
        trendflowPyApiResponse.error || 'Python API returned an error'
      );
    }

    const data = trendflowPyApiResponse.trends_data;
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
}; //end approveTrend

/**
 * MANUAL APPROVE TREND - takes existing trend and generated blogpost adds scores interestOverTime and flags it as isApproved true manually
 * @param {Object} req - express request object
 * @param {Object} res - express response object
 * @returns {Object} - JSON response with status and message
 */
export const approveTrendManual = async (req, res) => {
  const { slug } = req.params; // extracting slug from URL parameters
  let { data, openSourceStatus } = req.body; // extracting data from request body
  try {
    const sanitizedData = validateAndSanitizeCSVData(data); // validating and sanitize CSV data
    const trend = await trendModel.findOne({ slug: slug });// find trend by slug
    if (!trend) {
      throw new NotFoundError('Trend not found');
    } // if not found 404
    if (trend.isApproved) {
      throw new BadRequestError('Trend already approved');
    }// checking for double-approval and re-running analytics
    if (trend.isSubmittedForApproval !== true) {
      throw new BadRequestError('Trend must be submitted for approval first');
    }//prevents random approvals

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

    const combinedScore = calculateCombinedScore(
      processedData.t_score,
      0,
      processedData.status,
      processedData.f_score
    ); // calculating the combined score

    const allowedStatuses = ['open', 'partial', 'closed', 'unknown'];
    let newOpenSourceStatus = trend.openSourceStatus; // fallback to existing
    if (openSourceStatus && allowedStatuses.includes(openSourceStatus)) {
      newOpenSourceStatus = openSourceStatus;
    }

    const updatedTrend = await trendModel.findOneAndUpdate(
      { slug: slug },
      {
        $set: {
          interestOverTime: processedData.trends_data,
          trendStatus: processedData.status,
          flashChart: processedData.flashChart,
          isApproved: true,
          forecast: processedData.forecast,
          t_score: processedData.t_score,
          f_score: processedData.f_score,
          openSourceStatus: newOpenSourceStatus,
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
}; //end approveTrendManual

/**
 * MANUAL UPDATE TREND (UP-TO-DATE DATA REFRESH) - ONLY FOR UPDATING THE DATA
 * @param {Object} req - express request object
 * @param {Object} res - express response object
 * @returns {Object} - JSON response with status and message
 */
export const updateTrendManual = async (req, res) => {
  const { slug } = req.params;
  let { data } = req.body;

  try {
    const sanitizedData = validateAndSanitizeCSVData(data); // validating and sanitize the incoming CSV data
    const trend = await trendModel.findOne({ slug: slug });
    if (!trend) {
      throw new NotFoundError('Trend not found');
    } // finding the trend document by slug

    const trendflowPyApiResponse = await trendflowPyManualApi(
      slug,
      sanitizedData
    ); // call the manual API to process the CSV data
    if (!trendflowPyApiResponse.success) {
      throw new Error(
        trendflowPyApiResponse.error || 'trendflowPyManualApi returned an error'
      );
    }
    const processedData = trendflowPyApiResponse.trends_data; //extracting processed data from the API response
    const combinedScore = calculateCombinedScore(
      processedData.t_score,
      0,
      processedData.status,
      processedData.f_score
    ); // calculate the combined score
    const updatedTrend = await trendModel.findOneAndUpdate(
      { slug: slug },
      {
        $set: {
          interestOverTime: processedData.trends_data,
          trendStatus: processedData.status,
          flashChart: processedData.flashChart,
          isApproved: true, //remain approved
          forecast: processedData.forecast,
          t_score: processedData.t_score,
          f_score: processedData.f_score,
          combinedScore: combinedScore,
        },
      },
      { new: true } // return the updated document
    ); // updating the trend document with the fresh data

    // Respond with success
    res.status(StatusCodes.OK).json({
      msg: 'Trend manually updated',
      trend: updatedTrend,
    });
  } catch (error) {
    console.error('Error in updateTrendManual:', error.message);

    const statusCode =
      error instanceof NotFoundError
        ? StatusCodes.NOT_FOUND
        : error.message.startsWith('Invalid')
          ? StatusCodes.BAD_REQUEST
          : StatusCodes.INTERNAL_SERVER_ERROR;

    res.status(statusCode).json({
      msg: error.message || 'Internal Server Error',
    });
  }
}; // end updateTrendManual

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
    limit,
    topRated,
    topViewed,
    updated,
    status,
    cursor,
  } = req.query; // destructuring query parameters from the request

  // set default values for page and limit if not provided
  limit = Number(limit) || 8; // set default values for page and limit if not provided
  if (limit < 1) limit = 8; // fallback if negative or zero

  //constructing the query object based on provided filters
  const queryObject = constructQueryObject(
    search,
    trendTech,
    trendCategory,
    undefined,
    status
  ); //passing isApproved based on status + no status passed (undefined)

  // building the sort key based on sorting parameters
  const sortKey = constructSortKey(topRated, topViewed, updated);

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
    // helper that does the actual find() with cursor-based logic
    const { totalTrends, trends, nextCursor, hasNextPage } =
      await paginateAndSortCursor(queryObject, sortKey, limit, cursor); // fetch trends using pagination, sorting, and optional cursor

    //privacy logic if necessary (e.g., hide GitHub username if privacy is enabled)
    const safeTrends = trends.map((trend) => {
      trend.createdBy = normalizeCreatorForTrend(trend.createdBy);
      return trend;
    });//ADDED: normalized missing creator +hard-deleted or broken ref
    res.status(StatusCodes.OK).json({
      totalTrends,
      trends: safeTrends,
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

  limit = Number(limit) || 8; //limit will be provided, defaulting to 36 trends initially

  const queryObject = constructQueryObject(
    search,
    trendTech,
    trendCategory,
    true,
    status
  ); // adding hardcoded isApproved: true, constructQueryObject will create query parameters as an object
  const sortKey = constructSortKey(topRated, topViewed, updated);

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
      await paginateAndSortCursor(queryObject, sortKey, limit, cursor); //undefined is set so that all trends will be pulled from the controller
    // privacy logic
    trends = trends.map((trend) => {
      trend.createdBy = normalizeCreatorForTrend(trend.createdBy);
      if (trend.createdBy && trend.createdBy.privacy) {
        trend.createdBy.githubUsername = ''; // removing githubUsername if privacy is enabled
      }
      return trend;
    });

    res.status(StatusCodes.OK).json({
      totalTrends,
      pagesNumber,
      trends,
      nextCursor,
      hasNextPage,
    }); // directly respond with the list of approved trends (could be an empty array)
  } catch (error) {
    // handle any potential errors during the database query
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
  }
}; //end getApprovedTrends

// /**
//  * GET TREND_CATEGORY & TECHNOLOGIES SVG
//  * @param {*} req
//  * @param {*} res
//  * @returns
//  */
// export const getSelectIconData = (req, res) => {
//   try {
//     if (!req.user) {
//       throw new UnauthenticatedError('User not authenticated');
//     }
//     res.status(StatusCodes.OK).json({ TREND_CATEGORY, TECHNOLOGIES });
//   } catch (error) {
//     return next(error);
//   }
// }; //end getSelectIconData

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
}; //end searchTrends

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
  const limit = 16; // fixed limit per page
  const trendLimit = 24; //fixed limit of trends for this controller
  const cursor = req.query.cursor || null;

  const queryObject = { isApproved: true }; //only approved trends

  const sortKey = { views: -1 }; //highest views first

  try {
    const { totalTrends, trends, nextCursor, hasNextPage } =
      await paginateAndSortCursorViews(
        queryObject,
        sortKey,
        limit,
        cursor,
        trendLimit
      );

    const sanitizedTrends = trends.map((trend) => {
      if (trend.createdBy && trend.createdBy.privacy) {
        trend.createdBy.githubUsername = '';
      }
      return trend;
    });

    return res.status(StatusCodes.OK).json({
      totalTrends,
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
}; //end getTopViewedTrends
