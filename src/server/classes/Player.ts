import type { PlayerConfig } from './PlayerConfig';
import type { PlayerData } from './PlayerData';

/** Everything the server stores about one connected player. */
export class Player {
  /** false once the player was absorbed or has disconnected */
  alive = true;

  constructor(
    public readonly socketId: string,
    public readonly playerConfig: PlayerConfig,
    public readonly playerData: PlayerData,
  ) {}
}
