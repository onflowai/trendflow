import { StatusCodes } from 'http-status-codes';
import UserModel from '../models/userModel.js';
import TrendModel from '../models/trendModel.js';
/**
 * Since the user is authenticated using cookie token on the backend we need to send data about the user
 * This is where this data is passed to the frontend
 */
//Getting current user retrieved every time user is in the dashboard
export const getCurrentUser = async (req, res) => {
  const user = await UserModel.findOne({ _id: req.user.userID }); //NOTE user data is stored and managed server-side with JWT
  const userControlled = user.toJSON(); //userControlled is user without password implemented in the model
  res.status(StatusCodes.OK).json({ user: userControlled });
};
//
export const getApplicationStats = async (req, res) => {
  res.status(StatusCodes.OK).json({ msg: 'get application stats' });
};
//update User
export const updateUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ msg: 'get current user' });
};
