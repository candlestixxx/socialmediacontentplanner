import { Router } from 'express';
import { PrismaClient } from '@contentcommand/database';

const router = Router();
const prisma = new PrismaClient();

router.post('/', async (req, res) => {
  const { workspaceId, campaignId, content } = req.body;
  try {
    const post = await prisma.post.create({
      data: { workspaceId, campaignId, content }
    });
    res.json(post);
  } catch(e) {
    res.status(500).json({ error: 'Failed to create post' });
  }
});

router.get('/', async (req, res) => {
  const { workspaceId } = req.query;
  try {
    const posts = await prisma.post.findMany({
      where: { workspaceId: workspaceId as string }
    });
    res.json(posts);
  } catch(e) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

router.patch('/:id', async (req, res) => {
  const { content, status } = req.body;
  try {
    const post = await prisma.post.update({
      where: { id: req.params.id },
      data: { content, status }
    });
    res.json(post);
  } catch(e) {
    res.status(500).json({ error: 'Failed to update post' });
  }
});

router.post('/:id/schedule', async (req, res) => {
  const { scheduledAt } = req.body;
  try {
    const post = await prisma.post.update({
      where: { id: req.params.id },
      data: { scheduledAt: new Date(scheduledAt), status: 'SCHEDULED' }
    });
    res.json(post);
  } catch(e) {
    res.status(500).json({ error: 'Failed to schedule post' });
  }
});

router.post('/bulk-schedule', async (req, res) => {
  res.json({ message: 'Mock bulk scheduling posts via Jobs Package...' });
});

export const postsRouter = router;
