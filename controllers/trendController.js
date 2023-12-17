import { nanoid } from 'nanoid';

//test data for local storage set as 'let' for modification
let trends = [
  { id: nanoid(), trend: 'chatgpt', type: 'language model' },
  { id: nanoid(), trend: 'react', type: 'javascript framework' },
];

//GET a trend (setting up a retrieve/read all trends in a route /api/v1/trends)
export const getAllTrends = async (req, res) => {
  //if there is anything but response 200 resource is not found
  res.status(200).json({ trends }); //response fot the client
};

//ADD a trend
export const createTrend = async (req, res) => {
  //retrieving the trend and type from client
  const { trend, type } = req.body;
  //checking if trend and type
  if (!trend || !type) {
    res.status(400).json({ msg: 'please provide a trend' });
    return;
  }
  const id = nanoid(10); //nanoid generated 10 character id
  const trendObject = { id, trend, type }; //object with added trends
  trends.push(trendObject); //added trends pushed to the stack of all trends
  res.status(201).json({ trendObject }); //response fot the client with created trend is 201
};
//GET SINGLE trend
export const getSingleTrend = async (req, res) => {
  //retrieving the id
  const { id } = req.params;
  //retrieve the trend if it equals the id in the data
  const trendObject = trends.find((trend) => trend.id === id);
  //if the trend does not exist
  if (!trendObject) {
    return res.status(404).json({ msg: `no trend found with id ${id}` });
  }
  res.status(200).json({ trendObject }); //returning the found trend
};
//EDIT trend
export const editTrend = async (req, res) => {
  //1: find trend
  const { trend, type } = req.body;
  //checking if trend and type
  if (!trend || !type) {
    res.status(400).json({ msg: 'please provide a trend' });
    return;
  }
  //2: check if there is id
  const { id } = req.params;
  //retrieve the trend if it equals the id in the data
  const trendObject = trends.find((trend) => trend.id === id);
  //if the trend does not exist
  if (!trendObject) {
    return res.status(404).json({ msg: `no trend found with id ${id}` });
  }
  //3: modify the trend
  trendObject.trend = trend;
  trendObject.type = type;
  //4: response
  res.status(200).json({ msg: 'trend modified', trendObject }); //returning the found trend
};
//DELETE trend
export const deleteTrend = async (req, res) => {
  //1: find trend
  const { id } = req.params;
  //retrieve the trend if it equals the id in the data
  const trendObject = trends.find((trend) => trend.id === id);
  //if the trend does not exist
  if (!trendObject) {
    return res.status(404).json({ msg: `no trend found with id ${id}` });
  }
  //2: filter out all trends besides the one that is provided
  const newTrendObject = trends.filter((trend) => trend.id !== id);
  //3: Storing the new trends in the trends array
  trends = newTrendObject;
  res.status(200).json({ msg: 'trend deleted' }); //returning the found trend
};
