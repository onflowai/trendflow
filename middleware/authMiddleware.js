import {
  UnauthenticatedError,
  UnauthorizedError,
  BadRequestError,
} from '../errors/customErrors.js';
import UserModel from '../models/userModel.js';
import { verifyJWT } from '../utils/tokenUtils.js';
/**
 * Creating restricted access to trend routs if the cookies are not present or jwt is not valid
 * If token verified attach the user from jtw to the request which look like: { userID: '65c8ef9bd50a47753d20fe84', role: 'user' }
 * This will be used in all of the controller
 */
const rolePermissions = {
  user: ['read', 'write'],
  admin: ['read', 'write', 'delete'],
  guestUser: ['read'],
};
/**
 * AUTH USER
 * async authentication process based on jwt and model data presence
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
export const authenticateUser = async (req, res, next) => {
  const { token, guestUserID } = req.cookies;

  if (!token && guestUserID) {
    const guestUser = await UserModel.findById(guestUserID);

    if (
      guestUser &&
      guestUser.role === 'guestUser' &&
      new Date() < guestUser.expiresAt
    ) {
      req.user = { userID: guestUser._id, role: guestUser.role };
      return next();
    }
  }
  if (!token) {
    req.user = { role: 'guestUser' }; // Keep it simple; permissions will be derived from the role
    console.log('No token and no valid guestUserID.');
    return next();
  }
  try {
    const decoded = verifyJWT(token);
    req.user = { userID: decoded.userID, role: decoded.role };
    next();
  } catch (error) {
    console.log('Authentication error:', error.message);
    throw new UnauthenticatedError('Authentication invalid');
  }
}; //end authenticateUser

/**
 * AUTHORIZED PERMISSIONS
 * @param {*} requiredPermission
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const authorizedPermissions = (requiredPermission) => {
  return (req, res, next) => {
    // Default to an empty object if req.user is undefined
    const userRole = req.user ? req.user.role : 'guestUser';
    const userPermissions = rolePermissions[userRole] || [];
    if (!userPermissions.includes(requiredPermission)) {
      throw new UnauthorizedError('Please Create Account To Use This Feature.');
    }
    next();
  };
};
/**
 * AUTHORIZED ADMIN
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const authorizedAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    throw new UnauthorizedError('Unauthorized Access');
  }
  next();
};