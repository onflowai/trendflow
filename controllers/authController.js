import { StatusCodes } from 'http-status-codes';
import UserModel from '../models/UserModel.js';
import { authenticatePassword, hashPassword } from '../utils/passwordUtils.js';
import { UnauthenticatedError } from '../errors/customErrors.js';
import { createJWT } from '../utils/tokenUtils.js';
/**
 * Frontend receives the token, it then sends back the token on the server the token is decoded and looks at the user and the role
 * JWT also automatically create expiration data. All this is done with HTTP Only Cookie which is
 * @param {*} req
 * @param {*} res
 */
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
  if (!user) throw new UnauthenticatedError('invalid credentials'); //if user not found throw custom error
  const isPasswordCorrect = await authenticatePassword(
    req.body.password,
    user.password
  ); //async function which takes the password entered by the user and the password from database to compare them
  if (!isPasswordCorrect) throw new UnauthenticatedError('invalid credentials'); //if password does not match then:
  const token = createJWT({ userID: user._id, role: user.role }); //encoding user id user role into the token + iat and exp generated
  // console.log(token);
  const oneDay = 86400000; //one day in milliseconds
  //res.json({ token }); //seeing the token
  //cookie named token, httpOnly cookie cannot be accessed by javascript
  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production', //when secure true, transmit in https if not http
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', // 'None' requires secure to be true
  }); //cookie named token with value token is stored on frontend with HTTP only cookies with every request

  res.status(StatusCodes.OK).json({ msg: 'user logged in' }); //just a message this is not where the token is sent
};
