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
  const { token } = req.cookies;
  if (!token) {
    req.user = { role: 'guestUser' }; // Keep it simple; permissions will be derived from the role
    return next();
  }
  try {
    const decoded = verifyJWT(token); // verifying and decode token
    const { userID, role } = decoded; // destructuring decoded token

    let user;

    if (role === 'guestUser') {
      user = await UserModel.findById(userID); //fetch guest user from UserModel
      if (!user) {
        req.user = { role: 'guestUser' }; //fallback to guestUser role if not found
        return next();
      }
      req.user = { userID: user._id, role: user.role }; //attach guest user info
    } else {
      user = await UserModel.findById(userID); //fetch user from UserModel
      if (!user) throw new UnauthenticatedError('Authentication invalid'); //handling invalid user
      req.user = { userID: user._id, role: user.role }; // Attach user info
    }
    next();
  } catch (error) {
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

// export const authenticateUser = (req, res, next) => {
//   // console.log('token: ', req.cookies);
//   // next();
//   const { token } = req.cookies; //accessing the cookies called 'token' generated in authController
//   console.log('Token:', token);
//   if (!token) throw new UnauthenticatedError('authentication invalid');
//   try {
//     // const user = verifyJWT(token);
//     // console.log(user);
//     const { userID, role } = verifyJWT(token); //destructuring user from the token data which has userID and role
//     const testUser = userID === '65f1116e6acee7cf85c0cc87'; //manually passing the testUser id from mongo
//     req.user = { userID, role, testUser }; //creating new object 'user' with userID and role to pass to a controller
//     next(); //next passes to next middleware
//   } catch (error) {
//     throw new UnauthenticatedError('authentication invalid');
//   }
// };
// //
// export const authorizedRole = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//       throw new UnauthorizedError('Unauthorized to access this page');
//     }
//     next();
//   };
// };
// //this only throws bad request if testUser is trying to access the route with this middleware
// export const testUserUnauthorized = (req, res, next) => {
//   if (req.user.testUser)
//     throw new BadRequestError(
//       'trendFlow test user, create account for full features.'
//     );
//   next();
// };
