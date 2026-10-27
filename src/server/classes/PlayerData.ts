import type { PublicPlayerData } from '../../shared/types';
import type { Settings } from '../settings';
import { getRandomColor } from '../utils';

/** Data that everyone needs to know about every player. */
export class PlayerData implements PublicPlayerData {
  name: string;
  locX: number;
  locY: number;
  radius: number;
  color: string;
  score = 0;
  orbsAbsorbed = 0;
  playersAbsorbed = 0;

  constructor(playerName: string, settings: Settings) {
    this.name = playerName;
    this.locX = Math.floor(settings.worldWidth * Math.random() + 10);
    this.locY = Math.floor(settings.worldHeight * Math.random() + 10);
    this.radius = settings.defaultSize;
    this.color = getRandomColor();
  }
}
