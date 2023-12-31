import { StatusCodes } from 'http-status-codes';

const errorHandlerMiddleware = (err, req, res, next) => {
  //try catch which prevents the server from shutting down on error
  console.log(err);
  res.status(500).json({ msg: 'something went wrong' });
};
