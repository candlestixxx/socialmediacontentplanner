import { Router } from 'express';
import { OpenAIProvider } from '@contentcommand/ai';

const router = Router();
const aiProvider = new OpenAIProvider();

// Mock store for podcast projects
let mockPodcasts: any[] = [
  { id: 'pod_1', title: 'The Future of AI', outline: 'Segment 1: News\nSegment 2: Interview...', createdAt: new Date().toISOString() }
];

// GET /podcasts
router.get('/', (req, res) => {
  res.json(mockPodcasts);
});

// POST /podcasts/generate
router.post('/generate', async (req, res) => {
  const { topic, tone, durationMinutes, hostName, guestName } = req.body;

  if (!topic) {
    return res.status(400).json({ error: 'Topic is required.' });
  }

  try {
    const systemPrompt = `You are an expert podcast producer.
Generate a comprehensive, engaging podcast episode outline and script foundation.
Target Tone: ${tone || 'Conversational'}
Target Duration: ${durationMinutes || 45} minutes.
Host: ${hostName || 'The Host'}
Guest: ${guestName || 'None'}`;

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
      title: `${topic} - Podcast Plan`,
      outline: generatedOutline,
      createdAt: new Date().toISOString()
    };

    mockPodcasts.unshift(newProject);
    res.status(201).json(newProject);
  } catch (error: any) {
    console.error('[Podcast Router Error]', error);
    res.status(500).json({ error: 'Failed to generate podcast outline.' });
  }
});

export const podcastsRouter = router;
