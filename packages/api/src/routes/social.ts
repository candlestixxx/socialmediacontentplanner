import { Router } from 'express';
import { generatePKCE } from '@contentcommand/social';

const router = Router();

// In a real application, you would store PKCE states in Redis mapped to user sessions.
const mockStateStore: Record<string, string> = {};

// GET /social/auth-url?provider=twitter
router.get('/auth-url', (req, res) => {
  const provider = req.query.provider as string;
  if (!provider) return res.status(400).json({ error: 'Provider is required' });

  const { codeVerifier, codeChallenge, state } = generatePKCE();
  mockStateStore[state] = codeVerifier; // Save for callback verification

  let authUrl = '';
  const redirectUri = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/social/callback`;

  switch (provider.toLowerCase()) {
    case 'twitter':
      authUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=MOCK_TW_CLIENT_ID&redirect_uri=${redirectUri}&scope=tweet.read%20tweet.write%20users.read%20offline.access&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256`;
      break;
    case 'linkedin':
      // LinkedIn typically uses standard state, but we mock standard OAuth 2 structure here.
      authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=MOCK_LI_CLIENT_ID&redirect_uri=${redirectUri}&state=${state}&scope=w_member_social`;
      break;
    case 'meta':
      authUrl = `https://www.facebook.com/v17.0/dialog/oauth?client_id=MOCK_META_CLIENT_ID&redirect_uri=${redirectUri}&state=${state}`;
      break;
    default:
      return res.status(400).json({ error: 'Unsupported provider' });
  }

  res.json({ authUrl });
});

// GET /social/callback
router.get('/callback', (req, res) => {
  const { code, state, error } = req.query;

  if (error) {
    return res.status(400).json({ error: `OAuth failed: ${error}` });
  }

  if (!state || !mockStateStore[state as string]) {
    return res.status(400).json({ error: 'Invalid or missing state parameter' });
  }

  // Verification step (in a real app, send `code` and `mockStateStore[state]` to the provider's token endpoint)
  console.log(`[OAuth Callback] Received code: ${code} for state: ${state}`);

  // Clean up state
  delete mockStateStore[state as string];

  // Redirect the user back to the web dashboard UI
  const frontendUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  res.redirect(`${frontendUrl}/social-accounts?success=true`);
});

// GET /social/accounts
router.get('/accounts', (req, res) => {
  // Return mocked connected accounts for the dashboard
  res.json([
    { id: 'acc_1', platform: 'TWITTER', accountName: '@MockBrand', status: 'CONNECTED' },
    { id: 'acc_2', platform: 'LINKEDIN', accountName: 'Mock Company Page', status: 'EXPIRED' }
  ]);
});

export const socialRouter = router;
