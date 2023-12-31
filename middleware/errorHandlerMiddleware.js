import { StatusCodes } from 'http-status-codes';

const errorHandlerMiddleware = (err, req, res, next) => {
  //try catch which prevents the server from shutting down on error
  console.log(err);
  //for CODE statusCode property is used from the customErrors or generic 500 error
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  //for JSON pulling the message from each of the trendControllers OR generic message
  const msg = err.message || 'something went wrong, try again';
  //status return
  res.status(statusCode).json({ msg });
};

export default errorHandlerMiddleware;
