import { canvas, context, player, state } from './state';

let xVector = 0;
let yVector = 0;

//==========================
//===========DRAW===========
//==========================
export const draw = (): void => {
  // reset the context transform back to default
  context!.setTransform(1, 0, 0, 1, 0, 0);

  // clear the canvas so we can draw on a clean one next frame
  context!.clearRect(0, 0, canvas.width, canvas.height);

  // keep the viewport centered on the player (x, y)
  const camX = -player.locX + canvas.width / 2;
  const camY = -player.locY + canvas.height / 2;

  // translate moves the context to where the player is
  context!.translate(camX, camY);

  // draw all the players
  state.players.forEach((p) => {
    if (!p.playerData) {
      // empty slot: an absorbed player, or one that left. Nothing to draw
      return;
    }
    context!.beginPath();
    context!.fillStyle = p.playerData.color;
    // arc(centerX, centerY, radius, startAngle, endAngle). 0 is at 3 o'clock
    context!.arc(p.playerData.locX, p.playerData.locY, p.playerData.radius, 0, Math.PI * 2);
    context!.fill();
    context!.lineWidth = 3; // border width in pixels
    context!.strokeStyle = 'rgb(0,255,0)'; // green border
    context!.stroke();
  });

  // draw all the orbs
  state.orbs.forEach((orb) => {
    context!.beginPath();
    context!.fillStyle = orb.color;
    context!.arc(orb.locX, orb.locY, orb.radius, 0, Math.PI * 2);
    context!.fill();
  });

  // requestAnimationFrame runs the draw loop once per paint/frame
  requestAnimationFrame(draw);
};

// Turn the mouse position into a movement vector (the angle between the screen center and the mouse)
canvas.addEventListener('mousemove', (event: MouseEvent) => {
  const mousePosition = { x: event.clientX, y: event.clientY };
  const angleDeg =
    (Math.atan2(mousePosition.y - canvas.height / 2, mousePosition.x - canvas.width / 2) * 180) /
    Math.PI;

  if (angleDeg >= 0 && angleDeg < 90) {
    // lower right quadrant
    xVector = 1 - angleDeg / 90;
    yVector = -(angleDeg / 90);
  } else if (angleDeg >= 90 && angleDeg <= 180) {
    // lower left quadrant
    xVector = -(angleDeg - 90) / 90;
    yVector = -(1 - (angleDeg - 90) / 90);
  } else if (angleDeg >= -180 && angleDeg < -90) {
    // top left quadrant
    xVector = (angleDeg + 90) / 90;
    yVector = 1 + (angleDeg + 90) / 90;
  } else if (angleDeg < 0 && angleDeg >= -90) {
    // top right quadrant
    xVector = (angleDeg + 90) / 90;
    yVector = 1 - (angleDeg + 90) / 90;
  }

  player.xVector = xVector ? xVector : 0.1;
  player.yVector = yVector ? yVector : 0.1;
});
