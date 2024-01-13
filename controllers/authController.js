import { StatusCodes } from 'http-status-codes';
import UserModel from '../models/UserModel.js';
import bcrypt from 'bcryptjs';

export const register = async (req, res) => {
  const numberOfAccounts = await UserModel.countDocuments();
  const isFirstOrSecondAccount = numberOfAccounts < 2; // Check if there are less than two accounts
  req.body.role = isFirstOrSecondAccount ? 'admin' : 'user'; // Assign 'admin' role if it's the first or second account
  const salt = await bcrypt.genSalt(10); //creating random hash string
  const hashedPassword = await bcrypt.hash(req.body.password, salt); //adding the string to the password &
  req.body.password = hashedPassword; //replacing password with hashed password
  const user = await UserModel.create(req.body);
  res.status(StatusCodes.CREATED).json({ msg: 'user created' });
};

export const login = async (req, res) => {
  res.send('login');
};
