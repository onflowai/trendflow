import 'express-async-errors';
import * as dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
//routers
import trendRouter from './routes/trendRouter.js';
//middleware
import errorHandlerMiddleware from './middleware/errorHandlerMiddleware.js';
import { validateTest } from './middleware/validationMiddleware.js';

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
//POST request with body express-validation
app.post('/api/v1/test', validateTest, (req, res) => {
  const { name } = req.body;
  res.json({ message: `hello ${name}` });
});

app.use('/api/v1/trends', trendRouter);

//NOT found middleware
//default use case when user tries to access something on a server that is not what is given
app.use('*', (req, res) => {
  res.status(404).json({ msg: 'not found' });
});

//ERROR middleware (SYNCHRONOUS)
app.use(errorHandlerMiddleware);

//this is done so that the hosting platform can inject the any value into the port with env
const port = process.env.PORT || 5100;

try {
  await mongoose.connect(process.env.MONGODB_URL);
  console.log(`server is running on port: ${port}...`);
} catch (error) {
  console.log(error);
  process.exit(1);
}

//listener on port 5100
app.listen(port, () => {
  console.log(`server is running here: ${port}`);
});
