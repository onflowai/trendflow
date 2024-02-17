import { UnauthenticatedError } from '../errors/customErrors.js';
import { verifyJWT } from '../utils/tokenUtils.js';
/**
 * Creating restricted access to trend routs if the cookies are not present or jwt is not valid
 * If token verified attach the user from jtw to the request which look like: { userID: '65c8ef9bd50a47753d20fe84', role: 'user' }
 * This will be used in all of the controller
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const authenticateUser = (req, res, next) => {
  // console.log('token: ', req.cookies);
  // next();
  const { token } = req.cookies; //accessing the cookies called 'token' generated in authController
  console.log('Token:', token);
  if (!token) throw new UnauthenticatedError('authentication invalid');
  try {
    // const user = verifyJWT(token);
    // console.log(user);
    const { userID, role } = verifyJWT(token); //destructuring user from the token data which has userID and role
    req.user = { userID, role }; //creating new object 'user' with userID and role to pass to a controller
    next(); //next passes to next middleware
  } catch (error) {
    throw new UnauthenticatedError('authentication invalid');
  }
};

export const authorizedPermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new UnauthenticatedError('Unauthorized to access this page');
    }
    console.log(roles);
    next();
  };
};
