import { Router } from 'express';
import { prisma } from '@contentcommand/database';

const router = Router();

// Notifications are persisted via the real Notification model. (The previous
// in-memory store seeded fabricated notifications — "campaign ends in 2 days",
// "post published to Facebook" — that looked like real activity but weren't.)

// GET /notifications?workspaceId=...
// workspaceId is optional: when omitted, returns the most recent
// notifications across workspaces. (Cross-service workspace mapping between
// the CRM dashboard and ContentPlanner is pending — see TODO.md.)
router.get('/', async (req, res) => {
  try {
    // Scope: explicit query param > service-JWT workspace claim (CRM proxy)
    const workspaceId = String(req.query.workspaceId || (req as any).workspaceId || '');

    const notifications = await prisma.notification.findMany({
      where: workspaceId ? { workspaceId } : undefined,
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return res.json(notifications);
  } catch (e: any) {
    console.error('[Notifications] list failed:', e);
    return res.status(500).json({ error: 'Failed to list notifications.' });
  }
});

// POST /notifications (Internal / Webhook use)
router.post('/', async (req, res) => {
  try {
    const { message, workspaceId } = req.body;
    if (!message || !workspaceId) {
      return res.status(400).json({ error: 'message and workspaceId are required' });
    }
    const newNotif = await prisma.notification.create({
      data: { message, workspaceId },
    });
    return res.status(201).json(newNotif);
  } catch (e: any) {
    console.error('[Notifications] create failed:', e);
    return res.status(500).json({ error: 'Failed to create notification.' });
  }
});

// PATCH /notifications/:id/read
router.patch('/:id/read', async (req, res) => {
  try {
    const notif = await prisma.notification.update({
      where: { id: req.params.id },
      data: { read: true },
    });
    return res.json(notif);
  } catch (e: any) {
    if (e?.code === 'P2025') return res.status(404).json({ error: 'Notification not found' });
    console.error('[Notifications] mark-read failed:', e);
    return res.status(500).json({ error: 'Failed to mark notification read.' });
  }
});

// PATCH /notifications/read-all?workspaceId=...
router.patch('/read-all', async (req, res) => {
  try {
    const workspaceId = String(req.query.workspaceId || req.body?.workspaceId || '');
    if (!workspaceId) return res.status(400).json({ error: 'workspaceId is required' });

    await prisma.notification.updateMany({
      where: { workspaceId, read: false },
      data: { read: true },
    });
    return res.json({ success: true });
  } catch (e: any) {
    console.error('[Notifications] read-all failed:', e);
    return res.status(500).json({ error: 'Failed to mark all notifications read.' });
  }
});

export const notificationsRouter = router;
