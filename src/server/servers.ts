// Where the servers are created.
// servers.ts is NOT the entry point (index.ts is). It creates Express and Socket.IO and exports them.
import express from 'express';
import { Server } from 'socket.io';
import { instrument } from '@socket.io/admin-ui';
import type { ClientToServerEvents, ServerToClientEvents } from '../shared/types';

const PORT = Number(process.env.PORT) || 9000;

// Origins that may open a socket connection. CLIENT_URL can hold several URLs separated by commas.
const clientUrls = (process.env.CLIENT_URL ?? '')
  .split(',')
  .map((url) => url.trim().replace(/\/$/, ''))
  .filter(Boolean);

const allowedOrigins = [
  'http://localhost:5173', // Vite dev server
  'https://admin.socket.io', // Socket.IO Admin UI
  ...clientUrls,
];

export const app = express();
const httpServer = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

export const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

// The Admin UI is only enabled when a bcrypt password hash is provided.
const adminPasswordHash = process.env.ADMIN_UI_PASSWORD_HASH;
if (adminPasswordHash) {
  instrument(io, {
    auth: {
      type: 'basic',
      username: 'admin',
      password: adminPasswordHash,
    },
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  });
}
