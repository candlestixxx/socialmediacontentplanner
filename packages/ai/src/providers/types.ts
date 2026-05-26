export interface AIProvider {
  generateStructuredResponse<T>(prompt: string, schema: any): Promise<T>;
}
