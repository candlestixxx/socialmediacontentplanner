import { Router } from 'express';
import { OpenAIProvider } from '@contentcommand/ai';

const router = Router();
const aiProvider = new OpenAIProvider();

// Mock store for video projects
let mockVideos: any[] = [
  { id: 'vid_1', title: 'Top 5 SaaS Tools', script: 'Hook: Stop paying for software...\nScene 1: Show logo...', createdAt: new Date().toISOString() }
];

// GET /video-projects
router.get('/', (req, res) => {
  res.json(mockVideos);
});

// POST /video-projects/generate
router.post('/generate', async (req, res) => {
  const { workspaceId, topic, tone, durationSeconds } = req.body;

  if (!workspaceId || !topic || !tone) {
    return res.status(400).json({ error: 'WorkspaceId, topic, and tone are required.' });
  }

  try {
    const systemPrompt = `You are an expert short-form video producer (TikTok, YouTube Shorts, Instagram Reels).
Generate a highly engaging, retention-optimized video script.
Target Tone: ${tone || 'Engaging'}
Target Duration: ${durationSeconds || 30} seconds.`;

    const userPrompt = `Write a viral short-form video script about: "${topic}".
Include:
- A strong Hook (0-3s)
- Visual / B-Roll suggestions for each scene
- The actual Voiceover script
- A clear Call to Action (CTA) at the end
Keep the format clean and easy to read.`;

    const generatedScript = await aiProvider.generate(userPrompt, systemPrompt);

    const newProject = {
      id: `vid_${Date.now()}`,
      workspaceId,
      title: `Video: ${topic}`,
      script: generatedScript,
      createdAt: new Date().toISOString()
    };

    const structuredScript = {
      hook: `Viral hook for ${topic}`,
      scenes: [
        { number: 1, description: 'Opening scene', voiceover: generatedScript }
      ],
      cta: 'Follow ContentCommand AI for more awesome content!'
    };

    mockVideos.unshift({ ...newProject, script: structuredScript });
    res.status(200).json({ project: newProject, script: structuredScript });
  } catch (error: any) {
    console.error('[Video Router Error]', error);
    res.status(500).json({ error: 'Failed to generate video script.' });
  }
});

export const videosRouter = router;
