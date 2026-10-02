import { Router } from 'express';
import { OpenAIProvider } from '@contentcommand/ai';
import { prisma } from '@contentcommand/database';

const router = Router();
const aiProvider = new OpenAIProvider();

// Mock store for podcast projects
let mockPodcasts: any[] = [
  { id: 'pod_1', title: 'The Future of AI', outline: 'Segment 1: News\nSegment 2: Interview...', createdAt: new Date().toISOString() }
];

// GET /podcasts
router.get('/', (_req, res) => {
  return res.json(mockPodcasts);
});

// POST /podcasts/generate
router.post('/generate', async (req, res) => {
  const { workspaceId, topic, tone, durationMinutes, hostName, guestName, businessType } = req.body;

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
      console.warn('[Podcast] Could not load brand kit:', e);
    }

    const brandBlock = brandVoice ? `\nBrand Voice Guidelines (MUST follow):\n${brandVoice}\n` : '';
    const businessBlock = businessType ? `\nBusiness Context: Content is for a ${businessType.replace('_', ' ')} business.\n` : '';

    const systemPrompt = `You are an expert podcast producer.
Generate a comprehensive, engaging podcast episode outline and script foundation.
Target Tone: ${tone || 'Conversational'}
Target Duration: ${durationMinutes || 45} minutes.
Host: ${hostName || 'The Host'}
Guest: ${guestName || 'None'}${brandBlock}${businessBlock}`;

    const userPrompt = `Write a complete podcast episode outline for the topic: "${topic}".
Please include:
1. Suggested Episode Title & SEO Description
2. Intro Script (Hook + Welcome)
3. 3-4 Main Segment Outlines with talking points
4. Suggested Guest Interview Questions (if applicable)
5. Outro Script and Call to Action (subscribe/review)
Format cleanly so a host can read it directly.`;

    const generatedOutline = await aiProvider.generate(userPrompt, systemPrompt);

    const newProject = {
      id: `pod_${Date.now()}`,
      workspaceId,
      title: 'Podcast Ep 1',
      outline: generatedOutline,
      createdAt: new Date().toISOString()
    };

    mockPodcasts.unshift(newProject);
    return res.status(200).json({ project: newProject, outline: generatedOutline, usedBrandVoice: !!brandVoice });
  } catch (error: any) {
    console.error('[Podcast Router Error]', error);
    return res.status(500).json({ error: 'Failed to generate podcast outline.' });
  }
});

export const podcastsRouter = router;
