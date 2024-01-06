import { nanoid } from 'nanoid';
import trendModel from '../models/trendModel.js';
import { StatusCodes } from 'http-status-codes';

//test data for local storage set as 'let' for modification
let trends = [
  { id: nanoid(), trend: 'chatgpt', category: 'language model' },
  { id: nanoid(), trend: 'react', category: 'javascript framework' },
];

//GET A TREND (setting up a retrieve/read all trends in a route /api/v1/trends)
export const getAllTrends = async (req, res) => {
  //getting the trends
  const trends = await trendModel.find({});
  //if there is anything but response 200 resource is not found
  res.status(StatusCodes.OK).json({ trends }); //response fot the client
};

//ADD A TREND
export const createTrend = async (req, res) => {
  //VALIDATION NEEDED
  //asynchronously adding a new trend object to the database (create looks for an object)
  const trendObject = await trendModel.create(req.body);
  //response fot the client with created trend is 201
  res.status(StatusCodes.CREATED).json({ trendObject });
};

//GET SINGLE TREND
export const getSingleTrend = async (req, res) => {
  const { id } = req.params; //retrieving the id
  const trendObject = await trendModel.findById(id); //retrieve the trend if it equals the id in the data
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
  //1: find trend
  const { id } = req.params;
  //using findByIdAndDelete to delete data out of trendModel based on id
  const removeTrend = await trendModel.findByIdAndDelete(id);
  console.log(removeTrend);
  //2: filter out all trends besides the one that is provided
  const newTrendObject = trends.filter((trend) => trend.id !== id);
  //3: Storing the new trends in the trends array
  trends = newTrendObject;
  res.status(StatusCodes.OK).json({ msg: 'trend deleted', trend: removeTrend }); //returning the found trend
};
