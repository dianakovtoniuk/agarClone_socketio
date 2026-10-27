import type { OrbData } from '../../shared/types';
import type { Settings } from '../settings';
import { getRandomColor } from '../utils';

export class Orb implements OrbData {
  color: string;
  locX: number;
  locY: number;
  radius: number;

  constructor(settings: Settings) {
    this.color = getRandomColor();
    this.locX = Math.floor(Math.random() * settings.worldWidth);
    this.locY = Math.floor(Math.random() * settings.worldHeight);
    this.radius = settings.defaultGenericOrbSize;
  }
}
