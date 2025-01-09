import 'express-async-errors';
import * as dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
// import { cloudinary, cloudinary2 } from './config/cloudinary.js';
import cloudinary from 'cloudinary';
//
import cors from 'cors';

//routers
import trendRouter from './routes/trendRouter.js';
import authRouter from './routes/authRouter.js';
import userRouter from './routes/userRouter.js';
import blogRouter from './routes/blogRouter.js';
import infoHubRouter from './routes/infoHubRouter.js';

//public (for public assets and complete frontend build folder developed in client ES6 modules using ESM syntax)
import { dirname } from 'path'; //__dirname and __filename, which are readily available in CommonJS modules
import { fileURLToPath } from 'url'; //
import path from 'path'; //

//middleware
import errorHandlerMiddleware from './middleware/errorHandlerMiddleware.js';
//schedulers (using redis and node-cron to limit number of calls for stats)
// import { startScheduledJobs } from './schedulers/scheduledJobs.js';

// Determine the environment
const env = process.env.NODE_ENV || 'development';

//setting up access to .env and loading the corresponding .env file
dotenv.config({
  path: path.resolve(process.cwd(), `.env.${env}`),
});

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export { cloudinary };

const __dirname = dirname(fileURLToPath(import.meta.url));

//evoking app
const app = express();
//if we are in dev log the data if not do not
// if (process.env.NODE_ENV === 'development') {
//   //HTTP request LOGGER middleware for Node calling dev
//   app.use(morgan('dev'));
// }
if (env === 'development') {
  app.use(morgan('dev'));
} // HTTP request logger middleware for development
// Serve static files from the assets folder
app.use('/assets', express.static(path.join(__dirname, 'assets'))); //serving static assets

app.use(express.static(path.resolve(__dirname, './public'))); //the dist folder from frontend goes here
app.use(express.json()); //setting up middleware json
app.use(cookieParser()); //cookie parser
app.use(express.urlencoded({ extended: true })); //parses URL-encoded payloads (not yet used)
// Set up CORS to allow requests from localhost:5173
app.use(
  cors({
    origin: 'http://localhost:5173',
  })
);
//app responding to get requests home rout with controller that handles the requests
app.get('/', (req, res) => {
  res.send('hello world');
}); //POST request with body express-validation

//testing proxy
app.use('/api/v1/test', (req, res) => {
  res.json({ msg: 'test route' });
});

app.use('/api/v1/trends', trendRouter); //base url
app.use('/api/v1/auth', authRouter); //authentication
app.use('/api/v1/users', userRouter); //user routers
app.use('/api/v1/blogs', blogRouter); //blog routers
app.use('/api/v1/infohub', infoHubRouter); //info hub routers (used in blog)

app.get('*', (res, req) => {
  res.sendFile(path.resolve(__dirname, ''));
}); //pointing to the DIST which was manually moved to the public folder on server

//NOT found middleware
//default use case when user tries to access something on a server that is not what is given
app.use('*', (req, res) => {
  res.status(404).json({ msg: 'not found' });
});

//ERROR middleware (SYNCHRONOUS)
app.use(errorHandlerMiddleware);

//this is done so that the hosting platform can inject the any value into the port with env
const port = process.env.PORT || 5100;

// try {
//   await mongoose.connect(process.env.MONGODB_URL);
//   // startScheduledJobs();//redis
// } catch (error) {
//   process.exit(1);
// }
//listener on port 5100
// app.listen(port, () => {
// });
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Connected to MongoDB`);

    app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1);
  }
};
startServer();
