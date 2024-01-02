import { body, validationResult } from 'express-validator';
import { BadRequestError, NotFoundError } from '../errors/customErrors.js';
import { TECHNOLOGIES, TREND_CATEGORY } from '../utils/constants.js';
/**
 * validate test and error response
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

export const validateTrendInput = withValidationErrors([
  body('trend').notEmpty().withMessage('please add a trend'),
  body('trendCategory')
    .isIn(Object.values(TREND_CATEGORY))
    .withMessage('invalid trend category'),
  body('trendTech')
    .isIn(Object.values(TECHNOLOGIES))
    .withMessage('invalid trend stack'),
]);
