import Anthropic from '@anthropic-ai/sdk';
import { AIProvider } from './types';

export class ClaudeProvider implements AIProvider {
  name = 'CLAUDE';
  private client: Anthropic | null = null;

  constructor(apiKey?: string) {
    const key = apiKey || process.env['ANTHROPIC_API_KEY'];
    if (key) {
      this.client = new Anthropic({ apiKey: key });
    }
  }

  async generate(prompt: string, systemPrompt?: string): Promise<string> {
    if (!this.client) {
      throw new Error('Claude unavailable: set ANTHROPIC_API_KEY to enable AI generation.');
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
    if (!this.client) {
      throw new Error('Claude unavailable: set ANTHROPIC_API_KEY to enable structured generation.');
    }

    // Claude has no native JSON schema mode; prompt for JSON and parse.
    const jsonPrompt =
      prompt +
      '\n\nReturn ONLY a valid JSON object matching this JSON Schema:\n' +
      JSON.stringify(schema?._def ?? schema ?? {});

    const response = await this.client.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: 'user', content: jsonPrompt }],
    });

    const contentBlock = response.content.find(block => block.type === 'text');
    const raw = contentBlock?.type === 'text' ? contentBlock.text : '{}';
    const start = raw.indexOf('{');
    const end = raw.lastIndexOf('}');
    if (start === -1 || end === -1) throw new Error('Claude returned no JSON object');
    return JSON.parse(raw.substring(start, end + 1)) as T;
  }
}
