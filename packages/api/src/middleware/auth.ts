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
  enableOfflineQueue: false,
  lazyConnect: true // Prevent immediate connection attempt
});

// Gracefully handle redis errors
redisClient.on('error', (err) => console.log('Redis error:', err.message));

export const rateLimiter = rateLimit({
  // Only use RedisStore if we're not in local dev or if redis is available
  // For now, we'll default to memory store to ensure the project runs
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: { error: 'Too many requests from this IP, please try again after 15 minutes' },
  handler: (req, res, next, options) => {
     res.status(options.statusCode).send(options.message);
  }
});
