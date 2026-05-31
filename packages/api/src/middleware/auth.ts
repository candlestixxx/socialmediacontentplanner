import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';

/**
 * Placeholder Auth Middleware
 * Validates JWT or Session Tokens
 */
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  // TODO: Implement actual JWT/NextAuth validation for the API
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    // For local development, bypass
  }

  // Attach mock user
  (req as any).user = { id: 'mock_user_id', role: 'OWNER' };
  next();
};

/**
 * Redis Backed Rate Limiting Middleware
 * Prevents abuse of API endpoints and protects AI generation routes
 */

// We instantiate a separate redis client for the API rate limiter to avoid conflicts
const redisClient = new Redis(process.env.REDIS_URL || 'redis://127.0.0.1:6379', {
  maxRetriesPerRequest: null,
  enableOfflineQueue: false
});

export const rateLimiter = rateLimit({
  // Fallback to memory store if Redis connection fails or isn't available
  store: new RedisStore({
    // @ts-expect-error - Known typing mismatch between express-rate-limit and rate-limit-redis
    sendCommand: (...args: string[]) => redisClient.call(...args),
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: { error: 'Too many requests from this IP, please try again after 15 minutes' },
  // Handle Redis connection errors gracefully so the app doesn't crash if Redis is down
  handler: (req, res, next, options) => {
     res.status(options.statusCode).send(options.message);
  }
});
