import type { LeaderBoardEntry } from '../shared/types';
import { qs } from './dom';

let messageTimeout: number | undefined;

/** Shows a message at the bottom of the screen for two seconds. */
export function showGameMessage(text: string): void {
  const el = qs('#game-message');
  el.textContent = text; // textContent, not innerHTML: player names are user input
  el.style.opacity = '1';
  window.clearTimeout(messageTimeout);
  messageTimeout = window.setTimeout(() => {
    el.style.opacity = '0';
  }, 2000);
}

/** Redraws the leaderboard and this player's score. */
export function renderLeaderBoard(entries: LeaderBoardEntry[], playerName: string): void {
  const sorted = [...entries].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

  const list = qs('.leader-board');
  list.replaceChildren();
  for (const entry of sorted) {
    if (!entry.name) {
      continue; // empty slot: the player left or was absorbed
    }
    const li = document.createElement('li');
    li.className = 'leaderboard-player';
    li.textContent = `${entry.name} - ${entry.score ?? 0}`;
    list.appendChild(li);
  }

  const me = entries.find((entry) => entry.name === playerName);
  if (me) {
    qs('.player-score').textContent = String(me.score ?? 0);
  }
}
