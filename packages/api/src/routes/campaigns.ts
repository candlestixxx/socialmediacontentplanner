import { Router } from 'express';
import { PrismaClient } from '@contentcommand/database';

const router = Router();
const prisma = new PrismaClient();

router.post('/', async (req, res) => {
  const { workspaceId, name, status } = req.body;
  try {
    const campaign = await prisma.campaign.create({
      data: { workspaceId, name, status }
    });
    res.json(campaign);
  } catch(e) {
    res.status(500).json({ error: 'Failed to create campaign' });
  }
});

router.get('/', async (req, res) => {
  const { workspaceId } = req.query;
  try {
    const campaigns = await prisma.campaign.findMany({
      where: { workspaceId: workspaceId as string }
    });
    res.json(campaigns);
  } catch(e) {
    res.status(500).json({ error: 'Failed to fetch campaigns' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const campaign = await prisma.campaign.findUnique({
      where: { id: req.params.id },
      include: { posts: true }
    });
    if (!campaign) return res.status(404).json({ error: 'Not found' });
    res.json(campaign);
  } catch(e) {
    res.status(500).json({ error: 'Failed to fetch campaign' });
  }
});

router.post('/:id/generate-plan', async (req, res) => {
  res.json({ message: 'Mock generating plan logic via AI Package...' });
});

export const campaignsRouter = router;
