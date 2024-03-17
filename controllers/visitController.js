import { StatusCodes } from 'http-status-codes';
import trendModel from '../models/trendModel.js';
import visitModel from '../models/visitModel.js';
import userModel from '../models/userModel.js';
import mongoose from 'mongoose';
import day from 'dayjs';
/**
 * In this controller we use a visit count which logs visits of guest users and other metrics for
 * @param {*} req
 * @param {*} res
 */
export const logVisit = async (req, res) => {
  const { role } = req.body;
  try {
    await visitModel.create({ role });
    res.status(StatusCodes.OK).send();
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: 'Failed to log visit', error: error.message });
  }
};

//ADMIN STATS: returns count of monthly submitted-trends and monthly visited-users (more stats in userController)
export const adminStats = async (req, res) => {
  let monthTrends = await trendModel.aggregate([
    { $match: { isApproved: false } }, //match only not approved trends so aggregating all submitted trends
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' }, //filtered by year
          month: { $month: '$createdAt' }, //filtered by month
        },
        count: { $sum: 1 }, //for each year + month calculating total count of trends
      },
    },
    {
      $project: {
        _id: 0, //excluding the _id field from the output.
        year: '$_id.year', //formatting the output
        month: '$_id.month', //filtered by month
        count: 1, ///including the count of documents in the group.
      },
    },
    {
      $sort: { year: 1, month: 1 }, // Sorting results by year and month
    },
  ]); //end monthTrends
  monthTrends = monthTrends.map((trend) => {
    const { count, year, month } = trend;
    const date = day()
      .month(month - 1)
      .year(year)
      .format('MMM YYYY')
      .toUpperCase();
    return { date, count };
  });
  let monthUsers = await userModel.aggregate([
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        year: '$_id.year',
        month: '$_id.month',
        count: 1,
      },
    },
    {
      $sort: { year: 1, month: 1 }, // Sorting results by year and month
    },
  ]);
  let guestUserVisit = await visitModel.aggregate([
    { $match: { role: 'guestUser' } },
    {
      $group: {
        _id: {
          year: { $year: '$timestamp' },
          month: { $month: '$timestamp' },
        },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        year: '$_id.year',
        month: '$_id.month',
        count: 1,
      },
    },
    {
      $sort: { year: 1, month: 1 },
    },
  ]);

  res.status(StatusCodes.OK).json({ monthUsers, monthTrends, guestUserVisit });
};
