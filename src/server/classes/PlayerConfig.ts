import type { Settings } from '../settings';

/** Data only the server (and the player themself) cares about. */
export class PlayerConfig {
  xVector = 0;
  yVector = 0;
  speed: number;
  zoom: number;

  constructor(settings: Settings) {
    this.speed = settings.defaultSpeed;
    this.zoom = settings.defaultZoom;
  }
}
