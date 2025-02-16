import crypto from 'crypto';
/**
 * Generate verification data for a new user.
 * - verificationCode: a 6-digit numeric code.
 * - verificationToken: a random token (e.g. used in the verification link).
 * - verificationExpires: set to 15 minutes from now.
 * @returns verificationCode verificationToken verificationExpires
 */
export const generateVerificationData = () => {
  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString(); // 6-digit code
  const verificationToken = crypto.randomBytes(32).toString('hex');
  const verificationExpires = new Date(Date.now() + 15 * 60 * 1000); // 15-minute expiration

  return { verificationCode, verificationToken, verificationExpires };
};
