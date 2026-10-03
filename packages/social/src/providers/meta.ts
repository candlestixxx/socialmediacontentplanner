import { SocialProvider, PostContent, PostResult } from '../types';

/**
 * Meta provider — Facebook Graph API + Instagram Graph API.
 *
 * Env vars:
 *   META_ACCESS_TOKEN      Long-lived Page or User access token
 *   META_PAGE_ID           Facebook Page ID (for /{page-id}/feed)
 *   META_IG_USER_ID        Instagram Business Account ID (for IG posts)
 *
 * Mock fallback when credentials are absent (providerPostId starts with `mock_`).
 */
export class MetaProvider implements SocialProvider {
  name = 'META';

  private get accessToken() { return process.env['META_ACCESS_TOKEN']; }
  private get pageId() { return process.env['META_PAGE_ID']; }
  private get igUserId() { return process.env['META_IG_USER_ID']; }

  private get configured(): boolean {
    return !!this.accessToken && (!!this.pageId || !!this.igUserId);
  }

  async connectAccount(oauthCode: string) {
    // Facebook Login OAuth 2.0 — exchange code for a short-lived token,
    // then exchange for a long-lived token.
    const appId = process.env['META_APP_ID'];
    const appSecret = process.env['META_APP_SECRET'];
    if (!appId || !appSecret) {
      return { accessToken: `mock_meta_token_${oauthCode}`, accountId: 'meta_account_1' };
    }
    // Exchange authorization code for a short-lived token.
    const tokenRes = await fetch(
      `https://graph.facebook.com/v18.0/oauth/access_token?client_id=${appId}&redirect_uri=${encodeURIComponent(process.env['META_REDIRECT_URI'] ?? 'http://localhost:3003/api/social/callback')}&client_secret=${appSecret}&code=${oauthCode}`,
    );
    if (!tokenRes.ok) throw new Error(`Meta OAuth failed: ${tokenRes.status} ${await tokenRes.text()}`);
    const shortLived = await tokenRes.json();
    // Exchange for long-lived token (60 days).
    const longRes = await fetch(
      `https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${shortLived.access_token}`,
    );
    const longLived = longRes.ok ? await longRes.json() : shortLived;
    return { accessToken: longLived.access_token, accountId: this.pageId ?? 'meta_account_1' };
  }

  validatePost(content: PostContent) {
    const errors: string[] = [];
    if (content.text.length > 2200) errors.push('Text exceeds Instagram/Facebook limits');
    return { valid: errors.length === 0, errors };
  }

  async publishPost(accountId: string, content: PostContent): Promise<PostResult> {
    if (!this.configured) {
      console.log(`[Meta] Publishing to ${accountId}:`, content);
      return { success: true, providerPostId: `mock_meta_post_${Date.now()}` };
    }

    try {
      // Facebook Page feed post — text + optional link.
      if (this.pageId) {
        const res = await fetch(`https://graph.facebook.com/v18.0/${this.pageId}/feed`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: content.text,
            ...(content.mediaUrls?.length && { link: content.mediaUrls[0] }),
            access_token: this.accessToken,
          }),
        });
        if (!res.ok) return { success: false, error: `Facebook API ${res.status}: ${await res.text()}` };
        const json = await res.json();
        return { success: true, providerPostId: json.id };
      }

      // Instagram Business — two-step: create media container, then publish.
      if (this.igUserId) {
        const containerRes = await fetch(`https://graph.facebook.com/v18.0/${this.igUserId}/media`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            caption: content.text,
            ...(content.mediaUrls?.length && { image_url: content.mediaUrls[0] }),
            access_token: this.accessToken,
          }),
        });
        if (!containerRes.ok) return { success: false, error: `IG container ${containerRes.status}: ${await containerRes.text()}` };
        const container = await containerRes.json();

        const publishRes = await fetch(`https://graph.facebook.com/v18.0/${this.igUserId}/media_publish`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ creation_id: container.id, access_token: this.accessToken }),
        });
        if (!publishRes.ok) return { success: false, error: `IG publish ${publishRes.status}: ${await publishRes.text()}` };
        const published = await publishRes.json();
        return { success: true, providerPostId: published.id };
      }

      return { success: false, error: 'No META_PAGE_ID or META_IG_USER_ID configured' };
    } catch (e) {
      return { success: false, error: e instanceof Error ? e.message : 'Meta publish failed' };
    }
  }

  async getAnalytics(_accountId: string, providerPostId: string) {
    if (!this.configured || providerPostId.startsWith('mock_')) {
      return { likes: 48, comments: 7, shares: 3, reach: 520 };
    }
    // Post insights — engagement metrics.
    const res = await fetch(
      `https://graph.facebook.com/v18.0/${providerPostId}/insights?metric=post_impressions,post_engaged_users&access_token=${this.accessToken}`,
    );
    if (!res.ok) return { likes: 0, comments: 0, shares: 0, reach: 0 };
    const json = await res.json();
    const metrics: Record<string, number> = {};
    for (const item of json.data ?? []) {
      metrics[item.name] = item.values?.[0]?.value ?? 0;
    }
    return {
      likes: metrics['post_engaged_users'] ?? 0,
      comments: 0, // Requires post_comments metric separately
      shares: 0,   // Requires post_shares metric separately
      reach: metrics['post_impressions'] ?? 0,
    };
  }
}
