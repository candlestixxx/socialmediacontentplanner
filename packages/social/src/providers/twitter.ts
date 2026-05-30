import { SocialProvider, PostContent, PostResult } from '../types';

export class TwitterProvider implements SocialProvider {
  name = 'TWITTER';

  async connectAccount(oauthCode: string) {
    // TODO: Implement Twitter OAuth 2.0 flow
    return { accessToken: `mock_tw_token_${oauthCode}`, accountId: 'tw_account_1' };
  }

  validatePost(content: PostContent) {
    const errors: string[] = [];
    if (content.text.length > 280) errors.push('Text exceeds 280 characters');
    if (content.mediaUrls && content.mediaUrls.length > 4) errors.push('Maximum 4 media items allowed');
    return { valid: errors.length === 0, errors };
  }

  async publishPost(accountId: string, content: PostContent): Promise<PostResult> {
    console.log(`[Twitter] Publishing to ${accountId}:`, content);
    // TODO: Call Twitter v2 API
    return { success: true, providerPostId: `tw_post_${Date.now()}` };
  }

  async getAnalytics(accountId: string, providerPostId: string) {
    return { likes: Math.floor(Math.random() * 100), retweets: Math.floor(Math.random() * 20) };
  }
}
