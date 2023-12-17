import * as dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import { nanoid } from 'nanoid';

//test data for local storage
let trends = [
  { id: nanoid(), trend: 'chatgpt', type: 'language model' },
  { id: nanoid(), trend: 'react', type: 'javascript framework' },
];

//setting up access to .env
dotenv.config();
//evoking app
const app = express();
//if we are in dev log the data if not do not
if (process.env.NODE_ENV === 'development') {
  //HTTP request LOGGER middleware for Node calling dev
  app.use(morgan('dev'));
}

//setting up middleware json
app.use(express.json());

//app responding to get requests home rout with controller that handles the requests
app.get('/', (req, res) => {
  res.send('hello world');
});
//POST request
app.post('/', (req, res) => {
  console.log(req);
  res.json({ message: 'data received', data: req.body });
});
//setting up a GET to retrieve/read all trends in a route /api/v1/trends
app.get('/api/v1/trends', (req, res) => {
  //if there is anything but response 200 resource is not found
  res.status(200).json({ trends }); //response fot the client
});

//adding a trend
app.post('/api/v1/trends', (req, res) => {
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

  res.status(200).json({ trendObject }); //response fot the client with created trend
});

//this is done so that the hosting platform can inject the any value into the port with env
const port = process.env.PORT || 5100;

//listener on port 5100
app.listen(port, () => {
  console.log(`server is running here: ${port}`);
});
