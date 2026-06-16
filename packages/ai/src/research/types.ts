export interface RawResearchItem {
  title: string;
  content: string;
  sourceUrl: string;
  sourceName: string;
  publishedDate: string;
}

export interface SearchProvider {
  search(query: string): Promise<RawResearchItem[]>;
}

export interface NewsProvider {
  getNews(topic: string): Promise<RawResearchItem[]>;
}

export interface RSSProvider {
  fetchFeed(url: string): Promise<RawResearchItem[]>;
}

export interface URLIngestionProvider {
  extractContent(url: string): Promise<RawResearchItem>;
}

export interface ResearchResult {
  topic: string;
  summary: string;
  keyFacts: string[];
  sourceLinks: string[];
  sourceNames: string[];
  publishedDates: string[];
  confidenceScore: number;
  suggestedAngles: string[];
}
