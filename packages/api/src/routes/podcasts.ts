import { Router } from 'express';
import { PrismaClient } from '@contentcommand/database';
import { ContentGenerator, OpenAIProvider } from '@contentcommand/ai';

const router = Router();
const prisma = new PrismaClient();

// Use mock provider
const generator = new ContentGenerator(new OpenAIProvider());

router.post('/generate', async (req, res) => {
  const { workspaceId, topic, tone, durationMinutes } = req.body;

  if (!workspaceId || !topic || !tone || !durationMinutes) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const generatedOutline = await generator.generatePodcastOutline(topic, tone, durationMinutes);

    const podcastProject = await prisma.podcastProject.create({
      data: {
        workspaceId,
        title: generatedOutline.title,
        outline: JSON.stringify(generatedOutline)
      }
    });

    res.json({ project: podcastProject, outline: generatedOutline });
  } catch (error) {
    console.error('Podcast generation error:', error);
    res.status(500).json({ error: 'Failed to generate podcast outline' });
  }
});

export const podcastsRouter = router;
