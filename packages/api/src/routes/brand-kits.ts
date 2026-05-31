import { Router } from 'express';

const router = Router();

// GET /brand-kits
router.get('/', (req, res) => {
  res.json([]);
});

// POST /brand-kits
router.post('/', (req, res) => {
  res.status(201).json({ id: 'brand_kit_1', ...req.body });
});

// PATCH /brand-kits/:id
router.patch('/:id', (req, res) => {
  res.json({ id: req.params.id, ...req.body });
});

// DELETE /brand-kits/:id
router.delete('/:id', (req, res) => {
  res.json({ success: true });
});

export const brandKitsRouter = router;
