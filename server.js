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

//middleware
import errorHandlerMiddleware from './middleware/errorHandlerMiddleware.js';
//schedulers (using redis and node-cron to limit number of calls for stats)
// import { startScheduledJobs } from './schedulers/scheduledJobs.js';

//setting up access to .env
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export { cloudinary };

//public (for public assets and complete frontend build folder developed in client ES6 modules using ESM syntax)
import { dirname } from 'path'; //__dirname and __filename, which are readily available in CommonJS modules
import { fileURLToPath } from 'url'; //
import path from 'path'; //

const __dirname = dirname(fileURLToPath(import.meta.url));

//evoking app
const app = express();
//if we are in dev log the data if not do not
if (process.env.NODE_ENV === 'development') {
  //HTTP request LOGGER middleware for Node calling dev
  app.use(morgan('dev'));
}
// Serve static files from the assets folder
app.use('/assets', express.static(path.join(__dirname, 'assets'))); //serving static assets

app.use(express.static(path.resolve(__dirname, './public'))); //
app.use(express.json()); //setting up middleware json
app.use(cookieParser()); //cookie parser
app.use(express.urlencoded({ extended: true })); //parses URL-encoded payloads (not yet used)

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
app.use('/api/v1/blog', blogRouter); //blog routers

// Set up CORS to allow requests from localhost:5173
app.use(
  cors({
    origin: 'http://localhost:5173',
  })
);
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
  // startScheduledJobs();//redis
} catch (error) {
  console.log(error);
  process.exit(1);
}

//listener on port 5100
app.listen(port, () => {
  console.log(`server is running here: ${port}`);
});
