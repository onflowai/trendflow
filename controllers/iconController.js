import TrendCategory from '../models/categoryModel.js';
import Technology from '../models/technologyModel.js';
import { UnauthenticatedError, BadRequestError } from '../errors/customErrors.js';
import { StatusCodes } from 'http-status-codes';
import { toKey, toFileName, normalizeSpaces } from '../utils/iconKeyUtils.js';

const TECH_BASE = '/assets';
const CAT_BASE = '/assets/cat';

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
      TREND_CATEGORY: categories, //sends labels/values as strings
      TECHNOLOGIES: technologies,
    });
  } catch (error) {
    next(error);
  }
};//end getSelectIconData

/**
 * ADMIN CREATE CAT
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const adminCreateCategory = async (req, res, next) => {
  try {
    const rawValue = normalizeSpaces(req.body?.value);
    const rawDescription = normalizeSpaces(req.body?.description || '');
    if (!rawValue) throw new BadRequestError('value is required');
    if (rawDescription.length > 500) throw new BadRequestError('description too long (max 500)');
    const key = toKey(rawValue);
    const fileName = toFileName(rawValue);
    const image = `${CAT_BASE}/${fileName}`;
    const exists = await TrendCategory.findOne({ key }).select('_id').lean();
    if (exists) {
      return res.status(StatusCodes.CONFLICT).json({ message: 'Category key already exists', key });
    }

    const doc = await TrendCategory.create({
      key,
      label: rawValue,
      value: rawValue,
      image,
      fullImageUrl: image,
      description: rawDescription || undefined,
    });
    res.status(StatusCodes.CREATED).json({ category: doc });
  } catch (error) {
    next(error);
  }
};//end adminCreateCategory

/**
 * ADMIN CREATE TECH
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const adminCreateTechnology = async (req, res, next) => {
  try {
    const rawValue = normalizeSpaces(req.body?.value);
    const rawDescription = normalizeSpaces(req.body?.description || '');
    if (rawDescription.length > 500) throw new BadRequestError('description too long (max 500)');
    if (!rawValue) throw new BadRequestError('value is required');
    const key = toKey(rawValue);
    const fileName = toFileName(rawValue);
    const image = `${TECH_BASE}/${fileName}`;
    const exists = await Technology.findOne({ key }).select('_id').lean();
    if (exists) {
      return res.status(StatusCodes.CONFLICT).json({ message: 'Technology key already exists', key });
    }

    const doc = await Technology.create({
      key,
      label: rawValue,
      value: rawValue,
      image,
      fullImageUrl: image,
      description: rawDescription || undefined,
    });
    res.status(StatusCodes.CREATED).json({ technology: doc });
  } catch (error) {
    next(error);
  }
};//end adminCreateTechnology