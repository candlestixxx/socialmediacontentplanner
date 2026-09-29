import { type AIGenerationRequest, type AIGenerationResponse } from '../../types/api';

/**
 * Calls the backend API server to generate AI content, rather than exposing the OpenAI key on the client.
 */
export const generateAIContent = async (request: AIGenerationRequest): Promise<AIGenerationResponse> => {
  try {
    const token = localStorage.getItem('legacy_auth_token');

    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(request),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to generate content from backend');
    }

    return {
      success: true,
      events: data.events
    };

  } catch (error) {
    console.error("Backend API Error:", error);
    return {
      success: false,
      events: [],
      error: error instanceof Error ? error.message : "An unknown error occurred communicating with the backend."
    };
  }
};
