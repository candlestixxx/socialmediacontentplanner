import https from 'https';
import http from 'http';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';

/**
 * A lightweight HTML text extractor for RAG context.
 * Relies on simple user-provided URLs without bringing in heavy headless frameworks.
 * Chunks massive articles using LangChain to avoid token limits.
 */
export async function scrapeUrlText(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;

    client.get(url, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to fetch URL. Status code: ${res.statusCode}`));
      }

      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        // Extract Multimodal Visual Context (Phase 24)
        const imageRegex = /<img[^>]+src="?([^"\s]+)"?[^>]*alt="?([^"]+)"?[^>]*>/gi;
        let visualContext = '\n\n[Extracted Visual Context]:\n';
        let match;
        let imageCount = 0;

        while ((match = imageRegex.exec(data)) !== null && imageCount < 10) {
          visualContext += `- Image: ${match[1]} | Alt Text: ${match[2]}\n`;
          imageCount++;
        }

        if (imageCount === 0) {
          visualContext = '';
        }

        // Rudimentary tag stripping to extract visible text
        let text = data.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
        text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
        text = text.replace(/<[^>]+>/g, ' ');
        text = text.replace(/\s+/g, ' ').trim();

        // Append visual context for multimodal RAG injection
        text += visualContext;

        (async () => {
          try {
            const splitter = new RecursiveCharacterTextSplitter({
              chunkSize: 2000,
              chunkOverlap: 200,
            });

            const chunks = await splitter.createDocuments([text]);
            // Return up to 5 chunks joined together, which is roughly ~10,000 characters
            const resultText = chunks.slice(0, 5).map(doc => doc.pageContent).join('\n\n...\n\n');

            resolve(resultText || text.substring(0, 10000));
          } catch (e) {
            resolve(text.substring(0, 10000));
          }
        })();
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}
