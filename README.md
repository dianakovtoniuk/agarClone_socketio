# Agar Clone

A multiplayer clone of agar.io built with Node.js, Express, Socket.IO and the HTML canvas API. Players move blobs around a shared world, absorb orbs to grow, and eat smaller players.

Built as a practice project while following the Udemy course "SocketIO v4, with websockets - the details" by Robert Bunch.

## Features

- Real-time multiplayer over WebSockets
- Server-authoritative game state: the client only sends movement input
- 5000 orbs spread across the world, respawned when absorbed
- Mouse-controlled movement, with larger players moving slower
- Camera that follows the player
- Orb and player collision detection (AABB check followed by a distance check)
- Live leaderboard and score
- Socket.IO Admin UI for inspecting connections and events

## Tech stack

- Node.js
- Express
- Socket.IO
- HTML5 canvas
- Bootstrap 5 (modals)

## Getting started

Requirements: Node.js 18 or newer.

```bash
npm install
npm start
```

Open http://localhost:9000 in two or more browser tabs to play against yourself.

## How to play

- Move the mouse to steer your blob.
- Run over orbs to grow.
- The larger you get, the slower you move.
- A larger player absorbs a smaller one on contact.

## How it works

The server owns the game state (orbs, players, positions, scores). Clients render whatever the server sends.

| Event | Direction | Description |
|---|---|---|
| `init` | client to server | Creates the player and joins the `game` room. The ack returns all orbs and the player's index. |
| `tick` | server to clients | Sends the positions of all players, 30 times per second. |
| `tock` | client to server | Sends the movement vector, 30 times per second. The server moves the player and runs collision checks. |
| `orbSwitch` | server to clients | An orb was absorbed, replace it with a new one. |
| `playerAbsorbed` | server to clients | One player was absorbed by another. |
| `updateLeaderBoard` | server to clients | Sends the updated leaderboard. |

The tick loop starts when the first player joins and stops when the last one leaves.

## Project structure

```
agarClone/
  index.js                    entry point
  servers.js                  creates Express and Socket.IO, enables Admin UI
  expressStuff/
    expressMain.js            static file serving
  socketStuff/
    socketMain.js             socket event handlers and game state
    checkCollisions.js        orb and player collision logic
    classes/
      Orb.js
      Player.js
      PlayerConfig.js         private per-player data (speed, zoom, vectors)
      PlayerData.js           public per-player data (position, radius, score)
  public/
    index.html
    styles.css
    uiStuff.js                modals and UI state
    canvasStuff.js            drawing and mouse input
    socketStuff.js            client-side socket events
```

## Admin UI

The Socket.IO Admin UI is enabled in `servers.js`. Open https://admin.socket.io, set the server URL to `http://localhost:9000` and sign in with the credentials configured in `servers.js`. Change them before deploying anywhere.
