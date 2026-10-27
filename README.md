# Agar Clone (TypeScript)

A multiplayer clone of agar.io built with TypeScript, Node.js, Express, Socket.IO and the HTML canvas API. Players move blobs around a shared world, absorb orbs to grow, and eat smaller players.

Built as a practice project while following the Udemy course "SocketIO v4, with websockets - the details" by Robert Bunch, then migrated to TypeScript with a split frontend and backend.

## Features

- Real-time multiplayer over WebSockets
- Server-authoritative game state: the client only sends its movement direction
- Fully typed Socket.IO events, shared between server and client
- 5000 orbs across the world, replaced when absorbed
- Mouse-controlled movement, with larger players moving slower
- Camera that follows the player
- Orb and player collision detection (AABB check followed by a distance check)
- Live leaderboard and score
- Optional Socket.IO Admin UI

## Tech stack

- TypeScript
- Node.js, Express, Socket.IO
- Vite and the HTML5 canvas API for the client
- Bootstrap 5 (modals)

## Getting started

Requirements: Node.js 20.19 or newer.

```bash
npm install
```

Run the server and the client in two terminals:

```bash
npm run dev:server   # Socket.IO server on http://localhost:9000
npm run dev:client   # Vite dev server on http://localhost:5173
```

Open http://localhost:5173 in two or more browser tabs to play against yourself.

## Scripts

| Script | Description |
|---|---|
| `npm run dev:server` | Starts the server with auto-reload (tsx) |
| `npm run dev:client` | Starts the Vite dev server |
| `npm run build:server` | Compiles the server to `dist/` |
| `npm run build:client` | Type-checks and builds the client to `dist-client/` |
| `npm run build` | Builds both |
| `npm start` | Runs the compiled server (`dist/server/index.js`) |
| `npm run typecheck` | Type-checks server and client without emitting files |

## Environment variables

| Variable | Where | Description |
|---|---|---|
| `PORT` | server | Port to listen on. Defaults to `9000`. Render sets it automatically. |
| `CLIENT_URL` | server | URL of the deployed client, used for CORS. Several URLs can be separated by commas. |
| `ADMIN_UI_PASSWORD_HASH` | server | bcrypt hash of the Admin UI password. The Admin UI is disabled when this is not set. |
| `VITE_SERVER_URL` | client (build time) | URL of the Socket.IO server. Defaults to `http://localhost:9000`. |

See `.env.example`.

## Deployment

The server and the client are deployed separately.

### Backend on Render

1. Create a new **Web Service** from your GitHub repository.
2. Build command: `npm install --include=dev && npm run build:server`
3. Start command: `npm start`
4. Environment variable: `CLIENT_URL` set to your Vercel URL, for example `https://your-app.vercel.app`.
5. Optional health check path: `/health`

On the free plan the service sleeps after a period of inactivity, so the first connection can take up to a minute.

### Frontend on Vercel

1. Import the same repository as a new project. Keep the root directory as the repository root. `vercel.json` already sets the build command and the output directory.
2. Environment variable: `VITE_SERVER_URL` set to your Render URL, for example `https://your-backend.onrender.com`.
3. Deploy. If you change `VITE_SERVER_URL` later, redeploy, because it is read at build time.

Vercel only hosts the static client. The Socket.IO server needs a long-running process, which is why it runs on Render.

## How to play

- Move the mouse to steer your blob.
- Run over orbs to grow.
- The larger you get, the slower you move.
- A larger player absorbs a smaller one on contact.

## How it works

The server owns the game state (orbs, players, positions, scores). Clients only render what the server sends.

| Event | Direction | Description |
|---|---|---|
| `init` | client to server | Creates the player and joins the `game` room. The ack returns all orbs and the player's index. |
| `tick` | server to clients | Sends the state of all players, about 30 times per second. |
| `tock` | client to server | Sends the movement direction, about 30 times per second. The server moves the player and runs collision checks. |
| `orbSwitch` | server to clients | An orb was absorbed, replace it with a new one. |
| `playerAbsorbed` | server to clients | One player was absorbed by another. |
| `updateLeaderBoard` | server to clients | Sends the updated leaderboard. |

The tick loop starts when the first player joins and stops when the last one leaves. The event types live in `src/shared/types.ts` and are used by both sides, so a change to an event is checked at compile time everywhere.

## Project structure

```
src/
  shared/
    types.ts                  data and event types used by server and client
  server/
    index.ts                  entry point
    servers.ts                creates Express and Socket.IO (CORS, optional Admin UI)
    expressMain.ts            health check route
    socketMain.ts             game state and socket event handlers
    checkCollisions.ts        orb and player collision logic
    settings.ts               game settings
    utils.ts
    classes/
      Orb.ts
      Player.ts
      PlayerConfig.ts         per-player data only the server needs (speed, zoom, vectors)
      PlayerData.ts           per-player data everyone needs (position, radius, score)
  client/
    index.html
    main.ts                   client entry point
    ui.ts                     login and spawn modals
    socket.ts                 client-side socket events
    canvas.ts                 drawing and mouse input
    hud.ts                    leaderboard and game message
    state.ts                  canvas, context and shared client state
    dom.ts                    small DOM helper
    styles.css
    public/images/            static images
```

## Credits

Based on the Socket.IO course by Robert Bunch.
