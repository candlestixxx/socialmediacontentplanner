import { Router } from 'express';
import { OpenAIProvider } from '@contentcommand/ai';

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

    // Simulate RAG (Retrieval-Augmented Generation) if a URL is provided
    if (researchUrl) {
      console.log(`[RAG] Fetching context from ${researchUrl}...`);
      // TODO: Actually fetch and chunk the URL content using @contentcommand/ai/research module
      ragContext = `\n\nExternal Research Context:\n- According to recent data from ${researchUrl}, the key trends involve automation, multi-modal outputs, and scalable distribution.`;
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

export const aiRouter = router;
