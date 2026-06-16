import {
  SearchProvider,
  NewsProvider,
  RSSProvider,
  URLIngestionProvider,
  RawResearchItem
} from '../types';

export class MockSearchProvider implements SearchProvider {
  async search(query: string): Promise<RawResearchItem[]> {
    return [
      {
        title: `Search result for ${query}`,
        content: `This is a mock search snippet regarding ${query}.`,
        sourceUrl: 'https://example.com/search-result',
        sourceName: 'MockSearchEngine',
        publishedDate: new Date().toISOString(),
      }
    ];
  }
}

export class MockNewsProvider implements NewsProvider {
  async getNews(topic: string): Promise<RawResearchItem[]> {
    return [
      {
        title: `Breaking News: ${topic}`,
        content: `Latest news about ${topic} tells us amazing things.`,
        sourceUrl: 'https://news.example.com/breaking',
        sourceName: 'MockNewsNetwork',
        publishedDate: new Date().toISOString(),
      }
    ];
  }
}

export class MockRSSProvider implements RSSProvider {
  async fetchFeed(url: string): Promise<RawResearchItem[]> {
    return [
      {
        title: 'RSS Feed Item',
        content: 'Content from an RSS feed.',
        sourceUrl: url,
        sourceName: 'MockBlog',
        publishedDate: new Date().toISOString(),
      }
    ];
  }
}

export class MockURLProvider implements URLIngestionProvider {
  async extractContent(url: string): Promise<RawResearchItem> {
    return {
      title: 'Extracted Page',
      content: `Safe, compliant content extracted from ${url}.`,
      sourceUrl: url,
      sourceName: 'ExtractedDomain',
      publishedDate: new Date().toISOString(),
    };
  }
}
