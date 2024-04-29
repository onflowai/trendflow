import trendModel from '../models/trendModel.js';
import { StatusCodes } from 'http-status-codes';
import { sanitizeHTML } from '../utils/sanitization.js';
import { executePythonScript } from '../utils/script_controller.js';
import { generatePostContent } from '../api/trendPostGenerator.js';
/**
 * This is where functionality of trends implemented
 * @param {*} req
 * @param {*} res
 * @returns
 */
//test data for local storage set as 'let' for modification
// let trends = [
//   { id: nanoid(), trend: 'chatgpt', category: 'language model' },
//   { id: nanoid(), trend: 'react', category: 'javascript framework' },
// ];
export const submitTrend = async (req, res) => {
  const { trend } = req.body;
  trend = sanitizeHTML(trend); //sanitize the trend input to prevent XSS
  const existingTrend = await trendModel.findOne({ trend });
  if (existingTrend) {
    return res.status(400).json({ msg: 'Trend already exists' });
  }
  req.body.createdBy = req.user.userID; //adding createdBy property storing user id
  const trendObject = await trendModel.create({
    ...req.body,
    isApproved: false,
  }); //create a new document spreading current properties
  res.status(StatusCodes.CREATED).json({ trendObject });
}; //end SUBMIT

//GET ALL TRENDS (only for ADMIN)
export const getAllTrends = async (req, res) => {
  // console.log(req);
  console.log('user object: ', req.user);
  const trends = await trendModel.find().populate('createdBy', 'username -_id'); //getting the trends belonging to user that provided cookie and token
  console.log(trends);
  res.status(StatusCodes.OK).json({ trends }); //if there is anything but response 200 resource is not found response fot the client
};

//GET A TREND (setting up a retrieve/read all trends in a route /api/v1/trends belonging to user)
export const getUserTrends = async (req, res) => {
  // console.log(req.user);
  const trends = await trendModel.find({ createdBy: req.user.userID }); //getting the trends belonging to user that provided cookie and token
  res.status(StatusCodes.OK).json({ trends }); //if there is anything but response 200 resource is not found response fot the client
};

//CREATE TREND
export const createTrend = async (req, res) => {
  // if (req.user.role !== 'admin') {
  //   return res
  //     .status(StatusCodes.UNAUTHORIZED)
  //     .json({ msg: 'Unauthorized access' });
  // }
  req.body.createdBy = req.user.userID; //createdBy populated with userDI
  const trendObject = await trendModel.create(req.body); //async adding a new trend object to the database (create looks for an object)
  res.status(StatusCodes.CREATED).json({ trendObject }); //response fot the client with created trend is 201
};

//GET SINGLE TREND
export const getSingleTrend = async (req, res) => {
  const { slug } = req.params; //retrieving the id
  const trendObject = await trendModel.findOne({ slug: slug }); //retrieve the trend if it equals the id in the data
  if (!trendObject) {
    return res.status(404).json({ msg: 'Trend not found' });
  }
  trendObject.generatedBlogPost = sanitizeHTML(trendObject.generatedBlogPost); //sanitizing html in case
  res.status(StatusCodes.OK).json({ trendObject }); //returning the found trend
};

//UPDATE TREND
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
    return res.status(404).json({ msg: 'Trend not found' });
  }
  //response
  res
    .status(StatusCodes.OK)
    .json({ msg: 'trend modified', trend: updateTrend }); //returning the found trend
};

//DELETE TREND
// export const deleteTrend = async (req, res) => {
//   const { id } = req.params; //1: find trend
//   const removeTrend = await trendModel.findByIdAndDelete(id); //using findByIdAndDelete to delete data out of TrendModel based on id
//   console.log(removeTrend);
//   const newTrendObject = trends.filter((trend) => trend.id !== id); //2: filter out all trends besides the one that is provided
//   trends = newTrendObject; //3: Storing the new trends in the trends array
//   res.status(StatusCodes.OK).json({ msg: 'trend deleted', trend: removeTrend }); //returning the found trend
// };
//DELETE TREND
export const deleteTrend = async (req, res) => {
  const { slug } = req.params; //1: find trend
  const removeTrend = await trendModel.findOneAndDelete({ slug: slug });
  if (!removeTrend) {
    return res.status(404).json({ msg: 'Trend not found' });
  }
  res.status(StatusCodes.OK).json({ msg: 'Trend deleted', trend: removeTrend });
};

//APPROVE TREND
export const approveTrend = async (req, res) => {
  const { slug } = req.params; // Use slug from the request parameters
  try {
    const trend = await trendModel.findOne({ slug: slug }); // Find the trend using the slug
    if (!trend) {
      return res.status(404).json({ msg: 'Trend not found' });
    }
    //CALLING THE PYTHON SCRIPT

    const scriptOutput = await executePythonScript(trend.trend);
    console.log('Script output: ', scriptOutput);

    const data = JSON.parse(scriptOutput); //parsing the JSON output from scripts
    //CALLING THE OPENAI
    const { trendPost, trendDesc, trendUse } = await generatePostContent(
      trend.trend,
      trend.trendCategory,
      trend.trendTech
    );
    const safeTrendPost = sanitizeHTML(trendPost); //content sanitization from external sources before saving
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
    res.status(500).json({ msg: error.message });
  }
}; //end APPROVE TREND

//GET APPROVED TRENDS
export const getApprovedTrends = async (req, res) => {
  try {
    // Query the database for trends where isApproved is true (return without: blogPost, )
    const trends = await trendModel
      .find({ isApproved: true }, '-generatedBlogPost -trendUse')
      .populate('createdBy', 'username -_id');
    // Directly respond with the list of approved trends (could be an empty array)
    res.status(StatusCodes.OK).json({ trends });
  } catch (error) {
    // Handle any potential errors during the database query
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
  }
};
