import { Router } from 'express';
import { prisma } from '@contentcommand/database';

const router = Router();

// GET /posts
router.get('/', async (req, res) => {
  try {
    const workspaceId = req.query.workspaceId as string || 'default_ws';
    const wsId = workspaceId === 'default_ws' ? (await prisma.workspace.findFirst())?.id : workspaceId;

    if (!wsId) return res.json([]);

    const posts = await prisma.post.findMany({
      where: { workspaceId: wsId },
      orderBy: { createdAt: 'desc' },
      include: { variants: true }
    });
    res.json(posts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /posts
router.post('/', async (req, res) => {
  try {
    const { content, status, workspaceId, campaignId } = req.body;
    const wsId = workspaceId || (await prisma.workspace.findFirst())?.id;

    if (!wsId) return res.status(400).json({ error: "No workspace available to attach post" });

    const newPost = await prisma.post.create({
      data: {
        content,
        status: status || 'DRAFT',
        workspaceId: wsId,
        campaignId: campaignId || null
      }
    });
    res.status(201).json(newPost);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export const postsRouter = router;
