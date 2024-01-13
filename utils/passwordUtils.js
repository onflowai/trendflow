import bcrypt from 'bcryptjs';

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10); //creating random hash string
  const hashedPassword = await bcrypt.hash(password, salt); //adding the string to the password store it in hashedPassword
  return hashedPassword;
};

export const authenticatePassword = async (password, hashedPassword) => {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
};
