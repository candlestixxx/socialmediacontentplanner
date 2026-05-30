import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIProvider } from './types';

export class GeminiProvider implements AIProvider {
  name = 'GEMINI';
  private client: GoogleGenerativeAI | null = null;

  constructor(apiKey?: string) {
    const key = apiKey || process.env.GEMINI_API_KEY;
    if (key) {
      this.client = new GoogleGenerativeAI(key);
    }
  }

  async generate(prompt: string, systemPrompt?: string): Promise<string> {
    if (!this.client) {
      console.warn('[GeminiProvider] No API key found. Returning mock response.');
      return Promise.resolve(`Mocked Gemini generation for: ${prompt}`);
    }

    try {
      // For Gemini, we typically use the system instruction inside the model configuration
      const modelConfig: any = { model: 'gemini-1.5-flash' };
      if (systemPrompt) {
        modelConfig.systemInstruction = systemPrompt;
      }

      const model = this.client.getGenerativeModel(modelConfig);

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('[GeminiProvider] Error generating response:', error);
      throw error;
    }
  }
}
