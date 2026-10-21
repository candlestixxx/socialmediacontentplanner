/**
 * Test auth helpers for contentplanner API route tests.
 *
 * The API now requires a real HS256 Bearer JWT (the old middleware attached
 * a mock owner to every request). These helpers sign valid tokens with the
 * test secret so route tests exercise the full auth → route path.
 */
import { createHmac } from 'node:crypto';

export const TEST_AUTH_SECRET = 'test-secret-for-api-auth';

/** Ensure the API middleware can verify tokens during tests. */
export function setTestAuthEnv() {
  process.env.AUTH_JWT_SECRET = TEST_AUTH_SECRET;
}

function b64url(input: string | Buffer): string {
  return Buffer.from(input).toString('base64url');
}

/** Sign a minimal HS256 JWT for the given user id/role. */
export function signTestToken(userId = 'test-user-1', role = 'OWNER'): string {
  const header = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = b64url(
    JSON.stringify({ sub: userId, role, exp: Math.floor(Date.now() / 1000) + 3600 })
  );
  const sig = createHmac('sha256', TEST_AUTH_SECRET).update(`${header}.${payload}`).digest('base64url');
  return `${header}.${payload}.${sig}`;
}

/** Authorization header map for supertest `.set(...)`. */
export function authHeaders(userId?: string, role?: string): Record<string, string> {
  return { Authorization: `Bearer ${signTestToken(userId, role)}` };
}
