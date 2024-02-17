import { StatusCodes } from 'http-status-codes';
import UserModel from '../models/userModel.js';
import TrendModel from '../models/trendModel.js';
/**
 * Since the user is authenticated using cookie token on the backend we need to send data about the user
 * This is where this data is passed to the frontend
 */
//GET CURRENT USER retrieved every time user is in the dashboard
export const getCurrentUser = async (req, res) => {
  const user = await UserModel.findOne({ _id: req.user.userID }); //NOTE user data is stored and managed server-side with JWT
  const userControlled = user.toJSON(); //userControlled is user without password implemented in the model
  res.status(StatusCodes.OK).json({ user: userControlled });
};
//UPDATE USER is not set back current user will get updates, this only updates changes
export const updateUser = async (req, res) => {
  const obj = { ...req.body };
  delete obj.password; //if password somehow exists deleting it once again
  const updateUser = await UserModel.findByIdAndUpdate(req.user.userID, obj); //updating user by ID when user updates some value like last name (role not updatable)
  res.status(StatusCodes.OK).json({ msg: 'user updated' });
};
//STATS route which will display simple statistics
export const getApplicationStats = async (req, res) => {
  const users = await UserModel.countDocuments();
  const trends = await TrendModel.countDocuments();
  res.status(StatusCodes.OK).json({ users, trends });
};
