import UserModel from '../models/userModel.js';
import { StatusCodes } from 'http-status-codes';
import visitModel from '../models/visitModel.js';
import { createJWT } from '../utils/tokenUtils.js';
import { generateVerificationData } from '../utils/authUtils.js';
import { UnauthenticatedError } from '../errors/customErrors.js';
import { sendVerificationEmail } from '../services/emailService.js';
import { validateToken, validateEmail } from '../utils/sanitization.js';
import { authenticatePassword, hashPassword } from '../utils/passwordUtils.js';
/**
 * Frontend receives the token, it then sends back the token on the server the token is decoded and looks at the user and the role
 * JWT also automatically create expiration data. All this is done with HTTP Only Cookie which is
 */

/**
 * REGISTER
 *   creates the user, generates verification data, and calls the email service to send the verification email
 * - hashes the password
 * - assigns the role first two accounts become admin (tempt)
 * - generates verification data code, token, expiration
 * - creates the user and sends a verification email
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
export const register = async (req, res, next) => {
  try {
    // determining role: first two accounts become admin, all others are user
    const numberOfAccounts = await UserModel.countDocuments();
    const isFirstOrSecondAccount = numberOfAccounts < 2;
    req.body.role = isFirstOrSecondAccount ? 'admin' : 'user';

    const hashedPassword = await hashPassword(req.body.password); //hashing the user's password.
    req.body.password = hashedPassword;

    const { verificationCode, verificationToken, verificationExpires } =
      generateVerificationData(); // generating verification data
    req.body.verificationCode = verificationCode;
    req.body.verificationToken = verificationToken;
    req.body.verificationExpires = verificationExpires;
    req.body.verified = false; // initially not verified

    req.body.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); //one day (shelf life for unverified user)

    const user = await UserModel.create(req.body); // create the user in the database

    await sendVerificationEmail({
      email: user.email,
      verificationCode, // verificationCode in the email body
      verificationToken, // used to generate the verification link
    }); // sending the verification email

    res.status(StatusCodes.CREATED).json({
      msg: 'User created. Please check your email to verify your account.',
    });
  } catch (error) {
    next(error);
  }
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
 * logout ()
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
    let guestUser;

    const { guestUserID } = req.cookies; // check if the guestUserID cookie exists

    if (guestUserID) {
      guestUser = await UserModel.findById(guestUserID); // attempt to find the existing guest user

      if (guestUser && new Date() < guestUser.expiresAt) {
        console.log('Reusing existing guestUser.');
      } else {
        guestUser = await guestCreateSession(); // if guestUser doesn't exist or has expired, create a new one
      } // check if the guestUser exists and hasn't expired
    } else {
      guestUser = await guestCreateSession(); // if no guestUserID cookie, create a new guestUser
    }

    const expiresIn = process.env.JWT_GUEST_EXPIRES_IN;
    const token = createJWT(
      { userID: guestUser._id, role: guestUser.role },
      expiresIn
    ); // JWT token for the guest user

    const oneDay = 86400000; // one day in milliseconds
    res.cookie('token', token, {
      httpOnly: true,
      expires: new Date(Date.now() + oneDay),
      secure: process.env.NODE_ENV === 'production', // transmit in HTTPS if in production
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', // 'None' requires secure to be true
    }); // setting HTTP Only cookie with the token

    res.cookie('guestUserID', guestUser._id, {
      httpOnly: true,
      expires: new Date(Date.now() + oneDay),
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    }); // setting HTTP Only cookie with the guestUserID

    res.status(StatusCodes.OK).json({ msg: 'Guest user logged in' });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: 'Failed to create guest user',
      error: error.message,
    });
  }
}; //end guestLogin

/**
 * GUEST LOGIN
 * used in Landing 'Create Account Later' stored in user model deleted after set time
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const guestCreateSession = async (req, res) => {
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
  return guestUser;
}; //end guestCreateSession

/**
 * TODO: UPGRADE ACCOUNT
 * upgrade guestUser or a user
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const upgradeAccount = async (req, res) => {
  const { password, name, email } = req.body;
  if (!password || !name || !email) {
    throw new BadRequestError('Please provide all required fields.');
  }
  try {
    const user = await UserModel.findById(req.user.userID);
    if (!user) {
      throw new UnauthenticatedError('User not found.');
    }
    if (user.role !== 'guestUser') {
      throw new BadRequestError('Account is already a regular user.');
    }
    user.password = await hashPassword(password); // updating user details
    user.name = name; // updating user details
    user.email = email; // updating user details
    user.role = 'user'; // updating guestUser to user
    user.expiresAt = null; // Remove expiration

    await user.save();
    const JWT_EXPIRES_IN = process.env.JWT_SECRET;
    const token = createJWT(
      { userID: user._id, role: user.role },
      JWT_EXPIRES_IN
    ); // 1 day
    const oneDay = 86400000; // One day in milliseconds

    res.cookie('token', token, {
      httpOnly: true,
      expires: new Date(Date.now() + oneDay),
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    });

    res.cookie('guestUserID', '', {
      httpOnly: true,
      expires: new Date(Date.now()), // Expire immediately
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    }); //removing the guestUserID for new user creation

    res.status(StatusCodes.OK).json({ msg: 'Account upgraded successfully.' });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: 'Failed to upgrade account',
      error: error.message,
    });
  }
}; //end upgradeAccount

/**
 * validates the token from the query updates user’s verified status
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
export const verifyEmail = async (req, res, next) => {
  try {
    const token = validateToken(req.query.token); ///verify-email?token=...
    if (!token) {
      return next(new BadRequestError('Verification token is required.'));
    }

    const user = await UserModel.findOne({
      verificationToken: { $eq: token },
      verificationExpires: { $gt: new Date() }, // Only consider non-expired tokens
    }); // finding the user with the provided token

    if (!user) {
      return next(
        new BadRequestError('Invalid or expired verification token.')
      );
    }

    user.verified = true; // marking the user as verified
    user.verificationToken = undefined;
    user.verificationCode = undefined;
    user.verificationExpires = undefined;

    user.expiresAt = null; //clearing expiresAt so the TTL index won't delete verified user

    await user.save();

    res.status(200).json({ message: 'Email successfully verified.' });
  } catch (error) {
    next(new BadRequestError(error.message));
  }
}; //end verifyEmail

/**
 * VERIFY CODE verifies a user based on a code (manual verification)
 *  - email: user's email address
 *  - code: 6-digit verification code the user received
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
export const verifyCode = async (req, res, next) => {
  try {
    const email = validateEmail(req.body.email);
    const code = req.body.code;
    if (!email || !code) {
      return next(
        new BadRequestError('Email and verification code are required.')
      );
    }

    const user = await UserModel.findOne({
      email: { $eq: email },
      verificationCode: { $eq: code },
      verificationExpires: { $gt: new Date() },
    }); // finding the user with the matching email and code ensuring the code has not expired

    if (!user) {
      return next(new BadRequestError('Invalid or expired verification code.'));
    }

    user.verified = true; // marking the user as verified
    user.verificationToken = undefined; //clearing the verification fields
    user.verificationCode = undefined; //clearing the verification fields
    user.verificationExpires = undefined; //clearing the verification fields

    user.expiresAt = null; //clearing expiresAt so the TTL index won't delete verified user

    await user.save();

    res.status(200).json({ message: 'Email successfully verified.' });
  } catch (error) {
    next(new BadRequestError(error.message));
  }
}; //end verifyCode

/**
 * letting user resend email this endpoint regenerates or reuses the verification data
 * updates the user record if needed, and calls the email service again
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const resendEmail = async (req, res, next) => {
  try {
    const email = validateEmail(req.body.email);
    if (!email) {
      throw new BadRequestError('Email is required');
    }

    const user = await UserModel.findOne({ email }); // finding user by email
    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (user.verified) {
      throw new BadRequestError('User is already verified');
    }

    const FIFTEEN_MINUTES = 15 * 60 * 1000;
    const canResend =
      !user.lastVerificationEmailSentAt ||
      Date.now() - user.lastVerificationEmailSentAt.getTime() > FIFTEEN_MINUTES;

    if (!canResend) {
      throw new TooManyRequestsError(
        'Too many requests. Please wait before sending another verification email.'
      );
    } // checking rate limit

    const { verificationToken, verificationCode, verificationExpires } =
      generateVerificationData(); //regenerate token/code or re-use existing one
    user.verificationToken = verificationToken;
    user.verificationCode = verificationCode;
    user.verificationExpires = verificationExpires;
    await user.save();

    user.lastVerificationEmailSentAt = new Date();
    await user.save(); //updating lastVerificationEmailSentAt

    await sendVerificationEmail({
      email: user.email,
      verificationToken,
      verificationCode,
    }); // sending new verification email

    res.status(StatusCodes.OK).json({
      message: 'Verification email resent. Check your inbox or spam folder.',
    });
  } catch (error) {
    next(error);
  }
};
