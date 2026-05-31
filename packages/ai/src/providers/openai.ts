import { OpenAI } from 'openai';
import { AIProvider } from './types';

export class OpenAIProvider implements AIProvider {
  name = 'OPENAI';
  private client: OpenAI | null = null;

  constructor(apiKey?: string) {
    // If not provided, it falls back to process.env.OPENAI_API_KEY inside the SDK
    const key = apiKey || process.env.OPENAI_API_KEY;
    if (key) {
      this.client = new OpenAI({ apiKey: key });
    }
  }

  async generate(prompt: string, systemPrompt?: string): Promise<string> {
    if (!this.client) {
      console.warn('[OpenAIProvider] No API key found. Returning mock response.');
      return Promise.resolve(`Mocked OpenAI generation for: ${prompt}`);
    }

    try {
      const messages: any[] = [];
      if (systemPrompt) {
        messages.push({ role: 'system', content: systemPrompt });
      }
      messages.push({ role: 'user', content: prompt });

      const response = await this.client.chat.completions.create({
        model: 'gpt-4o',
        messages,
        temperature: 0.7,
      });

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('[OpenAIProvider] Error generating response:', error);
      throw error;
    }
  }


  async generateStructuredResponse<T>(prompt: string, schema: any, systemPrompt?: string): Promise<T> {
    console.warn('[OpenAIProvider] Mocking structured response due to fallback setup.');
    return {} as T;
  }
}
