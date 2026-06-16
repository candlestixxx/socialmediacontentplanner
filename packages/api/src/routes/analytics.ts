import { Router } from 'express';
import { prisma } from '@contentcommand/database';

const router = Router();

// GET /analytics
router.get('/', async (req, res) => {
  try {
    const workspaceId = req.query.workspaceId as string || 'default_ws';

    // Fallback: If no workspace is provided and 'default_ws' doesn't exist, just grab the first one
    const wsId = workspaceId === 'default_ws'
      ? (await prisma.workspace.findFirst())?.id
      : workspaceId;

    if (!wsId) {
      return res.json({ totalViews: 0, totalLikes: 0, totalShares: 0, platforms: [] });
    }

    const metrics = await prisma.analyticsMetric.findMany({
      where: { workspaceId: wsId }
    });

    let totalViews = 0;
    let totalLikes = 0;
    let totalShares = 0;

    metrics.forEach(m => {
      totalViews += m.views;
      totalLikes += m.likes;
      totalShares += m.shares;
    });

    res.json({
      totalViews,
      totalLikes,
      totalShares,
      platforms: metrics
    });
  } catch (error: any) {
    console.error('[Analytics Error]', error);
    res.status(500).json({ error: error.message });
  }
});

export const analyticsRouter = router;
