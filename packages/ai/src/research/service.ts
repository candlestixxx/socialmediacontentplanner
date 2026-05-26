import { AIProvider } from '../providers';
import {
  SearchProvider,
  NewsProvider,
  RSSProvider,
  URLIngestionProvider,
  ResearchResult,
  RawResearchItem
} from './types';
import { z } from 'zod';

const ResearchResultSchema = z.object({
  topic: z.string(),
  summary: z.string(),
  keyFacts: z.array(z.string()),
  sourceLinks: z.array(z.string()),
  sourceNames: z.array(z.string()),
  publishedDates: z.array(z.string()),
  confidenceScore: z.number(),
  suggestedAngles: z.array(z.string()),
});

export class ResearchService {
  constructor(
    private aiProvider: AIProvider,
    private searchProvider: SearchProvider,
    private newsProvider: NewsProvider,
    private rssProvider: RSSProvider,
    private urlProvider: URLIngestionProvider
  ) {}

  async researchTopic(topic: string, urls: string[] = []): Promise<ResearchResult> {
    const rawData: RawResearchItem[] = [];

    // Gather data safely from providers
    const [searchResults, newsResults] = await Promise.all([
      this.searchProvider.search(topic),
      this.newsProvider.getNews(topic),
    ]);

    rawData.push(...searchResults, ...newsResults);

    if (urls.length > 0) {
      for (const url of urls) {
        if (url.includes('rss') || url.includes('feed')) {
          const feedItems = await this.rssProvider.fetchFeed(url);
          rawData.push(...feedItems);
        } else {
          const extracted = await this.urlProvider.extractContent(url);
          rawData.push(extracted);
        }
      }
    }

    // Compile findings into a structured prompt
    const compiledContext = rawData.map(item => `
      Source: ${item.sourceName} (${item.sourceUrl})
      Date: ${item.publishedDate}
      Title: ${item.title}
      Content: ${item.content}
    `).join('\n\n');

    const prompt = `
      Topic: ${topic}

      Review the following research materials. Summarize them, extract key facts, deduplicate the findings, and evaluate a confidence score based on the source quality.
      Rules:
      1. Do NOT plagiarize. Rewrite summaries in an original tone.
      2. Return the requested JSON schema perfectly.

      Research Materials:
      ${compiledContext}
    `;

    return this.aiProvider.generateStructuredResponse<ResearchResult>(prompt, ResearchResultSchema);
  }
}
