import { SocialProvider, PostContent, PostResult } from '../types';

export class LinkedInProvider implements SocialProvider {
  name = 'LINKEDIN';

  async connectAccount(oauthCode: string) {
    // TODO: Implement LinkedIn OAuth 2.0 flow
    return { accessToken: `mock_li_token_${oauthCode}`, accountId: 'li_account_1' };
  }

  validatePost(content: PostContent) {
    const errors: string[] = [];
    if (content.text.length > 3000) errors.push('Text exceeds LinkedIn 3000 character limit');
    return { valid: errors.length === 0, errors };
  }

  async publishPost(accountId: string, content: PostContent): Promise<PostResult> {
    console.log(`[LinkedIn] Publishing to ${accountId}:`, content);
    // TODO: Call LinkedIn UGC API
    return { success: true, providerPostId: `li_post_${Date.now()}` };
  }

  async getAnalytics(accountId: string, providerPostId: string) {
    return { likes: Math.floor(Math.random() * 50), shares: Math.floor(Math.random() * 5) };
  }
}
