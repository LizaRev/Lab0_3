import { createLoop } from './loop.js';
import { createInput } from './input.js';

import { Ship } from './sim/ship.js';
import { Asteroid } from './sim/asteroid.js';
import { Pickup } from './sim/pickup.js';
import { World } from './sim/world.js';
import { attachHoming } from './sim/homing.js';

import { wrapShip } from './sim/arena.js';

import { createCanvas } from './render/canvas.js';
import { drawScene } from './render/draw.js';

const input = createInput(window);
const canvas = createCanvas();
const world = new World();

const firstShip = new Ship(
  canvas.width / 2,
  canvas.height / 2
);

world.spawn(firstShip);

const asteroid = new Asteroid(
  200,
  200,
  100,
  80,
  30
);

world.spawn(asteroid);

attachHoming(asteroid, firstShip);

const secondAsteroid = new Asteroid(
  600,
  350,
  -80,
  -60,
  30
);

world.spawn(secondAsteroid);

const pickup = new Pickup(
  600,
  300,
  'shield'
);

world.spawn(pickup);

let previous = {
  x: firstShip.pos.x,
  y: firstShip.pos.y,
  angle: firstShip.angle,
  thrust: firstShip.thrust
};

function getShip() {
  for (const ship of world.ofKind('ship')) {
    return ship;
  }

  return null;
}

function lerp(a, b, alpha) {
  return a + (b - a) * alpha;
}

function lerpAngle(a, b, alpha) {
  const twoPi = Math.PI * 2;

  let difference =
    (b - a) % twoPi;

  if (difference > Math.PI) {
    difference -= twoPi;
  }

  if (difference < -Math.PI) {
    difference += twoPi;
  }

  return a + difference * alpha;
}

const hud = document.createElement('div');

hud.style.position = 'fixed';
hud.style.top = '10px';
hud.style.left = '10px';
hud.style.padding = '10px';
hud.style.background = 'rgba(0, 0, 0, 0.7)';
hud.style.color = 'white';
hud.style.fontFamily = 'monospace';
hud.style.whiteSpace = 'pre';

document.body.appendChild(hud);

function render(alpha) {
  const ship = getShip();

  if (ship) {
    const renderedShip = {
      x: lerp(
        previous.x,
        ship.pos.x,
        alpha
      ),

      y: lerp(
        previous.y,
        ship.pos.y,
        alpha
      ),

      angle: lerpAngle(
        previous.angle,
        ship.angle,
        alpha
      ),

      thrust: ship.thrust
    };

    drawScene(
      canvas.ctx,
      canvas.width,
      canvas.height,
      renderedShip,
      world
    );

    previous = {
      x: ship.pos.x,
      y: ship.pos.y,
      angle: ship.angle,
      thrust: ship.thrust
    };
  } else {
    drawScene(
      canvas.ctx,
      canvas.width,
      canvas.height,
      null,
      world
    );
  }

  const stats = loop.getStats();

  const shipHp = ship ? ship.hp : 0;

  hud.textContent =
    `Score: ${world.score}\n` +
    `HP: ${shipHp}\n` +
    `Steps/s: ${stats.stepsPerSecond}\n` +
    `FPS: ${stats.framesPerSecond}\n` +
    `Frame time: ${stats.lastFrameDuration.toFixed(4)} ms`;
}

const loop = createLoop({
  step: 1 / 60,

  simulate(dt) {
    const ship = getShip();

    if (ship) {
      previous = {
        x: ship.pos.x,
        y: ship.pos.y,
        angle: ship.angle,
        thrust: ship.thrust
      };

      if (input.justPressed('Space')) {
        ship.fire();
      }

      wrapShip(
        ship,
        canvas.width,
        canvas.height
      );
    }

    const inputs = {
      input,
      width: canvas.width,
      height: canvas.height
    };

    world.step(dt, inputs);

    input.endFrame();
  },

  render
});

loop.start();