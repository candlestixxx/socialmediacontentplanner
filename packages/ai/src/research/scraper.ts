import https from 'https';
import http from 'http';

/**
 * A lightweight, dependency-free HTML text extractor for RAG context.
 * Complies with the prompt requirement to rely on simple user-provided URLs
 * without bringing in heavy, potentially illegal headless scraping frameworks like Puppeteer.
 */
export async function scrapeUrlText(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch (e) {
      return reject(new Error('Invalid URL format'));
    }

    // SSRF protection: reject local and private IPs/hosts
    const hostname = parsedUrl.hostname.toLowerCase();
    if (
      hostname === 'localhost' ||
      hostname.endsWith('.local') ||
      hostname === '127.0.0.1' ||
      hostname === '0.0.0.0' ||
      hostname === '169.254.169.254' ||
      hostname.startsWith('10.') ||
      hostname.startsWith('192.168.') ||
      hostname.match(/^172\.(1[6-9]|2[0-9]|3[0-1])\./) ||
      parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:'
    ) {
      return reject(new Error('Invalid or restricted URL'));
    }

    const client = parsedUrl.protocol === 'https:' ? https : http;

    client.get(parsedUrl, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to fetch URL. Status code: ${res.statusCode}`));
      }

      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        // Rudimentary tag stripping to extract visible text
        let text = data.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
        text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
        text = text.replace(/<[^>]+>/g, ' ');
        text = text.replace(/\s+/g, ' ').trim();

        // Truncate to a safe RAG context size (e.g. roughly ~2000 tokens)
        resolve(text.substring(0, 10000));
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}
