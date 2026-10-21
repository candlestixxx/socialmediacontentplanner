export interface AIProvider {
  generateStructuredResponse<T>(prompt: string, schema: any, systemPrompt?: string): Promise<T>;
}
