import { Router } from 'express';
import { OpenAIProvider } from '@contentcommand/ai';
import { prisma } from '@contentcommand/database';

const router = Router();
const aiProvider = new OpenAIProvider();

// GET /video-projects — real persisted projects (most recent first)
router.get('/', async (req, res) => {
  try {
    const { workspaceId } = req.query;
    const projects = await prisma.videoProject.findMany({
      where: workspaceId ? { workspaceId: String(workspaceId) } : undefined,
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return res.json(projects);
  } catch (e: any) {
    console.error('[Video] list failed:', e);
    return res.status(500).json({ error: 'Failed to list video projects.' });
  }
});

// POST /video-projects/generate
router.post('/generate', async (req, res) => {
  const { workspaceId, topic, tone, durationSeconds, businessType } = req.body;

  if (!workspaceId || !topic || !tone) {
    return res.status(400).json({ error: 'WorkspaceId, topic, and tone are required.' });
  }

  try {
    // Fetch brand voice from BrandKit
    let brandVoice = '';
    try {
      const brandKit = await prisma.brandKit.findFirst({ where: { workspaceId } });
      if (brandKit?.voiceRules) brandVoice = brandKit.voiceRules;
    } catch (e) {
      console.warn('[Video] Could not load brand kit:', e);
    }

    const brandBlock = brandVoice ? `\nBrand Voice Guidelines (MUST follow):\n${brandVoice}\n` : '';
    const businessBlock = businessType ? `\nBusiness Context: Content is for a ${businessType.replace('_', ' ')} business.\n` : '';

    const systemPrompt = `You are an expert short-form video producer (TikTok, YouTube Shorts, Instagram Reels).
Generate a highly engaging, retention-optimized video script.
Target Tone: ${tone || 'Engaging'}
Target Duration: ${durationSeconds || 30} seconds.${brandBlock}${businessBlock}`;

    // Ask the LLM for structured JSON so we store a real parsed script —
    // the previous version stored a hardcoded fake "structuredScript" wrapper
    // around the generated text (fixed hook/cta strings regardless of input).
    const userPrompt = `Write a viral short-form video script about: "${topic}".
Return ONLY a JSON object with this exact shape:
{
  "hook": "the 0-3s hook line",
  "scenes": [{ "number": 1, "description": "visual/b-roll", "voiceover": "spoken line" }],
  "cta": "the closing call to action"
}`;

    const structuredScript = await aiProvider.generateStructuredResponse<{
      hook: string;
      scenes: { number: number; description: string; voiceover: string }[];
      cta: string;
    }>(userPrompt, {
      type: 'object',
      properties: {
        hook: { type: 'string' },
        scenes: { type: 'array', items: { type: 'object', properties: { number: { type: 'number' }, description: { type: 'string' }, voiceover: { type: 'string' } }, required: ['number', 'description', 'voiceover'] } },
        cta: { type: 'string' },
      },
      required: ['hook', 'scenes', 'cta'],
    }, systemPrompt);

    // Persist the full script as readable text for the project record.
    const scriptText = [
      `HOOK: ${structuredScript.hook}`,
      ...structuredScript.scenes.map(s => `SCENE ${s.number} — ${s.description}\nVO: ${s.voiceover}`),
      `CTA: ${structuredScript.cta}`,
    ].join('\n\n');

    const newProject = await prisma.videoProject.create({
      data: {
        workspaceId,
        title: `Video: ${topic}`,
        script: scriptText,
      },
    });

    return res.status(200).json({ project: newProject, script: structuredScript, usedBrandVoice: !!brandVoice });
  } catch (error: any) {
    console.error('[Video Router Error]', error);
    return res.status(500).json({ error: 'Failed to generate video script.' });
  }
});

export const videosRouter = router;
