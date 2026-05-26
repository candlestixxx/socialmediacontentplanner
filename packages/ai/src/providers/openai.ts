import { AIProvider } from './types';

export class OpenaiProvider implements AIProvider {
  async generateStructuredResponse<T>(prompt: string, schema: any): Promise<T> {
    console.log(`Mock Openai generating response for prompt length: ${prompt.length}`);
    // Placeholder implementation returns a mock object that fits the schema
    return {} as T;
  }
}
