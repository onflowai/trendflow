import jwt from 'jsonwebtoken';
/**
 * User ID will be used to get all the resources about the user
 */

export const createJWT = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  }); //creating the token with payload where we pass user id + role (user id can provide everything)
  return token; //the return of the function which will be encoded
};

export const verifyJWT = (token) => {
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  return decodedToken; //verifying the token (jwt looks for token and the string which was used for generation)
};
