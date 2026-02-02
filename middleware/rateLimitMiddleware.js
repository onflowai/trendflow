import Redis from 'ioredis';
import { RateLimiterRedis, RateLimiterMemory } from 'rate-limiter-flexible';
import { StatusCodes } from 'http-status-codes';

/**
 * Role based rate limiting for the trendSubmit controller
 * user: 2 submissions per hour block 15 minutes after exceeding, smooth out bursts / boundary spam and minimum spacing between allowed requests
 * admin: 50 submissions per day block 30 minutes after exceeding smooth out bursts / boundary spam
 */
const redisUrl = process.env.REDIS_URL;

let limiterUserSubmit;
let limiterAdminSubmit;

if (redisUrl) {
  const redisClient = new Redis(redisUrl, {
    enableOfflineQueue: false,
    maxRetriesPerRequest: 1,
    lazyConnect: true,
  });

  limiterUserSubmit = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'rl:submit:user',
    points: 2,
    duration: 60 * 60,
    blockDuration: 60 * 15,
    execEvenly: true,
    execEvenlyMinDelayMs: 800,
  });//2 submissions per hour block 15 minutes after exceeding

  limiterAdminSubmit = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'rl:submit:admin',
    points: 50,
    duration: 60 * 60 * 24,
    blockDuration: 60 * 30, 
    execEvenly: true,
    execEvenlyMinDelayMs: 250,
  });//50 submissions per day block 30 minutes after exceeding smooth out bursts / boundary spam
} else {
  limiterUserSubmit = new RateLimiterMemory({
    keyPrefix: 'rl:submit:user',
    points: 2,
    duration: 60 * 60,
    blockDuration: 60 * 15,
  });//dev fallback ONLY (not good for multiple instances)
  limiterAdminSubmit = new RateLimiterMemory({
    keyPrefix: 'rl:submit:admin',
    points: 50,
    duration: 60 * 60 * 24,
    blockDuration: 60 * 30,
  });
}

const getLimiterKey = (req) => {
  if (req.user?.userID) return String(req.user.userID);

  // Fallback: IP (shouldn’t happen because authenticateUser runs before this)
  const xff = req.headers['x-forwarded-for'];
  const ip = Array.isArray(xff)
    ? xff[0]
    : (xff ? String(xff).split(',')[0].trim() : req.ip);

  return ip || 'unknown';
};// primary: userID prevents IP rotation bypass

export const rateLimitSubmitTrend = async (req, res, next) => {
  const role = req.user?.role === 'admin' ? 'admin' : 'user'; //determines which limiter
  const key = getLimiterKey(req);

  const limiter = role === 'admin' ? limiterAdminSubmit : limiterUserSubmit;

  try {
    await limiter.consume(key, 1);

    // Optional headers for debugging/UI
    // const state = await limiter.get(key);
    // if (state) res.set('X-RateLimit-Remaining', String(state.remainingPoints));

    return next();
  } catch (rejRes) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil(((rejRes?.msBeforeNext ?? 1000) / 1000))
    );

    res.set('Retry-After', String(retryAfterSeconds));

    return res.status(StatusCodes.TOO_MANY_REQUESTS).json({
      msg: 'Too many trend submissions. Slow down.',
      role,
      limit: role === 'admin' ? '50/day' : '2/hour',
      retryAfterSeconds,
    });
  }
};
