import { ContentCommandParser, CommandSchema } from '../src/parser/index';

// Mock Provider for deterministic tests
class MockProvider {
  name = 'MOCK';
  async generate(prompt: string) {
    return JSON.stringify({
      topic: 'Test Topic',
      platforms: ['Twitter'],
      tone: 'Humorous',
      contentType: 'POST',
      urgency: false
    });
  }
}

describe('ContentCommandParser', () => {
  it('should parse natural language into valid JSON schema', async () => {
    const parser = new ContentCommandParser(new MockProvider() as any);
    const result = await parser.parseCommand("Write a funny tweet about Test Topic");

    expect(result.topic).toBe('Test Topic');
    expect(result.platforms).toContain('Twitter');
    expect(result.tone).toBe('Humorous');
  });
});
