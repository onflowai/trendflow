import jwt from 'jsonwebtoken';
/**
 * User ID will be used to get all the resources about the user
 */
export const createJWT = (payload, expiresIn) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn }); //creating the token with payload where we pass user id + role (user id can provide everything)
  //return token; //the return of the function which will be encoded
};

export const verifyJWT = (token) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  return jwt.verify(token, JWT_SECRET);
}; //verifying the token (jwt looks for token and the string which was used for generation)
