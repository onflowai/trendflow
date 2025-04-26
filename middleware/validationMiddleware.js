import { body, param, validationResult } from 'express-validator';
import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from '../errors/customErrors.js';
import { trendCategoryValues, technologiesValues } from '../utils/constants.js';
import { getBlacklist } from '../utils/blacklisted.js';
import trendModel from '../models/trendModel.js';
import UserModel from '../models/userModel.js';
import mongoose from 'mongoose';
/**
 * VALIDATION LAYER test and error response
 * @param {*} validateValues
 * @returns
 */
//validateValues array and the validation response returns an array
const withValidationErrors = (validateValues) => {
  //grouping the
  return [
    validateValues,
    (req, res, next) => {
      const errors = validationResult(req);
      //if isEmpty false there are errors
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        if (errorMessages[0].startsWith('no trend')) {
          throw new NotFoundError(errorMessages);
        }
        throw new BadRequestError(errorMessages);
      }
      next();
    },
  ];
};
//
// export const validateTest = withValidationErrors([
//   body('name')
//     .notEmpty()
//     .withMessage('name is required')
//     .isLength({ min: 4, max: 50 })
//     .withMessage('name must be at least 50 characters')
//     .trim(),
// ]);
// export const adminOnly = (req, res, next) => {
//   if (req.user && req.user.role === 'admin') {
//     next();
//   } else {
//     throw new UnauthenticatedError('Unauthorized to access this page');
//   }
// };
//Custom validation
export const validateTrendInput = withValidationErrors([
  body('trend').notEmpty().withMessage('please add a trend'),
  body('trendCategory')
    .isIn(trendCategoryValues)
    .withMessage('invalid trend category'),
  body('trendTech').isIn(technologiesValues).withMessage('invalid trend stack'),
  body('role').not().exists().withMessage('Cannot change role'),
]);
//Async trend ID validation set up as true and false with mongoose
// export const validateIdParam = withValidationErrors([
//   param('slug').custom(async (value) => {
//     const isValidId = mongoose.Types.ObjectId.isValid(value); //isValidId returns true or false
//     if (!isValidId) throw new BadRequestError('invalid mongodb id'); //condition for the error
//     const trendObject = await trendModel.findById(value); //retrieve the trend if it equals the id in the data
//     if (!trendObject)
//       throw new NotFoundError(`no trend found with id ${value}`); //if the trend does not exist get the NotfoundError
//   }),
// ]);
//validateSlugParam middleware validates that a provided slug exists in the database
export const validateSlugParam = withValidationErrors([
  param('slug').custom(async (value) => {
    const trendObject = await trendModel.findOne({ slug: value }); // Retrieve the trend by slug instead of ID
    if (!trendObject)
      throw new NotFoundError(`No trend found with slug ${value}`); // If the trend does not exist, throw NotFoundError
  }),
]);

//Create user validation
export const validateRegisterInput = withValidationErrors([
  body('username')
    .notEmpty()
    .withMessage('username is required')
    .isLength({ min: 4, max: 20 })
    .withMessage('Username must be between 4 and 20 characters long.')
    .matches(/^[A-Za-z0-9_-]+$/)
    .withMessage(
      'Username must contain only letters, numbers, underscores, or hyphens.'
    )
    .matches(/^[A-Za-z]/)
    .withMessage('Username must start with a letter.')
    .custom(async (username) => {
      const lowerUsername = username.toLowerCase();
      const blacklist = await getBlacklist();
      const matched = blacklist.find((word) => lowerUsername.includes(word));
      if (matched) {
        throw new BadRequestError('Username contains prohibited words');
      }
      const user = await UserModel.findOne({ username });
      if (user && user.verified) {
        throw new BadRequestError('Username already exists');
      } // checking if username already exists (if verified)
      // if user exists but is unverified do nothing
      return true;
    }),
  body('email')
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('invalid email format')
    .custom(async (email) => {
      const user = await UserModel.findOne({ email });
      if (user && user.verified) {
        throw new BadRequestError('email already exists');
      } // if the user is verified, block
      //allowing to continue register to controller
    }),
  body('password')
    .notEmpty()
    .withMessage('password is required')
    .isLength({ min: 8 })
    .withMessage('password must be at least 8 characters long'),
  body('name').notEmpty().withMessage('name is required'),
  body('lastName').notEmpty().withMessage('last name is required'),
]);

export const validateLoginInput = withValidationErrors([
  body('email')
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('invalid email format'),
  body('password').notEmpty().withMessage('password is required'),
]);

export const validateUserUpdate = withValidationErrors([
  body('role').not().exists().withMessage('Cannot change role'),
  body('username').not().exists().withMessage('Cannot change username'),
  body('email')
    .optional()
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('invalid email format')
    .custom(async (email, { req }) => {
      const user = await UserModel.findOne({ email }); //search the user based on the email if present throw error
      if (user && user._id.toString() !== req.user.userID) {
        throw new BadRequestError('email already exists'); //method allows users to submit updates to their profile without changing their email
      }
    }),
]);
