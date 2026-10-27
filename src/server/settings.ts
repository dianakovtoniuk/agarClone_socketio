export interface Settings {
  defaultNumberOfOrbs: number; // number of orbs on the map
  defaultSpeed: number; // player speed
  defaultSize: number; // starting player radius
  defaultZoom: number; // as the player gets bigger, the zoom needs to go out
  worldWidth: number;
  worldHeight: number;
  defaultGenericOrbSize: number; // smaller than player orbs
}

export const settings: Settings = {
  defaultNumberOfOrbs: 5000,
  defaultSpeed: 6,
  defaultSize: 6,
  defaultZoom: 1.5,
  worldWidth: 5000,
  worldHeight: 5000,
  defaultGenericOrbSize: 5,
};
