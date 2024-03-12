import { StatusCodes } from 'http-status-codes';
import UserModel from '../models/userModel.js';
import TrendModel from '../models/trendModel.js';
import sharp from 'sharp';
import fs from 'fs/promises';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

import mongoose from 'mongoose';
/**
 * Since the user is authenticated using cookie token on the backend we need to send data about the user
 * This is where this data is passed to the frontend
 */
//GET CURRENT USER retrieved every time user is in the dashboard
export const getCurrentUser = async (req, res) => {
  const userID = req.user.userID;
  const user = await UserModel.findOne({ _id: userID }); //NOTE user data is stored and managed server-side with JWT
  const approvedTrends = await TrendModel.countDocuments({
    createdBy: userID,
    isApproved: true,
  }); //user stats
  const submittedTrends = await TrendModel.countDocuments({
    createdBy: userID,
  }); //user stats
  const totalSiteTrends = await TrendModel.countDocuments(); // this is a total trends, not user-specific
  const totalTrendViews = await TrendModel.aggregate([
    { $match: { createdBy: userID } },
    { $group: { _id: null, totalViews: { $sum: '$views' } } },
  ]); //user stats
  const viewsResult =
    totalTrendViews.length > 0 ? totalTrendViews[0].totalViews : 0;
  const userControlled = user.toJSON(); //userControlled is user without password implemented in the model
  res.status(StatusCodes.OK).json({
    user: userControlled,
    stats: {
      approvedTrends,
      submittedTrends,
      totalTrendViews: viewsResult,
      totalSiteTrends,
    },
  });
};
//UPDATE USER is not set back current user will get updates, this only updates changes
export const updateUser = async (req, res) => {
  try {
    const userID = req.user.userID;
    let updateObj = { ...req.body };
    if (req.file) {
      const targetDir = path.join(__dirname, '..', 'public', 'uploads'); //use the previously defined __dirname to compute the target directory
      const filename = `${Date.now()}-${req.file.originalname}`;
      const targetPath = path.join(targetDir, filename);
      const fileBuffer = await fs.readFile(req.file.path); //process the image with sharp and save it to the target path
      await sharp(fileBuffer)
        .resize(300, 300)
        .jpeg({ quality: 80 })
        .toFile(targetPath);
      updateObj.profileImagePath = `/uploads/${filename}`; //update the user object with the path of the processed image
    }
    //continue updating the user
    const updatedUser = await UserModel.findByIdAndUpdate(userID, updateObj, {
      new: true,
    });
    res.status(StatusCodes.OK).json({ msg: 'User updated', user: updatedUser });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: 'An error occurred', error: error.message });
  }
};
//STATS route which will display simple statistics
export const getApplicationStats = async (req, res) => {
  const users = await UserModel.countDocuments();
  const trends = await TrendModel.countDocuments();
  const approved = await TrendModel.countDocuments({ isApproved: true });
  const unapproved = await TrendModel.countDocuments({ isApproved: false });
  res.status(StatusCodes.OK).json({ users, trends, approved, unapproved });
};
