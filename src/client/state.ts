import type { OrbData, PublicPlayer } from '../shared/types';
import { qs } from './dom';

// The canvas element and the context we draw with (2d)
export const canvas = qs<HTMLCanvasElement>('#the-canvas');
export const context = canvas.getContext('2d');
if (!context) {
  throw new Error('2d canvas context is not supported');
}

// set the canvas size to the window size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

/** Everything about "this" player on this client. */
export interface ClientPlayer {
  name: string;
  indexInPlayers: number;
  locX: number;
  locY: number;
  xVector?: number;
  yVector?: number;
}

export const player: ClientPlayer = {
  name: '',
  indexInPlayers: -1,
  locX: 0,
  locY: 0,
};

/** Shared, mutable game state. Modules change its properties instead of re-assigning imports. */
export const state: {
  orbs: OrbData[]; // all non-player orbs
  players: PublicPlayer[]; // all players
} = {
  orbs: [],
  players: [],
};
