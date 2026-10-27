import type { AbsorbData, PublicPlayer } from '../shared/types';
import type { Orb } from './classes/Orb';
import type { Player } from './classes/Player';
import type { PlayerConfig } from './classes/PlayerConfig';
import type { PlayerData } from './classes/PlayerData';

/**
 * Checks whether the player touches any orb.
 * Returns the index of the orb that was absorbed, or null when there is no collision.
 */
export const checkForOrbCollisions = (
  pData: PlayerData,
  pConfig: PlayerConfig,
  orbs: Orb[],
): number | null => {
  for (let i = 0; i < orbs.length; i++) {
    const orb = orbs[i];

    // AABB test (square) - axis-aligned bounding boxes, cheap check first
    if (
      pData.locX + pData.radius + orb.radius > orb.locX &&
      pData.locX < orb.locX + pData.radius + orb.radius &&
      pData.locY + pData.radius + orb.radius > orb.locY &&
      pData.locY < orb.locY + pData.radius + orb.radius
    ) {
      // Pythagoras test (circle)
      const distance = Math.sqrt(
        (pData.locX - orb.locX) * (pData.locX - orb.locX) +
          (pData.locY - orb.locY) * (pData.locY - orb.locY),
      );
      if (distance < pData.radius + orb.radius) {
        // COLLISION
        pData.score += 1;
        pData.orbsAbsorbed += 1;
        if (pConfig.zoom > 1) {
          pConfig.zoom -= 0.001; // zoom out so the player doesn't get too big for the screen
        }
        pData.radius += 0.05; // grow
        if (pConfig.speed < -0.005) {
          pConfig.speed += 0.005; // slow down
        } else if (pConfig.speed > 0.005) {
          pConfig.speed -= 0.005;
        }
        // a player can't hit more than one orb per tock
        return i;
      }
    }
  }
  return null;
};

/**
 * Checks whether the tocking player absorbs another player.
 * Only the bigger player can absorb the smaller one, and only on the bigger player's own tock.
 * Returns info about the absorption, or null when nothing happened.
 */
export const checkForPlayerCollisions = (
  pData: PlayerData,
  pConfig: PlayerConfig,
  players: Array<Player | null>,
  playersForUsers: PublicPlayer[],
  playerId: string,
): AbsorbData | null => {
  for (let i = 0; i < players.length; i++) {
    const p = players[i];
    // empty slots belong to players that have left
    if (!p || p.socketId === playerId) {
      continue;
    }
    const pLocX = p.playerData.locX;
    const pLocY = p.playerData.locY;
    const pR = p.playerData.radius;

    // AABB test - axis-aligned bounding boxes
    if (
      pData.locX + pData.radius + pR > pLocX &&
      pData.locX < pLocX + pData.radius + pR &&
      pData.locY + pData.radius + pR > pLocY &&
      pData.locY < pLocY + pData.radius + pR
    ) {
      // Pythagoras test
      const distance = Math.sqrt(
        (pData.locX - pLocX) * (pData.locX - pLocX) + (pData.locY - pLocY) * (pData.locY - pLocY),
      );
      if (distance < pData.radius + pR && pData.radius > pR) {
        // ENEMY DEATH
        pData.score += p.playerData.score + 10;
        pData.playersAbsorbed += 1;
        p.alive = false;
        pData.radius += p.playerData.radius * 0.25;
        const collisionData: AbsorbData = {
          absorbed: p.playerData.name,
          absorbedBy: pData.name,
        };
        if (pConfig.zoom > 1) {
          pConfig.zoom -= pR * 0.25 * 0.001;
        }
        players[i] = null; // remove the player from the server's players array
        playersForUsers[i] = {}; // ...and from the array that is sent to the clients
        return collisionData;
      }
    }
  }
  return null;
};
