import express from 'express';
import cors from 'cors';
import { campaignsRouter } from './routes/campaigns';
import { postsRouter } from './routes/posts';
import { videosRouter } from './routes/videos';
import { podcastsRouter } from './routes/podcasts';
import { brandKitsRouter } from './routes/brand-kits';
import { landingPagesRouter } from './routes/landing-pages';
import { billingRouter } from './routes/billing';
import { notificationsRouter } from './routes/notifications';
import { socialRouter } from './routes/social';
import { aiRouter } from './routes/ai';
import { requireAuth, rateLimiter } from './middleware/auth';

export const app = express();

app.use(cors());
app.use(express.json());
app.use(rateLimiter);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Protect all functional routes with Auth middleware placeholder
app.use(requireAuth);

app.use('/campaigns', campaignsRouter);
app.use('/posts', postsRouter);
app.use('/video-projects', videosRouter);
app.use('/podcasts', podcastsRouter);
app.use('/brand-kits', brandKitsRouter);
app.use('/landing-pages', landingPagesRouter);
app.use('/billing', billingRouter);
app.use('/notifications', notificationsRouter);
app.use('/social', socialRouter);
app.use('/ai', aiRouter);

export const name = '@contentcommand/api';
