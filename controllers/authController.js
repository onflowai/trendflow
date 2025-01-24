import { StatusCodes } from 'http-status-codes';
import UserModel from '../models/userModel.js';
import visitModel from '../models/visitModel.js';
import { authenticatePassword, hashPassword } from '../utils/passwordUtils.js';
import { UnauthenticatedError } from '../errors/customErrors.js';
import { createJWT } from '../utils/tokenUtils.js';
/**
 * Frontend receives the token, it then sends back the token on the server the token is decoded and looks at the user and the role
 * JWT also automatically create expiration data. All this is done with HTTP Only Cookie which is
 */

/**
 * REGISTER
 * used when user in Landing registers
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const register = async (req, res) => {
  const numberOfAccounts = await UserModel.countDocuments();
  const isFirstOrSecondAccount = numberOfAccounts < 2; // Check if there are less than two accounts
  req.body.role = isFirstOrSecondAccount ? 'admin' : 'user'; // Assign 'admin' role if it's the first or second account
  const hashedPassword = await hashPassword(req.body.password); //replacing password with hashed password
  req.body.password = hashedPassword;
  const user = await UserModel.create(req.body);
  res.status(StatusCodes.CREATED).json({ msg: 'user created' });
}; //end register
/**
 * LOGIN
 * Login and JWT verification of existing user
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const login = async (req, res) => {
  const user = await UserModel.findOne({ email: req.body.email }); //find the users email if it exists store it in user
  if (!user) throw new UnauthenticatedError('invalid credentials'); //if user not found throw custom error
  const isPasswordCorrect = await authenticatePassword(
    req.body.password,
    user.password
  ); //async function which takes the password entered by the user and the password from database to compare them
  if (!isPasswordCorrect) throw new UnauthenticatedError('invalid credentials'); //if password does not match then:
  const expiresIn = process.env.JWT_EXPIRES_IN;
  const token = createJWT({ userID: user._id, role: user.role }, expiresIn); //encoding user id user role into the token + iat and exp generated
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
}; //end login
/**
 * LOGOUT
 * logout
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const logout = (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()), //users token expires right away upon logout
  });
  res.status(StatusCodes.OK).json({ msg: 'user logged out' });
}; //end logout
/**
 * GUEST LOGIN
 * used in Landing 'Create Account Later' stored in user model deleted after set time
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const guestLogin = async (req, res) => {
  try {
    const randomStr = Math.random().toString(36).substring(2, 5); //generate base36 to include letters and numbers
    const uniqueUsername = `guest_${randomStr}`; // example: guest_3df
    const uniqueEmail = `guest_${randomStr}@trendflow.com`; // example: guest_3df@trendflow.com

    const name = 'Trend';
    const lastName = 'Flow';

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days expiration of guest user
    const guestUser = new UserModel({
      username: uniqueUsername,
      email: uniqueEmail,
      name,
      lastName,
      role: 'guestUser',
      expiresAt, // setting expiration date
    }); // creating new guest user
    await guestUser.save(); // saving the guest user to the database
    await visitModel.create({ role: 'guestUser' }); // log the visit
    const expiresIn = process.env.JWT_GUEST_EXPIRES_IN;
    const token = createJWT(
      { userID: guestUser._id, role: guestUser.role },
      expiresIn
    ); // JWT token for the guest user

    const oneDay = 86400000; // One day in milliseconds
    res.cookie('token', token, {
      httpOnly: true,
      expires: new Date(Date.now() + oneDay),
      secure: process.env.NODE_ENV === 'production', // transmit in HTTPS if in production
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', // 'None' requires secure to be true
    }); // setting HTTP Only cookie with the token

    res.status(StatusCodes.OK).json({ msg: 'Guest user logged in' });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: 'Failed to create guest user',
      error: error.message,
    });
  }
}; //end guestLogin

/**
 * TODO: UPGRADE ACCOUNT
 * upgrade guestUser or a user
 * @param {*} req
 * @param {*} res
 * @returns
 */
// export const upgradeAccount = async (req, res) => {
//   const { password, name, email } = req.body;
//   if (!password || !name || !email) {
//     throw new BadRequestError('Please provide all required fields.');
//   }
//   try {
//     const user = await UserModel.findById(req.user.userID);
//     if (!user) {
//       throw new UnauthenticatedError('User not found.');
//     }
//     if (user.role !== 'guestUser') {
//       throw new BadRequestError('Account is already a regular user.');
//     }
//     user.password = await hashPassword(password); // updating user details
//     user.name = name; // updating user details
//     user.email = email; // updating user details
//     user.role = 'user'; // updating guestUser to user
//     user.expiresAt = null; // Remove expiration

//     await user.save();
//     const JWT_EXPIRES_IN = process.env.JWT_SECRET;
//     const token = createJWT(
//       { userID: user._id, role: user.role },
//       JWT_EXPIRES_IN
//     ); // 1 day
//     const oneDay = 86400000; // One day in milliseconds

//     res.cookie('token', token, {
//       httpOnly: true,
//       expires: new Date(Date.now() + oneDay),
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
//     });

//     res.status(StatusCodes.OK).json({ msg: 'Account upgraded successfully.' });
//   } catch (error) {
//     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//       msg: 'Failed to upgrade account',
//       error: error.message,
//     });
//   }
// };//end upgradeAccount
