export type SocialPlatform = 'facebook' | 'instagram' | 'linkedin' | 'twitter';

export interface OAuthConnectionState {
  facebook: boolean;
  instagram: boolean;
  linkedin: boolean;
  twitter: boolean;
}

const TOKEN_KEY = 'legacy_auth_token';

const getHeaders = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const oauthService = {
  /**
   * Fetches the current connection status from the backend.
   */
  getConnections: async (): Promise<OAuthConnectionState> => {
    try {
      const response = await fetch('/api/oauth/status', {
        headers: getHeaders()
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (e) {
      console.error("Failed to fetch oauth connections", e);
      return {
        facebook: false,
        instagram: false,
        linkedin: false,
        twitter: false
      };
    }
  },

  /**
   * Initiates the OAuth connection flow via backend.
   */
  connectPlatform: async (platform: SocialPlatform): Promise<boolean> => {
    try {
      const response = await fetch('/api/oauth/connect', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ platform })
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data.connected;
    } catch (e) {
      console.error("Failed to connect platform", e);
      return false;
    }
  },

  /**
   * Disconnects a platform via backend.
   */
  disconnectPlatform: async (platform: SocialPlatform): Promise<boolean> => {
    try {
      const response = await fetch('/api/oauth/disconnect', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ platform })
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      // data.connected should be false after disconnect
      return !data.connected;
    } catch (e) {
      console.error("Failed to disconnect platform", e);
      return false;
    }
  }
};