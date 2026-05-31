import Anthropic from '@anthropic-ai/sdk';
import { AIProvider } from './types';

export class ClaudeProvider implements AIProvider {
  name = 'CLAUDE';
  private client: Anthropic | null = null;

  constructor(apiKey?: string) {
    const key = apiKey || process.env.ANTHROPIC_API_KEY;
    if (key) {
      this.client = new Anthropic({ apiKey: key });
    }
  }

  async generate(prompt: string, systemPrompt?: string): Promise<string> {
    if (!this.client) {
      console.warn('[ClaudeProvider] No API key found. Returning mock response.');
      return Promise.resolve(`Mocked Claude generation for: ${prompt}`);
    }

    try {
      const response = await this.client.messages.create({
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 1024,
        system: systemPrompt,
        messages: [
          { role: 'user', content: prompt }
        ],
      });

      // Handle the text block extraction from the response
      const contentBlock = response.content.find(block => block.type === 'text');
      return contentBlock?.type === 'text' ? contentBlock.text : '';
    } catch (error) {
      console.error('[ClaudeProvider] Error generating response:', error);
      throw error;
    }
  }

  async generateStructuredResponse<T>(prompt: string, schema: any, systemPrompt?: string): Promise<T> {
    console.warn('[claude] Mocking structured response.');
    return {} as T;
  }
}
