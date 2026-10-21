import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import Redis from 'ioredis';
import { createHmac, timingSafeEqual } from 'node:crypto';

/**
 * Dependency-free HS256 JWT verification (node:crypto) so the API needs no
 * extra packages. Only HS256 is accepted — callers using RS256 should verify
 * at the gateway or extend this with a JWKS lookup.
 */
function verifyHS256(token: string, secret: string): Record<string, unknown> | null {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [headerB64, payloadB64, sigB64] = parts;

  try {
    const header = JSON.parse(Buffer.from(headerB64, 'base64url').toString('utf8'));
    if (header.alg !== 'HS256') return null;

    const expected = createHmac('sha256', secret).update(`${headerB64}.${payloadB64}`).digest();
    const actual = Buffer.from(sigB64, 'base64url');
    if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;

    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
    if (typeof payload.exp === 'number' && payload.exp * 1000 < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

/**
 * Auth Middleware — validates Bearer JWTs and attaches the real user.
 *
 * Why: the previous implementation attached a hardcoded
 * { id: 'mock_user_id', role: 'OWNER' } to EVERY request regardless of
 * credentials — any caller had full-owner access. Now every request must
 * present a valid JWT signed with AUTH_JWT_SECRET (or the NextAuth secret).
 */
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined;

  if (!token) {
    return res.status(401).json({ error: 'Missing Authorization Bearer token.' });
  }

  const secret = process.env.AUTH_JWT_SECRET || process.env.NEXTAUTH_SECRET;
  if (!secret) {
    return res.status(503).json({ error: 'Auth unavailable: AUTH_JWT_SECRET (or NEXTAUTH_SECRET) is not configured.' });
  }

  const payload = verifyHS256(token, secret);
  if (!payload) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
  const subject = (payload.sub ?? payload.id) as string | undefined;
  if (!subject) {
    return res.status(401).json({ error: 'Token missing subject claim.' });
  }
  (req as any).user = {
    id: String(subject),
    role: typeof payload.role === 'string' ? payload.role : 'MEMBER',
  };
  return next();
};

/**
 * Redis Backed Rate Limiting Middleware
 * Prevents abuse of API endpoints and protects AI generation routes
 */

// We instantiate a separate redis client for the API rate limiter to avoid conflicts
const redisClient = new Redis(process.env['REDIS_URL'] || 'redis://127.0.0.1:6379', {
  maxRetriesPerRequest: null,
  enableOfflineQueue: false,
  lazyConnect: true // Prevent immediate connection attempt
});

// Gracefully handle redis errors
redisClient.on('error', (err: Error) => console.log('Redis error:', err.message));

export const rateLimiter = rateLimit({
  // Only use RedisStore if we're not in local dev or if redis is available
  // For now, we'll default to memory store to ensure the project runs
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: { error: 'Too many requests from this IP, please try again after 15 minutes' },
  handler: (_req, res, _next, options) => {
     return res.status(options.statusCode).send(options.message);
  }
});
