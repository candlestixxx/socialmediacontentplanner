import { SocialProvider, PostContent, PostResult } from '../types';

/**
 * Twitter/X provider — v2 API (Tweets + OAuth 2.0).
 *
 * Env vars:
 *   TWITTER_CLIENT_ID       OAuth 2.0 client ID
 *   TWITTER_CLIENT_SECRET   OAuth 2.0 client secret
 *   TWITTER_ACCESS_TOKEN    Pre-authorized bearer (optional shortcut)
 *   TWITTER_API_KEY         Consumer key (for v1.1 media upload)
 *   TWITTER_API_SECRET      Consumer secret
 *
 * Mock fallback when credentials are absent (providerPostId starts with `mock_`).
 */
export class TwitterProvider implements SocialProvider {
  name = 'TWITTER';

  private get clientId() { return process.env['TWITTER_CLIENT_ID']; }
  private get clientSecret() { return process.env['TWITTER_CLIENT_SECRET']; }
  private get accessToken() { return process.env['TWITTER_ACCESS_TOKEN']; }

  private get configured(): boolean {
    return !!(this.accessToken || (this.clientId && this.clientSecret));
  }

  async connectAccount(oauthCode: string) {
    if (!this.clientId || !this.clientSecret) {
      return { accessToken: `mock_tw_token_${oauthCode}`, accountId: 'tw_account_1' };
    }
    const basic = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
    const res = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: oauthCode,
        redirect_uri: process.env['TWITTER_REDIRECT_URI'] ?? 'http://localhost:3003/api/social/callback',
        code_verifier: 'challenge', // PKCE — must match the /authorize call
      }),
    });
    if (!res.ok) throw new Error(`Twitter OAuth failed: ${res.status} ${await res.text()}`);
    const json = await res.json();
    return { accessToken: json.access_token, accountId: json.access_token ?? 'tw_account_1' };
  }

  validatePost(content: PostContent) {
    const errors: string[] = [];
    if (content.text.length > 280) errors.push('Text exceeds 280 characters');
    if (content.mediaUrls && content.mediaUrls.length > 4) errors.push('Maximum 4 media items allowed');
    return { valid: errors.length === 0, errors };
  }

  async publishPost(_accountId: string, content: PostContent): Promise<PostResult> {
    if (!this.configured) {
      console.log(`[Twitter] Publishing to ${_accountId}:`, content);
      return { success: true, providerPostId: `mock_tw_post_${Date.now()}` };
    }

    try {
      // v2 POST /tweets — text-only tweets. Media requires v1.1 upload first.
      const res = await fetch('https://api.twitter.com/2/tweets', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: content.text }),
      });
      if (!res.ok) return { success: false, error: `Twitter API ${res.status}: ${await res.text()}` };
      const json = await res.json();
      return { success: true, providerPostId: json.data?.id };
    } catch (e) {
      return { success: false, error: e instanceof Error ? e.message : 'Twitter publish failed' };
    }
  }

  async getAnalytics(_accountId: string, providerPostId: string) {
    if (!this.configured || providerPostId.startsWith('mock_')) {
      return { likes: 24, retweets: 5, replies: 3, impressions: 310 };
    }
    // tweet.fields=public_metrics returns like/retweet/reply/quote counts.
    const res = await fetch(
      `https://api.twitter.com/2/tweets/${providerPostId}?tweet.fields=public_metrics`,
      { headers: { Authorization: `Bearer ${this.accessToken}` } },
    );
    if (!res.ok) return { likes: 0, retweets: 0, replies: 0, impressions: 0 };
    const json = await res.json();
    const pm = json.data?.public_metrics ?? {};
    return {
      likes: pm.like_count ?? 0,
      retweets: pm.retweet_count ?? 0,
      replies: pm.reply_count ?? 0,
      impressions: pm.impression_count ?? 0,
    };
  }
}
