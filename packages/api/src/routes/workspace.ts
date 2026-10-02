import { Router } from 'express';
import { prisma } from '@contentcommand/database';

const router = Router();

// GET /workspace — get current workspace settings
router.get('/', async (req, res) => {
  try {
    const workspaceId = req.query['workspaceId'] as string;
    const ws = workspaceId
      ? await prisma.workspace.findUnique({ where: { id: workspaceId } })
      : await prisma.workspace.findFirst();
    if (!ws) return res.status(404).json({ error: 'No workspace found' });
    return res.json({ id: ws.id, name: ws.name, businessType: ws.businessType });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// PATCH /workspace — update workspace settings (businessType)
router.patch('/', async (req, res) => {
  try {
    const { businessType, name, workspaceId } = req.body;
    const ws = workspaceId
      ? await prisma.workspace.findUnique({ where: { id: workspaceId } })
      : await prisma.workspace.findFirst();
    if (!ws) return res.status(404).json({ error: 'No workspace found' });

    const data: Record<string, string> = {};
    if (businessType) data['businessType'] = businessType;
    if (name) data['name'] = name;

    const updated = await prisma.workspace.update({ where: { id: ws.id }, data });
    return res.json({ id: updated.id, name: updated.name, businessType: updated.businessType });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

export const workspaceRouter = router;
