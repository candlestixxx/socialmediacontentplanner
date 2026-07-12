import dotenv from 'dotenv';
import path from 'path';

// Load .env from the package root or project root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { app } from './index';
import { WebSocketServer, WebSocket } from 'ws';

const port = process.env.PORT || 3031;

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

// Broadcast mock live queue/publishing states every 5 seconds
setInterval(() => {
  if (clients.size === 0) return;

  const mockPayload = JSON.stringify({
    type: 'publishing_status',
    data: {
      activeJobs: Math.floor(Math.random() * 5),
      queueSize: Math.floor(Math.random() * 10),
      lastUpdate: new Date().toISOString()
    }
  });

  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(mockPayload);
    }
  });
}, 5000);
