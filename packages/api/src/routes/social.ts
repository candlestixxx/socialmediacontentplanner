import { Router } from 'express';
import { generatePKCE } from '@contentcommand/social';
import { prisma } from '@contentcommand/database';

const router = Router();

// PKCE state → codeVerifier store. In-memory is fine for a single instance;
// use Redis for multi-instance deployments (see middleware/auth.ts for the
// shared Redis pattern).
const pkceStateStore: Record<string, string> = {};

// Real OAuth client credentials come from the environment per provider.
const OAUTH_CLIENTS: Record<string, { clientId?: string; clientSecret?: string; tokenUrl: string; scope: string }> = {
  twitter: {
    clientId: process.env.TWITTER_CLIENT_ID,
    clientSecret: process.env.TWITTER_CLIENT_SECRET,
    tokenUrl: 'https://api.twitter.com/2/oauth2/token',
    scope: 'tweet.read tweet.write users.read offline.access',
  },
  linkedin: {
    clientId: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
    scope: 'w_member_social',
  },
  meta: {
    clientId: process.env.META_CLIENT_ID,
    clientSecret: process.env.META_CLIENT_SECRET,
    tokenUrl: 'https://graph.facebook.com/v19.0/oauth/access_token',
    scope: 'pages_manage_posts,pages_read_engagement',
  },
};

// GET /social/auth-url?provider=twitter&workspaceId=...
router.get('/auth-url', (req, res) => {
  const provider = String(req.query['provider'] || '').toLowerCase();
  const workspaceId = String(req.query['workspaceId'] || '');
  if (!provider) return res.status(400).json({ error: 'Provider is required' });
  if (!workspaceId) return res.status(400).json({ error: 'workspaceId is required' });

  const cfg = OAUTH_CLIENTS[provider];
  if (!cfg) return res.status(400).json({ error: 'Unsupported provider' });
  if (!cfg.clientId) {
    return res.status(503).json({
      error: `OAuth unavailable: ${provider.toUpperCase()}_CLIENT_ID is not configured.`,
    });
  }

  const { codeVerifier, codeChallenge, state } = generatePKCE();
  pkceStateStore[state] = codeVerifier;

  const redirectUri = `${process.env['NEXT_PUBLIC_API_URL'] || 'http://localhost:3001'}/social/callback`;

  const base = provider === 'twitter'
    ? 'https://twitter.com/i/oauth2/authorize'
    : provider === 'linkedin'
    ? 'https://www.linkedin.com/oauth/v2/authorization'
    : 'https://www.facebook.com/v17.0/dialog/oauth';

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: cfg.clientId,
    redirect_uri: redirectUri,
    scope: cfg.scope,
    state: `${state}:${workspaceId}`,
  });
  if (provider === 'twitter') {
    params.set('code_challenge', codeChallenge);
    params.set('code_challenge_method', 'S256');
  }

  return res.json({ authUrl: `${base}?${params.toString()}` });
});

// GET /social/callback — real authorization-code → token exchange
router.get('/callback', async (req, res) => {
  const { code, state, error } = req.query;

  if (error) {
    return res.status(400).json({ error: `OAuth failed: ${error}` });
  }

  const [rawState, workspaceId] = String(state || '').split(':');
  const codeVerifier = rawState ? pkceStateStore[rawState] : undefined;
  if (!rawState || !codeVerifier) {
    return res.status(400).json({ error: 'Invalid or missing state parameter' });
  }
  if (!workspaceId) {
    return res.status(400).json({ error: 'Missing workspaceId in OAuth state' });
  }

  // Provider is inferred from the code exchange attempt order is not needed —
  // the client sends it along; accept it via query with fallback lookup.
  const provider = String(req.query['provider'] || '').toLowerCase();
  const cfg = OAUTH_CLIENTS[provider];
  if (!cfg?.clientId || !cfg.clientSecret) {
    return res.status(503).json({ error: `OAuth not configured for provider: ${provider || 'unknown'}` });
  }

  try {
    const redirectUri = `${process.env['NEXT_PUBLIC_API_URL'] || 'http://localhost:3001'}/social/callback`;
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code: String(code),
      redirect_uri: redirectUri,
      client_id: cfg.clientId,
      ...(provider === 'twitter' ? { code_verifier: codeVerifier } : {}),
    });

    const tokenResp = await fetch(cfg.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + Buffer.from(`${cfg.clientId}:${cfg.clientSecret}`).toString('base64'),
      },
      body,
      signal: AbortSignal.timeout(20000),
    });

    if (!tokenResp.ok) {
      const text = await tokenResp.text();
      return res.status(502).json({ error: `Token exchange failed (${tokenResp.status}): ${text.slice(0, 200)}` });
    }

    const token = await tokenResp.json();
    const accessToken = token.access_token;
    if (!accessToken) {
      return res.status(502).json({ error: 'Token exchange returned no access_token' });
    }

    // Persist the connected account in the real SocialAccount table.
    const accountName = token.screen_name || token.name || `${provider}-account`;
    await prisma.socialAccount.upsert({
      where: { id: `${workspaceId}:${provider}:${accountName}` },
      create: { workspaceId, platform: provider.toUpperCase() as any, accountName, accessToken },
      update: { accessToken },
    });

    delete pkceStateStore[rawState];

    const frontendUrl = process.env['NEXT_PUBLIC_APP_URL'] || 'http://localhost:3000';
    return res.redirect(`${frontendUrl}/social-accounts?success=true`);
  } catch (e: any) {
    console.error('[OAuth Callback] token exchange error:', e);
    return res.status(502).json({ error: 'Token exchange failed.' });
  }
});

// GET /social/accounts?workspaceId=... — real persisted accounts
router.get('/accounts', async (req, res) => {
  try {
    const workspaceId = String(req.query['workspaceId'] || '');
    if (!workspaceId) return res.status(400).json({ error: 'workspaceId is required' });

    const accounts = await prisma.socialAccount.findMany({
      where: { workspaceId },
      orderBy: { createdAt: 'desc' },
    });
    // Never expose access tokens in list responses.
    return res.json(
      accounts.map((a) => ({
        id: a.id,
        platform: a.platform,
        accountName: a.accountName,
        status: a.accessToken ? 'CONNECTED' : 'EXPIRED',
      }))
    );
  } catch (e: any) {
    console.error('[Social] accounts list failed:', e);
    return res.status(500).json({ error: 'Failed to list social accounts.' });
  }
});

export const socialRouter = router;
