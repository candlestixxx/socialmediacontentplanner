import { ResearchService } from '../src/research/service';
import { MockSearchProvider, MockNewsProvider, MockRSSProvider, MockURLProvider } from '../src/research/providers/mocks';
import { AIProvider } from '../src/providers';
import { ResearchResult } from '../src/research/types';

class MockResearchAIProvider implements AIProvider {
  async generateStructuredResponse<T>(prompt: string, schema: any): Promise<T> {
    // Assert that the compiled prompt contains data from our mocks
    expect(prompt).toContain('MockSearchEngine');
    expect(prompt).toContain('MockNewsNetwork');
    expect(prompt).toContain('ExtractedDomain');

    return {
      topic: 'AI Trends',
      summary: 'A unified summary of AI trends.',
      keyFacts: ['Fact 1', 'Fact 2'],
      sourceLinks: ['https://example.com/search-result'],
      sourceNames: ['MockSearchEngine', 'MockNewsNetwork', 'ExtractedDomain'],
      publishedDates: ['2023-01-01'],
      confidenceScore: 0.95,
      suggestedAngles: ['Angle 1']
    } as unknown as T;
  }
}

describe('ResearchService', () => {
  it('should compile context and invoke AI provider successfully', async () => {
    const service = new ResearchService(
      new MockResearchAIProvider(),
      new MockSearchProvider(),
      new MockNewsProvider(),
      new MockRSSProvider(),
      new MockURLProvider()
    );

    const result = await service.researchTopic('AI Trends', ['https://extract.me']);

    expect(result.summary).toBe('A unified summary of AI trends.');
    expect(result.confidenceScore).toBe(0.95);
    expect(result.sourceNames).toContain('MockSearchEngine');
    expect(result.sourceNames).toContain('ExtractedDomain');
  });
});
