// Where all our socket stuff lives: the game state and every socket event handler.
import { io } from './servers';
import { settings } from './settings';
import { checkForOrbCollisions, checkForPlayerCollisions } from './checkCollisions';
import { Orb } from './classes/Orb';
import { Player } from './classes/Player';
import { PlayerConfig } from './classes/PlayerConfig';
import { PlayerData } from './classes/PlayerData';
import type { LeaderBoardEntry, PublicPlayer } from '../shared/types';

const MAX_NAME_LENGTH = 20;
const TICK_INTERVAL_MS = 33; // 1000 / 30 = ~30 ticks per second

// Game state. The server is the single source of truth.
const orbs: Orb[] = []; // every orb that is not a player; one is replaced each time it is absorbed
const players: Array<Player | null> = []; // server use only; null = the player left or was absorbed
const playersForUsers: PublicPlayer[] = []; // what the clients get; {} = the player left or was absorbed
let activePlayers = 0; // sockets that joined the game and have not disconnected yet
let tickTockInterval: NodeJS.Timeout | undefined;

// on server start, create the initial orbs
initGame();

io.on('connect', (socket) => {
  // the player that belongs to this socket, set once the client sends "init"
  let player: Player | null = null;

  socket.on('init', (playerObj, ackCallback) => {
    if (player) {
      // this socket already joined
      ackCallback({ orbs, indexInPlayers: players.indexOf(player) });
      return;
    }

    // someone is about to join: start tick-tocking if nobody else is playing
    if (activePlayers === 0) {
      startTicking();
    }
    activePlayers++;

    socket.join('game'); // add this socket to the "game" room

    const playerName = String(playerObj?.playerName ?? '').slice(0, MAX_NAME_LENGTH) || 'Player';
    const playerConfig = new PlayerConfig(settings); // data only this player needs
    const playerData = new PlayerData(playerName, settings); // data everyone needs
    player = new Player(socket.id, playerConfig, playerData);
    players.push(player);
    playersForUsers.push({ playerData });

    ackCallback({ orbs, indexInPlayers: playersForUsers.length - 1 });
  });

  // the client sends a "tock" ~30 times per second with the direction it wants to move
  socket.on('tock', (data) => {
    // a tock can arrive before init, or after the player was absorbed / disconnected
    if (!player || !player.alive) {
      return;
    }
    if (!Number.isFinite(data?.xVector) || !Number.isFinite(data?.yVector)) {
      return;
    }

    const { playerConfig, playerData } = player;
    const speed = playerConfig.speed;
    const xV = (playerConfig.xVector = data.xVector);
    const yV = (playerConfig.yVector = data.yVector);

    // if the player can move in x, move
    if ((playerData.locX > 5 && xV < 0) || (playerData.locX < settings.worldWidth && xV > 0)) {
      playerData.locX += speed * xV;
    }
    // if the player can move in y, move
    if ((playerData.locY > 5 && yV > 0) || (playerData.locY < settings.worldHeight && yV < 0)) {
      playerData.locY -= speed * yV;
    }

    // did the tocking player hit an orb?
    const capturedOrbI = checkForOrbCollisions(playerData, playerConfig, orbs);
    if (capturedOrbI !== null) {
      // the index can be 0, so compare with null explicitly
      orbs.splice(capturedOrbI, 1, new Orb(settings));
      io.to('game').emit('orbSwitch', { capturedOrbI, newOrb: orbs[capturedOrbI] });
      io.to('game').emit('updateLeaderBoard', getLeaderBoard()); // someone just scored
    }

    // did the tocking player absorb another player?
    const absorbData = checkForPlayerCollisions(
      playerData,
      playerConfig,
      players,
      playersForUsers,
      socket.id,
    );
    if (absorbData) {
      io.to('game').emit('playerAbsorbed', absorbData);
      io.to('game').emit('updateLeaderBoard', getLeaderBoard());
    }
  });

  socket.on('disconnect', () => {
    if (!player) {
      return; // never joined the game
    }
    // free this player's slot (it may already be empty if they were absorbed)
    const index = players.indexOf(player);
    if (index !== -1) {
      players[index] = null;
      playersForUsers[index] = {};
    }
    player.alive = false;
    player = null;

    // when the last player leaves, stop ticking
    activePlayers--;
    if (activePlayers === 0) {
      stopTicking();
    }
  });
});

function initGame(): void {
  for (let i = 0; i < settings.defaultNumberOfOrbs; i++) {
    orbs.push(new Orb(settings));
  }
}

function startTicking(): void {
  // issue a "tick" to EVERY socket in the game room, ~30 times per second
  tickTockInterval = setInterval(() => {
    io.to('game').emit('tick', playersForUsers);
  }, TICK_INTERVAL_MS);
}

function stopTicking(): void {
  clearInterval(tickTockInterval);
  tickTockInterval = undefined;
}

function getLeaderBoard(): LeaderBoardEntry[] {
  return players.map((curPlayer) =>
    curPlayer ? { name: curPlayer.playerData.name, score: curPlayer.playerData.score } : {},
  );
}
