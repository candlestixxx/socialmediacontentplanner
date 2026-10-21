import {
  SearchProvider,
  NewsProvider,
  RSSProvider,
  URLIngestionProvider,
  RawResearchItem,
} from '../types';

/**
 * LIVE research providers — real network calls, no fabricated results.
 *
 * Search  — Tavily API (TAVILY_API_KEY)
 * News    — NewsAPI (NEWSAPI_KEY)
 * RSS     — direct feed fetch + lightweight XML item extraction (no key)
 * URL     — direct page fetch + HTML-to-text extraction (no key)
 *
 * Provider methods return [] (search/news) or throw (url) when unconfigured
 * or upstream fails. They never synthesize fake articles/snippets — invented
 * research content poisons generated marketing copy and source citations.
 */

// ─── Tavily Search ─────────────────────────────────────────────
export class TavilySearchProvider implements SearchProvider {
  async search(query: string): Promise<RawResearchItem[]> {
    const key = process.env.TAVILY_API_KEY;
    if (!key) {
      console.warn('[TavilySearchProvider] TAVILY_API_KEY not set — skipping web search.');
      return [];
    }
    const resp = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: key, query, max_results: 8 }),
      signal: AbortSignal.timeout(20000),
    });
    if (!resp.ok) return [];
    const data = await resp.json();
    return (data.results || []).map((r: any) => ({
      title: r.title,
      content: r.content,
      sourceUrl: r.url,
      sourceName: safeHostname(r.url),
      publishedDate: new Date().toISOString(),
    }));
  }
}

// ─── NewsAPI ───────────────────────────────────────────────────
export class NewsApiProvider implements NewsProvider {
  async getNews(topic: string): Promise<RawResearchItem[]> {
    const key = process.env.NEWSAPI_KEY;
    if (!key) {
      console.warn('[NewsApiProvider] NEWSAPI_KEY not set — skipping news lookup.');
      return [];
    }
    const params = new URLSearchParams({ q: topic, sortBy: 'publishedAt', pageSize: '8', apiKey: key });
    const resp = await fetch(`https://newsapi.org/v2/everything?${params}`, {
      signal: AbortSignal.timeout(20000),
    });
    if (!resp.ok) return [];
    const data = await resp.json();
    return (data.articles || []).map((a: any) => ({
      title: a.title,
      content: a.description || a.content || '',
      sourceUrl: a.url,
      sourceName: a.source?.name || safeHostname(a.url),
      publishedDate: a.publishedAt || new Date().toISOString(),
    }));
  }
}

// ─── RSS (keyless) ─────────────────────────────────────────────
export class LiveRSSProvider implements RSSProvider {
  async fetchFeed(url: string): Promise<RawResearchItem[]> {
    const resp = await fetch(url, { signal: AbortSignal.timeout(20000) });
    if (!resp.ok) throw new Error(`RSS fetch failed (${resp.status}): ${url}`);
    const xml = await resp.text();

    // Minimal <item> extraction — avoids a heavyweight XML dependency.
    const items: RawResearchItem[] = [];
    const itemMatches = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) || [];
    for (const raw of itemMatches.slice(0, 10)) {
      items.push({
        title: decodeEntities(tagText(raw, 'title')),
        content: decodeEntities(stripTags(tagText(raw, 'description'))),
        sourceUrl: tagText(raw, 'link') || url,
        sourceName: safeHostname(tagText(raw, 'link') || url),
        publishedDate: tagText(raw, 'pubDate') || new Date().toISOString(),
      });
    }
    return items;
  }
}

// ─── URL ingestion (keyless) ───────────────────────────────────
export class LiveURLProvider implements URLIngestionProvider {
  async extractContent(url: string): Promise<RawResearchItem> {
    const resp = await fetch(url, {
      headers: { 'User-Agent': 'ContentCommandBot/1.0' },
      signal: AbortSignal.timeout(20000),
    });
    if (!resp.ok) throw new Error(`URL fetch failed (${resp.status}): ${url}`);
    const html = await resp.text();

    // Strip script/style/nav chrome, then tags — crude but dependency-free.
    const cleaned = html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    return {
      title: decodeEntities(titleMatch?.[1]?.trim() || safeHostname(url)),
      content: cleaned.slice(0, 8000),
      sourceUrl: url,
      sourceName: safeHostname(url),
      publishedDate: new Date().toISOString(),
    };
  }
}

// ─── helpers ───────────────────────────────────────────────────
function tagText(xml: string, tag: string): string {
  const m = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return m?.[1]?.trim() ?? '';
}

function stripTags(s: string): string {
  return s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/gi, "'");
}

function safeHostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return 'unknown';
  }
}
