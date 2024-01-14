import { UnauthenticatedError } from '../errors/customErrors.js';

export const authenticateUser = async (req, res, next) => {
  // console.log(req.cookies);
  const { token } = req.cookies; //accessing the cookies called 'token' generated in authController
  if (!token) throw new UnauthenticatedError('authentication invalid');
  next(); //next passes to next middleware
};
