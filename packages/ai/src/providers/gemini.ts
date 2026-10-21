import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIProvider } from './types';

/**
 * Google Gemini provider.
 *
 * No mock fallbacks: methods throw when no key is configured. Structured
 * generation uses Gemini's JSON response mode (responseMimeType +
 * responseSchema).
 */
export class GeminiProvider implements AIProvider {
  name = 'GEMINI';
  private client: GoogleGenerativeAI | null = null;

  constructor(apiKey?: string) {
    const key = apiKey || process.env['GEMINI_API_KEY'];
    if (key) {
      this.client = new GoogleGenerativeAI(key);
    }
  }

  async generate(prompt: string, systemPrompt?: string): Promise<string> {
    if (!this.client) {
      throw new Error('Gemini unavailable: set GEMINI_API_KEY to enable AI generation.');
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

  async generateStructuredResponse<T>(prompt: string, schema: any, systemPrompt?: string): Promise<T> {
    if (!this.client) {
      throw new Error('Gemini unavailable: set GEMINI_API_KEY to enable structured generation.');
    }

    try {
      const modelConfig: any = {
        model: 'gemini-1.5-flash',
        generationConfig: {
          responseMimeType: 'application/json',
          ...(schema?._def ? { responseSchema: schema._def } : {}),
        },
      };
      if (systemPrompt) modelConfig.systemInstruction = systemPrompt;

      const model = this.client.getGenerativeModel(modelConfig);
      const result = await model.generateContent(prompt);
      return JSON.parse(result.response.text()) as T;
    } catch (error) {
      console.error('[GeminiProvider] Structured generation failed:', error);
      throw error;
    }
  }
}
