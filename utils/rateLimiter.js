import rateLimit from 'express-rate-limit';
/**
 * CALL rate limiter
 */
export const githubLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    msg: 'Please try again after 15 minutes.',
  },
});

export const guestLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit to 5 requests per windowMs
  message:
    'Too many guest login attempts from this IP, please try again later.',
});
