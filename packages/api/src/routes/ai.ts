import { Router } from 'express';
import { OpenAIProvider, ContentCommandParser } from '@contentcommand/ai';
import { scrapeUrlText } from '@contentcommand/ai/src/research/scraper';

const router = Router();
const aiProvider = new OpenAIProvider();

// POST /ai/generate
router.post('/generate', async (req, res) => {
  const { topic, platforms, tone, researchUrl } = req.body;

  if (!topic) {
    return res.status(400).json({ error: 'Topic is required.' });
  }

  try {
    let ragContext = '';

    // RAG (Retrieval-Augmented Generation) Context Injection
    if (researchUrl) {
      console.log(`[RAG] Fetching live context from ${researchUrl}...`);
      try {
        const scrapedText = await scrapeUrlText(researchUrl);
        ragContext = `\n\nExternal Research Context:\nUse the following extracted text from ${researchUrl} to ground your response in facts:\n"""\n${scrapedText}\n"""\n`;
      } catch (err: any) {
        console.error(`[RAG] Failed to extract text from ${researchUrl}:`, err.message);
        // Fallback to minimal context if fetch fails
        ragContext = `\n\nExternal Research Context:\n- Note: The user requested research from ${researchUrl} but the system could not extract the text. Please generalize.`;
      }
    }

    const systemPrompt = `You are ContentCommand AI, an expert social media manager.
Your goal is to generate platform-specific content for the user.
Tone: ${tone || 'Professional'}
Target Platforms: ${(platforms || ['LinkedIn', 'Twitter']).join(', ')}
${ragContext}`;

    const userPrompt = `Please write a batch of social media posts about: "${topic}". Format the output cleanly with the platform name as a header.`;

    const generatedContent = await aiProvider.generate(userPrompt, systemPrompt);

    res.json({
      success: true,
      content: generatedContent
    });
  } catch (err: any) {
    console.error('[AI Router Error]', err);
    res.status(500).json({ error: 'Failed to generate AI content.' });
  }
});



const parser = new ContentCommandParser();

// POST /ai/parse-command
router.post('/parse-command', async (req, res) => {
  const { rawText } = req.body;

  if (!rawText) {
    return res.status(400).json({ error: 'rawText is required.' });
  }

  try {
    const parsedCommand = await parser.parseCommand(rawText);
    res.json({ success: true, parsedCommand });
  } catch (err: any) {
    console.error('[AI Router - Parse Command Error]', err);
    res.status(500).json({ error: 'Failed to parse natural language command.' });
  }
});

export const aiRouter = router;
