import { Modal } from 'bootstrap';
import { qs } from './dom';
import { init } from './socket';
import { player } from './state';

const MAX_NAME_LENGTH = 20;

// put the modals into variables so we can interact with them
const loginModal = new Modal(qs('#loginModal'));
const spawnModal = new Modal(qs('#spawnModal'));

// on page load, open the login modal
window.addEventListener('load', () => {
  loginModal.show();
});

qs<HTMLFormElement>('.name-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = qs<HTMLInputElement>('#name-input').value.trim().slice(0, MAX_NAME_LENGTH);
  if (!name) {
    return;
  }
  player.name = name;
  qs('.player-name').textContent = player.name;
  loginModal.hide();
  spawnModal.show();
});

qs('.start-game').addEventListener('click', () => {
  // hide the start modal
  spawnModal.hide();
  // show the elements that are hidden until the game starts
  document.querySelectorAll('.hiddenOnStart').forEach((el) => el.removeAttribute('hidden'));
  void init(); // join the game (socket.ts)
});
