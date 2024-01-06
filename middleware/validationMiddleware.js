import { body, param, validationResult } from 'express-validator';
import { BadRequestError, NotFoundError } from '../errors/customErrors.js';
import { TECHNOLOGIES, TREND_CATEGORY } from '../utils/constants.js';
import trendModel from '../models/trendModel.js';
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
//Custom validation
export const validateTrendInput = withValidationErrors([
  body('trend').notEmpty().withMessage('please add a trend'),
  body('trendCategory')
    .isIn(Object.values(TREND_CATEGORY))
    .withMessage('invalid trend category'),
  body('trendTech')
    .isIn(Object.values(TECHNOLOGIES))
    .withMessage('invalid trend stack'),
]);
//Async ID validation set up as true and false with mongoose
export const validateIdParam = withValidationErrors([
  param('id').custom(async (value) => {
    //isValidId returns true or false
    const isValidId = mongoose.Types.ObjectId.isValid(value);
    //condition for the error
    if (!isValidId) throw new BadRequestError('invalid mongodb id');
    //retrieve the trend if it equals the id in the data
    const trendObject = await trendModel.findById(value);
    //if the trend does not exist get the NotfoundError
    if (!trendObject)
      throw new NotFoundError(`no trend found with id ${value}`);
  }),
]);
