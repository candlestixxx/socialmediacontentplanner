import dotenv from 'dotenv';
import path from 'path';

// Load .env from the package root or project root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { app } from './index';
import { WebSocketServer, WebSocket } from 'ws';

const port = process.env['PORT'] || 3031;

const server = app.listen(port, () => {
  console.log(`ContentCommand API is running on http://localhost:${port}`);
});

// Setup WebSocket Server for Live Queue Updates (Phase 23)
const wss = new WebSocketServer({ server });

const clients = new Set<WebSocket>();

wss.on('connection', (ws) => {
  console.log('[WebSocket] Client connected.');
  clients.add(ws);

  ws.on('close', () => {
    console.log('[WebSocket] Client disconnected.');
    clients.delete(ws);
  });
});

// Broadcast real publishing queue state to connected clients.
// Previously this pushed random fake numbers every 5s — operators saw live
// dashboards with fabricated activity. Now each tick queries actual drafts.
import { prisma } from '@contentcommand/database';

setInterval(async () => {
  if (clients.size === 0) return;

  try {
    const [queued, published] = await Promise.all([
      prisma.post.count({ where: { status: 'SCHEDULED' as any } }).catch(() => 0),
      prisma.post.count({ where: { status: 'PUBLISHED' as any } }).catch(() => 0),
    ]);

    const payload = JSON.stringify({
      type: 'publishing_status',
      data: {
        queueSize: queued,
        publishedToday: published,
        lastUpdate: new Date().toISOString(),
      },
    });

    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    });
  } catch (e) {
    console.error('[WebSocket] publishing_status broadcast failed:', e);
  }
}, 5000);
