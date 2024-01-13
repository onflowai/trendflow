import { StatusCodes } from 'http-status-codes';
import UserModel from '../models/UserModel.js';
import { hashPassword } from '../utils/passwordUtils.js';

export const register = async (req, res) => {
  const numberOfAccounts = await UserModel.countDocuments();
  const isFirstOrSecondAccount = numberOfAccounts < 2; // Check if there are less than two accounts
  req.body.role = isFirstOrSecondAccount ? 'admin' : 'user'; // Assign 'admin' role if it's the first or second account

  const hashedPassword = await hashPassword(req.body.password); //replacing password with hashed password
  req.body.password = hashedPassword;
  const user = await UserModel.create(req.body);
  res.status(StatusCodes.CREATED).json({ msg: 'user created' });
};

export const login = async (req, res) => {
  res.send('login');
};
