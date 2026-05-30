import { Router } from 'express';
import { PrismaClient } from '@contentcommand/database';
import { ContentGenerator, OpenAIProvider } from '@contentcommand/ai';

const router = Router();
const prisma = new PrismaClient();

// Instantiate with mock provider for now
const generator = new ContentGenerator(new OpenAIProvider());

router.post('/generate', async (req, res) => {
  const { workspaceId, topic, tone, durationSeconds } = req.body;

  if (!workspaceId || !topic || !tone || !durationSeconds) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Generate script using the AI module
    const generatedScript = await generator.generateShortVideoScript(topic, tone, durationSeconds);

    // Save to database
    const videoProject = await prisma.videoProject.create({
      data: {
        workspaceId,
        title: `Video: ${topic}`,
        script: JSON.stringify(generatedScript)
      }
    });

    res.json({ project: videoProject, script: generatedScript });
  } catch (error) {
    console.error('Video generation error:', error);
    res.status(500).json({ error: 'Failed to generate video script' });
  }
});

export const videosRouter = router;
