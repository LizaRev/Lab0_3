let scoreElement = null;
let hpElement = null;
let stepsElement = null;
let fpsElement = null;
let frameTimeElement = null;

export function initHud(world) {

  const hud = document.createElement("div");

  hud.style.position = "fixed";
  hud.style.top = "20px";
  hud.style.left = "20px";

  hud.style.padding = "14px 18px";

  hud.style.background =
    "rgba(10, 8, 30, 0.75)";

  hud.style.border =
    "1px solid rgba(180, 150, 255, 0.35)";

  hud.style.borderRadius = "12px";

  hud.style.backdropFilter =
    "blur(8px)";

  hud.style.webkitBackdropFilter =
    "blur(8px)";

  hud.style.color = "white";

  hud.style.font =
    "15px Arial, sans-serif";

  hud.style.lineHeight = "1.7";

  hud.style.zIndex = "500";

  hud.style.minWidth = "150px";

  hud.style.boxSizing = "border-box";

  scoreElement =
    document.createElement("div");

  scoreElement.textContent =
    "Score: 0";

  hpElement =
    document.createElement("div");

  hpElement.textContent =
    "HP: 3";

  stepsElement =
    document.createElement("div");

  stepsElement.textContent =
    "Steps/s: 0";

  fpsElement =
    document.createElement("div");

  fpsElement.textContent =
    "FPS: 0";

  frameTimeElement =
    document.createElement("div");

  frameTimeElement.textContent =
    "Frame Time: 0.00 ms";

  hud.appendChild(scoreElement);
  hud.appendChild(hpElement);
  hud.appendChild(stepsElement);
  hud.appendChild(fpsElement);
  hud.appendChild(frameTimeElement);

  document.body.appendChild(hud);

  world.addEventListener(
    "scoreChanged",
    (event) => {

      scoreElement.textContent =
        `Score: ${event.detail.score}`;

    }
  );

  return {

    update(ship, stats) {

      if (ship) {

        hpElement.textContent =
          `HP: ${ship.hp}`;

      } else {

        hpElement.textContent =
          "HP: 0";

      }

      stepsElement.textContent =
        `Steps/s: ${stats.stepsPerSecond}`;

      fpsElement.textContent =
        `FPS: ${stats.framesPerSecond}`;

      frameTimeElement.textContent =
        `Frame Time: ${stats.lastFrameDuration.toFixed(2)} ms`;

    },

    destroy() {

      hud.remove();

      scoreElement = null;
      hpElement = null;
      stepsElement = null;
      fpsElement = null;
      frameTimeElement = null;

    }

  };

}

