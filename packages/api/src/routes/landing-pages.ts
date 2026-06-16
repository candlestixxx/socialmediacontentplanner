import { Router } from 'express';
import { prisma } from '@contentcommand/database';
import { OpenAIProvider } from '@contentcommand/ai';

const router = Router();
const aiProvider = new OpenAIProvider();

router.get('/', async (req, res) => {
  const workspaceId = req.query.workspaceId as string;
  const wsId = workspaceId || (await prisma.workspace.findFirst())?.id;
  if (!wsId) return res.json([]);

  const pages = await prisma.landingPage.findMany({ where: { workspaceId: wsId } });
  res.json(pages);
});

router.post('/', async (req, res) => {
  const wsId = req.body.workspaceId || (await prisma.workspace.findFirst())?.id;
  if (!wsId) return res.status(400).json({error: 'Workspace required'});

  const { title, headline, subheadline, heroImage, heroVideo, offer, cta, socialProof, faq, content, seoTitle, metaDescription, utmTracking } = req.body;

  const newPage = await prisma.landingPage.create({
    data: { 
      workspaceId: wsId,
      title, headline, subheadline, heroImage, heroVideo, offer, cta, socialProof, faq, content, seoTitle, metaDescription, utmTracking
    }
  });
  res.json(newPage);
});

router.post('/generate', async (req, res) => {
  const { topic, goal, audience } = req.body;
  const wsId = (await prisma.workspace.findFirst())?.id;
  if (!wsId) return res.status(400).json({error: 'Workspace required'});

  const prompt = `Generate landing page copy for ${topic} targeting ${audience} with the goal of ${goal}. Return exactly valid JSON with keys: title, headline, subheadline, offer, benefits (array), cta, seoTitle, metaDescription.`;

  try {
    const raw = await aiProvider.generate(prompt);
    // Rough parse of JSON output for MVP
    const start = raw.indexOf('{');
    const end = raw.lastIndexOf('}');
    const parsed = JSON.parse(raw.substring(start, end + 1));

    const page = await prisma.landingPage.create({
      data: { ...parsed, workspaceId: wsId }
    });
    res.json(page);
  } catch(e) {
    res.status(500).json({error: 'Failed generation'});
  }
});
export const landingPagesRouter = router;
