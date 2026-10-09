import { Router } from 'express';
import { OpenAIProvider, ContentCommandParser } from '@contentcommand/ai';
import { prisma } from '@contentcommand/database';

// Lazy-load scrapeUrlText to avoid @langchain/textsplitters CJS resolution failures under tsx
async function safeScrapeUrl(url: string): Promise<string> {
  try {
    const mod = await import('@contentcommand/ai/src/research/scraper');
    return await mod.scrapeUrlText(url);
  } catch {
    return '[URL scraping unavailable — text splitter dependency issue]';
  }
}

const router = Router();
const aiProvider = new OpenAIProvider();

// POST /ai/generate
router.post('/generate', async (req, res) => {
  const { topic, platforms, tone, researchUrl, workspaceId, businessType } = req.body;

  if (!topic) {
    return res.status(400).json({ error: 'Topic is required.' });
  }

  try {
    // Fetch brand voice from BrandKit
    let brandVoice = '';
    try {
      const wsId = workspaceId || (await prisma.workspace.findFirst())?.id;
      if (wsId) {
        const brandKit = await prisma.brandKit.findFirst({ where: { workspaceId: wsId } });
        if (brandKit?.voiceRules) brandVoice = brandKit.voiceRules;
      }
    } catch (e) {
      console.warn('[AI] Could not load brand kit:', e);
    }

    let ragContext = '';

    // RAG (Retrieval-Augmented Generation) Context Injection
    if (researchUrl) {
      console.log(`[RAG] Fetching live context from ${researchUrl}...`);
      try {
        const scrapedText = await safeScrapeUrl(researchUrl);
        ragContext = `\n\nExternal Research Context:\nUse the following extracted text from ${researchUrl} to ground your response in facts:\n"""\n${scrapedText}\n"""\n`;
      } catch (err: any) {
        console.error(`[RAG] Failed to extract text from ${researchUrl}:`, err.message);
        ragContext = `\n\nExternal Research Context:\n- Note: The user requested research from ${researchUrl} but the system could not extract the text. Please generalize.`;
      }
    }

    const brandBlock = brandVoice ? `\nBrand Voice Guidelines (MUST follow):\n${brandVoice}\n` : '';
    const businessBlock = businessType ? `\nBusiness Context: Content is for a ${businessType.replace('_', ' ')} business. Tailor terminology, examples, and calls-to-action accordingly.\n` : '';

    const systemPrompt = `You are ContentCommand AI, an expert social media manager.
Your goal is to generate platform-specific content for the user.
Tone: ${tone || 'Professional'}
Target Platforms: ${(platforms || ['LinkedIn', 'Twitter']).join(', ')}${brandBlock}${businessBlock}
${ragContext}`;

    const userPrompt = `Please write a batch of social media posts about: "${topic}". Format the output cleanly with the platform name as a header.`;

    const generatedContent = await aiProvider.generate(userPrompt, systemPrompt);

    return res.json({
      success: true,
      content: generatedContent,
      usedBrandVoice: !!brandVoice,
      businessType: businessType || null
    });
  } catch (err: any) {
    console.error('[AI Router Error]', err);
    return res.status(500).json({ error: 'Failed to generate AI content.' });
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
    return res.json({ success: true, parsedCommand });
  } catch (err: any) {
    console.error('[AI Router - Parse Command Error]', err);
    return res.status(500).json({ error: 'Failed to parse natural language command.' });
  }
});

export const aiRouter = router;
