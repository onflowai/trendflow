import { body, param, validationResult } from 'express-validator';
import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from '../errors/customErrors.js';
import TrendCategory from '../models/categoryModel.js';
import Technology from '../models/technologyModel.js';
import { getBlacklist } from '../utils/blacklisted.js';
import trendModel from '../models/trendModel.js';
import UserModel from '../models/userModel.js';

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

export const validateTrendInput = withValidationErrors([
  body('trend')
    .notEmpty()
    .withMessage('please add a trend')
    .bail()
    .custom(async (value) => {
      const lower = value.toLowerCase();
      const blacklist = await getBlacklist();
      if (blacklist.some((word) => lower.includes(word))) {
        throw new BadRequestError('Trend contains prohibited words');
      }
      return true;
    }),
  body('trendCategory').custom(async (value) => {
    const exists = await TrendCategory.exists({ value });
    if (!exists) {
      throw new Error('invalid trend category');
    }
    return true;
  }),
  body('trendTech').custom(async (value) => {
    const exists = await Technology.exists({ value });
    if (!exists) {
      throw new Error('invalid trend stack');
    }
    return true;
  }),
  body('role').not().exists().withMessage('Cannot change role'),
]);

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
