import express from 'express';
import cors from 'cors';
import { campaignsRouter } from './routes/campaigns';
import { postsRouter } from './routes/posts';
import { videosRouter } from './routes/videos';
import { podcastsRouter } from './routes/podcasts';
import { brandKitsRouter } from './routes/brand-kits';

export const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/campaigns', campaignsRouter);
app.use('/posts', postsRouter);
app.use('/video-projects', videosRouter);
app.use('/podcasts', podcastsRouter);
app.use('/brand-kits', brandKitsRouter);

export const name = '@contentcommand/api';
