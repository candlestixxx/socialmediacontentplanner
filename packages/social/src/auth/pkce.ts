import crypto from 'crypto';

export function generatePKCE() {
  const codeVerifier = crypto.randomBytes(32).toString('base64url');

  const codeChallenge = crypto
    .createHash('sha256')
    .update(codeVerifier)
    .digest('base64url');

  const state = crypto.randomBytes(16).toString('hex');

  return { codeVerifier, codeChallenge, state };
}
