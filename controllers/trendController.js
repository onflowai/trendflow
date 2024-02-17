import { nanoid } from 'nanoid';
import trendModel from '../models/trendModel.js';
import { StatusCodes } from 'http-status-codes';

//test data for local storage set as 'let' for modification
// let trends = [
//   { id: nanoid(), trend: 'chatgpt', category: 'language model' },
//   { id: nanoid(), trend: 'react', category: 'javascript framework' },
// ];
export const submitTrend = async (req, res) => {
  const { trend } = req.body;
  const existingTrend = await trendModel.findOne({ trend });
  if (existingTrend) {
    return res.status(400).json({ msg: 'Trend already exists' });
  }
  req.body.createdBy = req.user.userID;
  const trendObject = await trendModel.create({
    ...req.body,
    isApproved: false,
  });
  res.status(StatusCodes.CREATED).json({ trendObject });
};

export const getAllTrends = async (req, res) => {
  // console.log(req);
  console.log('user object: ', req.user);
  const trends = await trendModel.find(); //getting the trends belonging to user that provided cookie and token
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
  const { id } = req.params; //retrieving the id
  const trendObject = await trendModel.findById(req.params.id); //retrieve the trend if it equals the id in the data
  res.status(StatusCodes.OK).json({ trendObject }); //returning the found trend
};

//EDIT / UPDATE TREND
export const editTrend = async (req, res) => {
  const { id } = req.params;
  // Mongoose method: findByIdAndUpdate passing in id, req.body, new: true returns the modified document rather than the original
  const updateTrend = await trendModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  //response
  res
    .status(StatusCodes.OK)
    .json({ msg: 'trend modified', trend: updateTrend }); //returning the found trend
};

//DELETE TREND
export const deleteTrend = async (req, res) => {
  const { id } = req.params; //1: find trend
  const removeTrend = await trendModel.findByIdAndDelete(id); //using findByIdAndDelete to delete data out of TrendModel based on id
  console.log(removeTrend);
  const newTrendObject = trends.filter((trend) => trend.id !== id); //2: filter out all trends besides the one that is provided
  trends = newTrendObject; //3: Storing the new trends in the trends array
  res.status(StatusCodes.OK).json({ msg: 'trend deleted', trend: removeTrend }); //returning the found trend
};

export const approveTrend = async (req, res) => {
  const { id } = req.params; //this controller allows admins to approve trends and sets isApproved to true
  const trend = await trendModel.findById(id);
  if (!trend) {
    return res.status(404).json({ msg: 'Trend not found' });
  }
  trend.isApproved = true;
  await trend.save();
  res.status(StatusCodes.OK).json({ msg: 'Trend approved', trend });
};
