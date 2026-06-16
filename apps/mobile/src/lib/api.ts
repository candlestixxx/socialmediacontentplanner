import { Platform } from 'react-native';

// For Android Emulators pointing to localhost, we must use 10.0.2.2. iOS simulators use localhost.
const DEFAULT_API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3001' : 'http://localhost:3001';

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || DEFAULT_API_URL;

export const apiClient = {
  get: async (endpoint: string, options?: RequestInit) => {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    if (!res.ok) throw new Error(`API GET Error: ${res.statusText}`);
    return res.json();
  },

  post: async (endpoint: string, data: any, options?: RequestInit) => {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`API POST Error: ${res.statusText}`);
    return res.json();
  }
};
