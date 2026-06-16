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
      if (prompt.toLowerCase().includes('json')) {
        return JSON.stringify({
          title: "Mock Landing Page",
          headline: "Revolutionize Your Workflow with AI",
          subheadline: "The all-in-one platform for content creators and social media managers.",
          offer: "Get started for free today and save 20 hours a week.",
          benefits: ["AI-powered generation", "Seamless scheduling", "Real-time analytics"],
          cta: "Claim Your Free Account",
          seoTitle: "AI Content Planner | ContentCommand",
          metaDescription: "The best AI tool for social media management."
        });
      }
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
    return {
      topic: 'AI integration',
      platforms: ['Twitter', 'LinkedIn'],
      tone: 'Humorous',
      contentType: 'POST',
      urgency: false
    } as unknown as T;
  }
}
