import { StatusCodes } from 'http-status-codes';
import {
  UnauthenticatedError,
  UnauthorizedError,
  BadRequestError,
} from '../errors/customErrors.js';

const errorHandlerMiddleware = (err, req, res, next) => {
  console.error(err); // Log the error for debugging

  let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  let message = 'Something went wrong, try again';

  if (err instanceof UnauthenticatedError) {
    statusCode = StatusCodes.UNAUTHORIZED;
    message = err.message;
  } else if (err instanceof UnauthorizedError) {
    statusCode = StatusCodes.FORBIDDEN;
    message = err.message;
  } else if (err instanceof BadRequestError) {
    statusCode = StatusCodes.BAD_REQUEST;
    message = err.message;
  } else if (err.name === 'ValidationError') {
    // Handle Mongoose validation errors
    statusCode = StatusCodes.BAD_REQUEST;
    message = err.message;
  } else if (err.name === 'CastError') {
    // Handle Mongoose bad ObjectId
    statusCode = StatusCodes.BAD_REQUEST;
    message = `Resource not found with id of ${err.value}`;
  }

  res.status(statusCode).json({
    msg: message,
    // Include stack trace only in development mode
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default errorHandlerMiddleware;
