export type PostContent = {
  text: string;
  mediaUrls?: string[];
};

export type PostResult = {
  success: boolean;
  providerPostId?: string;
  error?: string;
};

export interface SocialProvider {
  name: string;
  connectAccount(oauthCode: string): Promise<{ accessToken: string; accountId: string }>;
  validatePost(content: PostContent): { valid: boolean; errors: string[] };
  publishPost(accountId: string, content: PostContent): Promise<PostResult>;
  getAnalytics(accountId: string, providerPostId: string): Promise<any>;
}
