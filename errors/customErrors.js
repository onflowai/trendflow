import { StatusCodes } from 'http-status-codes';
/**
 * Custom errors: biggest benefit is that more data can be logged instantly for the whole application as all of the
 * error handling is in one file, right here
 */
//error constructor for NOT FOUND 404
export class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}
//error constructor for BAD REQUEST 400
export class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.name = 'BadRequestError';
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}
//error constructor for UNAUTHENTICATED 401
export class UnauthenticatedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnauthenticatedError';
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}
//error constructor for UNAUTHORIZED 403
export class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnauthorizedError';
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}

/**
 * used when this application works correctly but an external provider such as OpenAI fails or returns unusable output
 * public message stays generic while `cause` preserves the original provider error for internal logging and debugging
 */
export class ExternalServiceError extends Error {
  constructor(
    message,
    {
      service,
      cause,
      statusCode = StatusCodes.BAD_GATEWAY,
    } = {}
  ) {
    super(message, { cause });

    this.name = 'ExternalServiceError';
    this.statusCode = statusCode;
    this.service = service || 'external-service';
  }
}