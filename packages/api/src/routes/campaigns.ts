import { Router } from 'express';
import { prisma } from '@contentcommand/database';
import { AIProvider } from '@contentcommand/ai';

const router = Router();

// GET /campaigns
router.get('/', async (req, res) => {
  try {
    const workspaceId = req.query.workspaceId as string || 'default_ws';
    const campaigns = await prisma.campaign.findMany({
      where: { workspaceId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(campaigns);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /campaigns/:id
router.get('/:id', async (req, res) => {
  try {
    const campaign = await prisma.campaign.findUnique({
      where: { id: req.params.id },
      include: { posts: true }
    });
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    res.json(campaign);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /campaigns
router.post('/', async (req, res) => {
  try {
    const { name, workspaceId, status, startDate, endDate } = req.body;

    // Fallback required because DB strictly requires a workspace ID reference
    // In v2.2 we assume NextAuth/Zustand is passing a valid ID or we mock the relation

    const wsId = workspaceId || (await prisma.workspace.findFirst())?.id;

    if (!wsId) return res.status(400).json({ error: "No workspace available to attach campaign" });

    const newCampaign = await prisma.campaign.create({
      data: {
        name,
        workspaceId: wsId,
        status: status || 'DRAFT',
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      }
    });
    res.status(201).json(newCampaign);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /campaigns/:id
router.patch('/:id', async (req, res) => {
  try {
    const updated = await prisma.campaign.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /campaigns/:id
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await prisma.campaign.delete({
      where: { id: req.params.id }
    });
    res.json(deleted);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export const campaignsRouter = router;
