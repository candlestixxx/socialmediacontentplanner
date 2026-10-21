import { OpenAI } from 'openai';
import { AIProvider } from './types';

/**
 * OpenAI-compatible provider — prefers DeepSeek when DEEPSEEK_API_KEY is set.
 *
 * No mock fallbacks: when no key is configured both methods throw an
 * explicit configuration error. Callers must handle the error; returning
 * fake generated content would poison content pipelines with fabricated
 * marketing copy that looks real.
 *
 * Structured output uses `response_format: json_object` (DeepSeek V4
 * rejects json_schema; json_object works on both OpenAI and DeepSeek).
 */
const LLM_MODEL = process.env.DEEPSEEK_API_KEY ? (process.env.DEEPSEEK_MODEL || 'deepseek-v4-flash') : 'gpt-4o';
const LLM_BASE_URL = process.env.DEEPSEEK_API_KEY ? 'https://api.deepseek.com/v1' : undefined;

export class OpenAIProvider implements AIProvider {
  name = 'OPENAI';
  // Lazy client: constructed on first use so late-set env vars (tests,
  // runtime config reloads) are honored instead of snapshotting at import.
  private client: OpenAI | null = null;
  private clientInitialized = false;

  constructor(private apiKey?: string) {}

  private getClient(): OpenAI | null {
    if (this.clientInitialized) return this.client;
    this.clientInitialized = true;
    const key = this.apiKey || process.env['DEEPSEEK_API_KEY'] || process.env['OPENAI_API_KEY'];
    if (key) {
      this.client = new OpenAI({ apiKey: key, ...(LLM_BASE_URL ? { baseURL: LLM_BASE_URL } : {}) });
    }
    return this.client;
  }

  async generate(prompt: string, systemPrompt?: string): Promise<string> {
    const client = this.getClient();
    if (!client) {
      throw new Error('LLM unavailable: set DEEPSEEK_API_KEY or OPENAI_API_KEY to enable AI generation.');
    }

    try {
      const messages: any[] = [];
      if (systemPrompt) {
        messages.push({ role: 'system', content: systemPrompt });
      }
      messages.push({ role: 'user', content: prompt });

      const response = await client.chat.completions.create({
        model: LLM_MODEL,
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
    const client = this.getClient();
    if (!client) {
      throw new Error('LLM unavailable: set DEEPSEEK_API_KEY or OPENAI_API_KEY to enable structured generation.');
    }

    // json_object mode: instruct the model to return the schema shape in the
    // prompt, then parse. (json_schema mode is unsupported on DeepSeek V4.)
    const messages: any[] = [];
    if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
    messages.push({
      role: 'user',
      content:
        prompt +
        '\n\nReturn ONLY a valid JSON object matching this JSON Schema:\n' +
        JSON.stringify(schema?._def ?? schema ?? {}),
    });

    const response = await client.chat.completions.create({
      model: LLM_MODEL,
      messages,
      temperature: 0.3,
      response_format: { type: 'json_object' },
      max_tokens: 4096,
    });

    const raw = response.choices[0]?.message?.content || '{}';
    return JSON.parse(raw) as T;
  }
}
