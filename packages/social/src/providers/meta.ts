import { SocialProvider, PostContent, PostResult } from '../types';

export class MetaProvider implements SocialProvider {
  name = 'META';

  async connectAccount(oauthCode: string) {
    // TODO: Implement Facebook Graph API flow
    return { accessToken: `mock_meta_token_${oauthCode}`, accountId: 'meta_account_1' };
  }

  validatePost(content: PostContent) {
    const errors: string[] = [];
    if (content.text.length > 2200) errors.push('Text exceeds Instagram/Facebook limits');
    return { valid: errors.length === 0, errors };
  }

  async publishPost(accountId: string, content: PostContent): Promise<PostResult> {
    console.log(`[Meta] Publishing to ${accountId}:`, content);
    // TODO: Call Graph API for IG/FB
    return { success: true, providerPostId: `meta_post_${Date.now()}` };
  }

  async getAnalytics(accountId: string, providerPostId: string) {
    return { likes: Math.floor(Math.random() * 200), comments: Math.floor(Math.random() * 50) };
  }
}
