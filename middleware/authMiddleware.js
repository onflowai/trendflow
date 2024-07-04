import {
  UnauthenticatedError,
  UnauthorizedError,
  BadRequestError,
} from '../errors/customErrors.js';
import { verifyJWT } from '../utils/tokenUtils.js';
/**
 * Creating restricted access to trend routs if the cookies are not present or jwt is not valid
 * If token verified attach the user from jtw to the request which look like: { userID: '65c8ef9bd50a47753d20fe84', role: 'user' }
 * This will be used in all of the controller
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const rolePermissions = {
  user: ['read', 'write'],
  admin: ['read', 'write', 'delete'],
  guestUser: ['read'],
};

export const authenticateUser = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    req.user = { role: 'guestUser' }; // Keep it simple; permissions will be derived from the role
    return next();
  }

  try {
    const decoded = verifyJWT(token); // Verify and decode token
    req.user = { userID: decoded.userID, role: decoded.role };
    console.log(`User authenticated with role: ${req.user.role}`); // Debugging
    next();
  } catch (error) {
    console.error('Error in token verification:', error.message); // Debugging
    throw new UnauthenticatedError('Authentication invalid');
  }
};

export const authorizedPermissions = (requiredPermission) => {
  return (req, res, next) => {
    // Default to an empty object if req.user is undefined
    const userRole = req.user ? req.user.role : 'guest';
    const userPermissions = rolePermissions[userRole] || [];
    console.log(
      `Role: ${userRole}, Permissions: ${userPermissions}, Required: ${requiredPermission}`
    ); // Debugging line
    if (!userPermissions.includes(requiredPermission)) {
      throw new UnauthorizedError('Unauthorized to access this resource !!!');
    }
    next();
  };
};
export const authorizedAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    throw new UnauthorizedError(
      'Unauthorized to access this resource, admin only!'
    );
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
