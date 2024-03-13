import { StatusCodes } from 'http-status-codes';
import UserModel from '../models/userModel.js';
import TrendModel from '../models/trendModel.js';
import fs from 'fs/promises'; //allows to remove the image
import cloudinary from 'cloudinary';
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
}; //end getCurrentUser

//UPDATE USER is not set back current user will get updates, this only updates changes + image compression
export const updateUser = async (req, res) => {
  const newUser = { ...req.body }; //using spread operator to copy properties from req.body into newUser object
  delete newUser.password; //if password somehow exists deleting it once again
  //if file attached with request then:
  if (req.file) {
    const response = await cloudinary.v2.uploader.upload(req.file.path); //upload file
    await fs.unlink(req.file.path); //removing the image if file uploaded
    newUser.profile_img = response.secure_url; //updating newUser object with the URL and ID of the uploaded image
    newUser.profile_img_id = response.public_id; //public_id used for future reference or deletion.
  }
  const updatedUser = await UserModel.findByIdAndUpdate(
    req.user.userID,
    newUser //new data to update the user with
    // { new: true }
  ); //updating user by ID when user updates some value like last name (role not updatable)
  res.status(StatusCodes.OK).json({ msg: 'user updated' });
  //checking to see if there is already an image in cloud for the user
  if (req.file && updatedUser.profile_img_id) {
    await cloudinary.v2.uploader.destroy(updatedUser.profile_img_id); //then delete the old image from Cloudinary using its public_id
  }
}; //end updateUser

//STATS route which will display simple statistics
export const getApplicationStats = async (req, res) => {
  const users = await UserModel.countDocuments();
  const trends = await TrendModel.countDocuments();
  const approved = await TrendModel.countDocuments({ isApproved: true });
  const unapproved = await TrendModel.countDocuments({ isApproved: false });
  res.status(StatusCodes.OK).json({ users, trends, approved, unapproved });
}; //end getApplicationStats
