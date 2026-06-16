import { Router } from 'express';
import { prisma } from '@contentcommand/database';

const router = Router();

// GET /brand-kits
router.get('/', async (req, res) => {
  try {
    const workspaceId = req.query.workspaceId as string;
    const wsId = workspaceId || (await prisma.workspace.findFirst())?.id;
    if (!wsId) return res.json([]);

    const kits = await prisma.brandKit.findMany({ where: { workspaceId: wsId } });
    res.json(kits);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /brand-kits
router.post('/', async (req, res) => {
  try {
    const wsId = req.body.workspaceId || (await prisma.workspace.findFirst())?.id;
    if (!wsId) return res.status(400).json({ error: 'Workspace required' });

    const newKit = await prisma.brandKit.create({
      data: { ...req.body, workspaceId: wsId }
    });
    res.status(200).json(newKit);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /brand-kits/:id
router.patch('/:id', async (req, res) => {
  try {
    const updated = await prisma.brandKit.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /brand-kits/:id
router.delete('/:id', async (req, res) => {
  try {
    await prisma.brandKit.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export const brandKitsRouter = router;
