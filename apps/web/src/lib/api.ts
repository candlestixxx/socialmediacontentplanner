export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

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
  },

  patch: async (endpoint: string, data?: any, options?: RequestInit) => {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    });
    if (!res.ok) throw new Error(`API PATCH Error: ${res.statusText}`);
    return res.json();
  },

  delete: async (endpoint: string, options?: RequestInit) => {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    if (!res.ok) throw new Error(`API DELETE Error: ${res.statusText}`);
    return res.json();
  },
};
