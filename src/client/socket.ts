import { io, type Socket } from 'socket.io-client';
import type { ClientToServerEvents, ServerToClientEvents } from '../shared/types';
import { draw } from './canvas';
import { renderLeaderBoard, showGameMessage } from './hud';
import { player, state } from './state';

// the Socket.IO server: localhost in development, the deployed backend in production (set VITE_SERVER_URL)
const SERVER_URL: string = import.meta.env.VITE_SERVER_URL ?? 'http://localhost:9000';

// connect to the socket server
export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(SERVER_URL);

/** Called when the player clicks "play": joins the game and starts the tock and draw loops. */
export const init = async (): Promise<void> => {
  const initData = await socket.emitWithAck('init', { playerName: player.name });

  // the ack has resolved, so start "tocking": tell the server where we want to move, ~30 times per second
  setInterval(() => {
    socket.emit('tock', {
      xVector: player.xVector ? player.xVector : 0.1,
      yVector: player.yVector ? player.yVector : 0.1,
    });
  }, 33);

  state.orbs = initData.orbs;
  player.indexInPlayers = initData.indexInPlayers;
  draw(); // starts the draw loop (canvas.ts)
};

// the server sends the location/data of all players ~30 times per second
socket.on('tick', (playersArray) => {
  state.players = playersArray;
  const me = state.players[player.indexInPlayers]?.playerData;
  if (me) {
    player.locX = me.locX;
    player.locY = me.locY;
  }
});

socket.on('orbSwitch', ({ capturedOrbI, newOrb }) => {
  // an orb was absorbed: replace it in the orbs array
  state.orbs.splice(capturedOrbI, 1, newOrb);
});

socket.on('playerAbsorbed', ({ absorbed, absorbedBy }) => {
  showGameMessage(`${absorbed} was absorbed by ${absorbedBy}`);
});

socket.on('updateLeaderBoard', (leaderBoard) => {
  renderLeaderBoard(leaderBoard, player.name);
});
