import { SocialProvider, PostContent, PostResult } from '../types';

/**
 * LinkedIn provider — UGC Post API + OAuth 2.0.
 *
 * Env vars (set in .env or dashboard settings):
 *   LINKEDIN_CLIENT_ID      OAuth 2.0 client ID
 *   LINKEDIN_CLIENT_SECRET  OAuth 2.0 client secret
 *   LINKEDIN_ACCESS_TOKEN   Pre-authorized member token (optional shortcut)
 *
 * When credentials are absent the provider falls back to mock responses
 * so the dashboard stays functional in development. Mock responses carry
 * `providerPostId` prefixed with `mock_` so downstream code can detect them.
 */
export class LinkedInProvider implements SocialProvider {
  name = 'LINKEDIN';

  private get clientId() { return process.env['LINKEDIN_CLIENT_ID']; }
  private get clientSecret() { return process.env['LINKEDIN_CLIENT_SECRET']; }
  private get accessToken() { return process.env['LINKEDIN_ACCESS_TOKEN']; }

  private get configured(): boolean {
    return !!(this.accessToken || (this.clientId && this.clientSecret));
  }

  async connectAccount(oauthCode: string) {
    // OAuth 2.0 authorization-code exchange
    if (!this.clientId || !this.clientSecret) {
      // Dev fallback: no app registered yet.
      return { accessToken: `mock_li_token_${oauthCode}`, accountId: 'li_account_1' };
    }
    const res = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: oauthCode,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: process.env['LINKEDIN_REDIRECT_URI'] ?? 'http://localhost:3003/api/social/callback',
      }),
    });
    if (!res.ok) throw new Error(`LinkedIn OAuth failed: ${res.status} ${await res.text()}`);
    const json = await res.json();
    // Fetch the member's URN to use as the account identifier.
    const me = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: { Authorization: `Bearer ${json.access_token}` },
    });
    const profile = me.ok ? await me.json() : { sub: 'li_account_1' };
    return { accessToken: json.access_token, accountId: profile.sub ?? 'li_account_1' };
  }

  validatePost(content: PostContent) {
    const errors: string[] = [];
    if (content.text.length > 3000) errors.push('Text exceeds LinkedIn 3000 character limit');
    return { valid: errors.length === 0, errors };
  }

  async publishPost(accountId: string, content: PostContent): Promise<PostResult> {
    if (!this.configured) {
      console.log(`[LinkedIn] Publishing to ${accountId}:`, content);
      return { success: true, providerPostId: `mock_li_post_${Date.now()}` };
    }

    try {
      // UGC Post API — shares text (and optional article links) to the feed.
      const res = await fetch('https://api.linkedin.com/v2/ugcPosts', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0',
        },
        body: JSON.stringify({
          author: `urn:li:person:${accountId}`,
          lifecycleState: 'PUBLISHED',
          specificContent: {
            'com.linkedin.ugc.ShareContent': {
              shareCommentary: { text: content.text },
              shareMediaCategory: content.mediaUrls?.length ? 'IMAGE' : 'NONE',
              ...(content.mediaUrls?.length && {
                media: content.mediaUrls.map((url) => ({
                  status: 'READY',
                  originalUrl: url,
                })),
              }),
            },
          },
          visibility: {
            'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
          },
        }),
      });
      if (!res.ok) return { success: false, error: `LinkedIn API ${res.status}: ${await res.text()}` };
      const json = await res.json();
      return { success: true, providerPostId: json.id };
    } catch (e) {
      return { success: false, error: e instanceof Error ? e.message : 'LinkedIn publish failed' };
    }
  }

  async getAnalytics(_accountId: string, providerPostId: string) {
    if (!this.configured || providerPostId.startsWith('mock_')) {
      // Development fallback — deterministic values so dashboards don't flicker.
      return { likes: 12, shares: 2, comments: 3, impressions: 145 };
    }
    // Social Actions API returns aggregate engagement for a share/UGC post.
    const res = await fetch(
      `https://api.linkedin.com/v2/socialActions/${encodeURIComponent(providerPostId)}`,
      { headers: { Authorization: `Bearer ${this.accessToken}` } },
    );
    if (!res.ok) return { likes: 0, shares: 0, comments: 0, impressions: 0 };
    const json = await res.json();
    return {
      likes: json.likesSummary?.totalLikes ?? 0,
      shares: json.sharesSummary?.totalShares ?? 0,
      comments: json.commentsSummary?.totalComments ?? 0,
      impressions: json.impressions ?? 0,
    };
  }
}
