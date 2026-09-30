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
    const { content, status, workspaceId, campaignId, scheduledAt, platform } = req.body;
    const wsId = workspaceId || (await prisma.workspace.findFirst())?.id;

    if (!wsId) return res.status(400).json({ error: "No workspace available to attach post" });

    const newPost = await prisma.post.create({
      data: {
        content,
        status: status || 'DRAFT',
        workspaceId: wsId,
        campaignId: campaignId || null,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      }
    });

    // If scheduled, queue for publishing via BullMQ
    if (scheduledAt && platform) {
      try {
        const { schedulePost } = await import('@contentcommand/jobs');
        const delayMs = new Date(scheduledAt).getTime() - Date.now();
        await schedulePost(newPost.id, platform, Math.max(0, delayMs));
        console.log(`[Posts] Post ${newPost.id} queued for ${platform} at ${scheduledAt}`);
      } catch (queueErr: any) {
        // Non-fatal — queue may not be running in dev
        console.warn('[Posts] Could not queue post for publishing:', queueErr.message);
      }
    }

    res.status(201).json(newPost);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export const postsRouter = router;
