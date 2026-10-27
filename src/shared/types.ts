// Types shared by the server and the client: the shape of the data that goes over the wire.

/** A generic (non-player) orb lying on the map. */
export interface OrbData {
  color: string;
  locX: number;
  locY: number;
  radius: number;
}

/** Everything every player needs to know about every other player. */
export interface PublicPlayerData {
  name: string;
  locX: number;
  locY: number;
  radius: number;
  color: string;
  score: number;
  orbsAbsorbed: number;
  playersAbsorbed: number;
}

/**
 * One slot of the players array sent with every tick.
 * An empty object means the player left or was absorbed. Slots are never removed,
 * because every client remembers its own index in this array.
 */
export interface PublicPlayer {
  playerData?: PublicPlayerData;
}

/** A leaderboard row. Empty object for players that are gone. */
export interface LeaderBoardEntry {
  name?: string;
  score?: number;
}

export interface OrbSwitchData {
  capturedOrbI: number;
  newOrb: OrbData;
}

export interface AbsorbData {
  absorbed: string;
  absorbedBy: string;
}

export interface InitRequest {
  playerName: string;
}

export interface InitResponse {
  orbs: OrbData[];
  indexInPlayers: number;
}

export interface TockData {
  xVector: number;
  yVector: number;
}

export interface ServerToClientEvents {
  tick: (players: PublicPlayer[]) => void;
  orbSwitch: (data: OrbSwitchData) => void;
  playerAbsorbed: (data: AbsorbData) => void;
  updateLeaderBoard: (leaderBoard: LeaderBoardEntry[]) => void;
}

export interface ClientToServerEvents {
  init: (data: InitRequest, ack: (response: InitResponse) => void) => void;
  tock: (data: TockData) => void;
}
