import { UnauthenticatedError } from '../errors/customErrors.js';
import { verifyJWT } from '../utils/tokenUtils.js';
/**
 * Creating restricted access to trend routs if the cookies are not present or jwt is not valid
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const authenticateUser = async (req, res, next) => {
  // console.log(req.cookies);
  const { token } = req.cookies; //accessing the cookies called 'token' generated in authController
  if (!token) throw new UnauthenticatedError('authentication invalid');
  try {
    const { userID, role } = verifyJWT(token); //destructuring the token data which has userID and role
    req.user = { userID, role }; //creating new object 'user' with userID and role to pass to a controller
    next(); //next passes to next middleware
  } catch (error) {
    throw new UnauthenticatedError('authentication invalid');
  }
};
