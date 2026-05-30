import { Router } from 'express';

const router = Router();

// Mock in-memory store for landing pages
const mockLandingPages: any[] = [];

// GET /landing-pages
router.get('/', (req, res) => {
  res.json(mockLandingPages);
});

// GET /landing-pages/:id
router.get('/:id', (req, res) => {
  const landingPage = mockLandingPages.find((p) => p.id === req.params.id);
  if (!landingPage) {
    return res.status(404).json({ error: 'Landing page not found' });
  }
  res.json(landingPage);
});

// POST /landing-pages
router.post('/', (req, res) => {
  const newLandingPage = {
    id: `lp-${Date.now()}`,
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockLandingPages.push(newLandingPage);
  res.status(201).json(newLandingPage);
});

// PATCH /landing-pages/:id
router.patch('/:id', (req, res) => {
  const index = mockLandingPages.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Landing page not found' });
  }

  mockLandingPages[index] = {
    ...mockLandingPages[index],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };
  res.json(mockLandingPages[index]);
});

// DELETE /landing-pages/:id
router.delete('/:id', (req, res) => {
  const index = mockLandingPages.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Landing page not found' });
  }

  const deleted = mockLandingPages.splice(index, 1);
  res.json(deleted[0]);
});

// POST /landing-pages/generate
router.post('/generate', (req, res) => {
  const { topic, goal, audience } = req.body;
  // Mock AI generation
  const generatedPage = {
    id: `lp-${Date.now()}`,
    title: `${topic} Landing Page`,
    headline: `Unlock the Power of ${topic}`,
    subheadline: `Reach your ${audience} goals today.`,
    benefits: ['Benefit 1', 'Benefit 2', 'Benefit 3'],
    cta: 'Get Started Now',
    content: `Generated content for ${goal}`,
    seoTitle: `${topic} - Top Solution`,
    metaDescription: `Discover the best solution for ${topic} tailored to ${audience}.`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockLandingPages.push(generatedPage);
  res.status(201).json(generatedPage);
});

export const landingPagesRouter = router;
