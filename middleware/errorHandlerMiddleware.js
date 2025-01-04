import { StatusCodes } from 'http-status-codes';
import {
  UnauthenticatedError,
  UnauthorizedError,
  BadRequestError,
} from '../errors/customErrors.js';
/**
 * /**
 * Centralized Error Handling Middleware for Express.js
 *
 * This middleware function captures all errors that occur in the application,
 * whether they're thrown in route handlers or passed via `next(error)`. It determines
 * the type of error and sets the appropriate HTTP status code
 * and error message.
 * @param {*} err
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
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
