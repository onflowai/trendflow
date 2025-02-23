import * as dotenv from 'dotenv';
dotenv.config(); //dotenv configuration

import fs from 'fs';
import cors from 'cors';
import csurf from 'csurf';
import helmet from 'helmet';
import morgan from 'morgan';
import express from 'express';
import 'express-async-errors';
import mongoose from 'mongoose';
import cloudinary from 'cloudinary';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import robotsRoute from './routes/robots.js';
import sitemapRoute from './routes/sitemap.js';
import mongoSanitize from 'express-mongo-sanitize';
//routers
import authRouter from './routes/authRouter.js';
import userRouter from './routes/userRouter.js';
import blogRouter from './routes/blogRouter.js';
import trendRouter from './routes/trendRouter.js';
import infoHubRouter from './routes/infoHubRouter.js';
//dev routes
import devRouter from './routes/devRouter.js'; //
//middleware
import errorHandlerMiddleware from './middleware/errorHandlerMiddleware.js';
//schedulers (using redis and node-cron to limit number of calls for stats)
// import { startScheduledJobs } from './schedulers/scheduledJobs.js';

//public (for public assets and complete frontend build folder developed in client ES6 modules using ESM syntax)
import { dirname } from 'path'; //__dirname and __filename, which are readily available in CommonJS modules
import { fileURLToPath } from 'url'; //
import path from 'path'; //

// Determine the environment
const env = process.env.NODE_ENV || 'development';

// Explicitly load .env.<environment> first
const envPath = path.resolve(process.cwd(), `.env.${env}`);
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error(`Failed to load ${envPath}:`, result.error);
} else {
  console.log(`Loaded environment variables from ${envPath}`);
}

// define Variables
const PROD_URL = process.env.PROD_URL;
const FRONT_URL = env === 'production' ? PROD_URL : process.env.DEV_URL;
const SERVER_URL = env === 'production' ? PROD_URL : process.env.DEV_URL_SERVER;

// Debug logs to confirm the values
// console.log('NODE_ENV:', env);
// console.log('MONGODB_URL:', process.env.MONGODB_URL);

//setting up access to .env and loading the corresponding .env file
dotenv.config({
  path: path.resolve(process.cwd(), `.env.${env}`),
}); // loading environment variables

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
}); //  cloudinary configuration

export { cloudinary };

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express(); // initializing express app

app.use(compression()); //compression middleware

// app.use(
//   cors({
//     origin: 'http://localhost:5173',
//   })
// );

app.use(
  cors({
    origin: FRONT_URL,
    credentials: true, // allowing credentials (cookies, authorization headers, etc.)
  })
); // setting up CORS to allow requests from localhost:5173

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', PROD_URL, FRONT_URL],
        // Add other directives as needed
      },
    },
  })
); // helmet security helps secure express apps by setting various HTTP headers
app.use(mongoSanitize());

//Cloudflare will handle rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 400, // 400 requests per windowMs
//   message: 'Too many requests from this IP, please try again after 15 minutes',
// }); //prevent abuse by limiting repeated requests
//app.use(limiter);

//evoking app
//if we are in dev log the data if not do not
// if (process.env.NODE_ENV === 'development') {
//   //HTTP request LOGGER middleware for Node calling dev
//   app.use(morgan('dev'));
// }
if (env === 'development') {
  app.use(morgan('dev'));
} // HTTP request logger middleware for development
if (env === 'production') {
  const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'),
    { flags: 'a' }
  );
  app.use(morgan('combined', { stream: accessLogStream }));
} //logging and monitoring

app.use('/assets', express.static(path.join(__dirname, 'assets'))); //serving static assets from the assets folder
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads'))); // Serving server-side uploads
//app.use(express.static(path.resolve(__dirname, 'client', 'dist'))); // serving React build

//app.use(express.static(path.resolve(__dirname, './public'))); //the dist folder from frontend goes here
app.use(express.json()); //setting up middleware json
app.use(cookieParser()); //cookie parser
app.use(express.urlencoded({ extended: true })); //parses URL-encoded payloads (not yet used)

const csrfProtection = csurf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  },
}); // initializing csurf middleware instance (we’re using cookie-based tokens)
// app.use((req, res, next) => {
//   const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
//   if (safeMethods.includes(req.method)) {
//     return next();
//   }
//   return csrfProtection(req, res, next);
// }); // CSRF for all routes
app.get('/api/v1/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
}); // exposing a route to fetch the CSRF token.

//
app.use('/', sitemapRoute);
app.use('/', robotsRoute);

//devRoutes
app.use('/', devRouter);

// API Routes
app.use('/api/v1/trends', trendRouter); //base url
app.use('/api/v1/auth', csrfProtection, authRouter); //authentication
app.use('/api/v1/users', userRouter); //user routers
app.use('/api/v1/blogs', blogRouter); //blog routers
app.use('/api/v1/infohub', infoHubRouter); //info hub routers (used in blog)

app.use('/api/v1/test', (req, res) => {
  res.json({ msg: 'test route' });
}); //testing proxy

// Serve React App in Production
if (env === 'production') {
  // Serve static files from the React app
  app.use(express.static(path.join(__dirname, 'client', 'dist')));

  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
  });
} else {
  // Development route
  app.get('/', (req, res) => {
    res.send('hello world');
  });
} //automated client dist serve

// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, ''));
// }); //pointing to the DIST which was manually moved to the public folder on server

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
      console.log(`Server is running in ${env} mode on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1);
  }
};
startServer();
