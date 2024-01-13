import jwt from 'jsonwebtoken';
/**
 * User ID will be used to get all the resources about the user
 */

export const createJWT = (payload) => {
  const token = jwt.sign(payload, 'secret', {
    expiresIn: '1d',
  });
  return token;
};
