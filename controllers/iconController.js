import TrendCategory from '../models/categoryModel.js';
import Technology from '../models/technologyModel.js';
import { UnauthenticatedError } from '../errors/customErrors.js';
import { StatusCodes } from 'http-status-codes';
/**
 * GET TREND_CATEGORY & TECHNOLOGIES SVG
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const getSelectIconData = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new UnauthenticatedError('User not authenticated');
    }

    const [categories, technologies] = await Promise.all([
      TrendCategory.find({}).lean(),
      Technology.find({}).lean(),
    ]);

    res.status(StatusCodes.OK).json({
      TREND_CATEGORY: categories, // sends labels/values as strings
      TECHNOLOGIES: technologies,
    });
  } catch (error) {
    next(error);
  }
};
