import { StatusCodes } from 'http-status-codes';
import UserModel from '../models/UserModel.js';
import { authenticatePassword, hashPassword } from '../utils/passwordUtils.js';
import { UnauthenticatedError } from '../errors/customErrors.js';

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
  const user = await UserModel.findOne({ email: req.body.email }); //find the users email if it exists store it in user
  if (!user) throw new UnauthenticatedError('invalid credentials');
  const isPasswordCorrect = await authenticatePassword(
    req.body.password,
    user.password
  );
  if (!isPasswordCorrect) throw new UnauthenticatedError('invalid credentials');

  res.send('login');
};
