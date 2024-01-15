import { nanoid } from 'nanoid';
import TrendModel from '../models/TrendModel.js';
import { StatusCodes } from 'http-status-codes';

//test data for local storage set as 'let' for modification
let trends = [
  { id: nanoid(), trend: 'chatgpt', category: 'language model' },
  { id: nanoid(), trend: 'react', category: 'javascript framework' },
];

//GET A TREND (setting up a retrieve/read all trends in a route /api/v1/trends)
export const getAllTrends = async (req, res) => {
  console.log(req.user);
  const trends = await TrendModel.find({}); //getting the trends
  res.status(StatusCodes.OK).json({ trends }); //if there is anything but response 200 resource is not found response fot the client
};

//ADD A TREND
export const createTrend = async (req, res) => {
  //VALIDATION NEEDED
  const trendObject = await TrendModel.create(req.body); //async adding a new trend object to the database (create looks for an object)
  res.status(StatusCodes.CREATED).json({ trendObject }); //response fot the client with created trend is 201
};

//GET SINGLE TREND
export const getSingleTrend = async (req, res) => {
  const { id } = req.params; //retrieving the id
  const trendObject = await TrendModel.findById(req.params.id); //retrieve the trend if it equals the id in the data
  res.status(StatusCodes.OK).json({ trendObject }); //returning the found trend
};

//EDIT / UPDATE TREND
export const editTrend = async (req, res) => {
  const { id } = req.params;
  // Mongoose method: findByIdAndUpdate passing in id, req.body, new: true returns the modified document rather than the original
  const updateTrend = await TrendModel.findByIdAndUpdate(id, req.body, {
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
  const removeTrend = await TrendModel.findByIdAndDelete(id); //using findByIdAndDelete to delete data out of TrendModel based on id
  console.log(removeTrend);
  const newTrendObject = trends.filter((trend) => trend.id !== id); //2: filter out all trends besides the one that is provided
  trends = newTrendObject; //3: Storing the new trends in the trends array
  res.status(StatusCodes.OK).json({ msg: 'trend deleted', trend: removeTrend }); //returning the found trend
};
