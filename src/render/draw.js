export function drawScene(ctx, width, height, ship, world) {
  ctx.clearRect(0, 0, width, height);

  ctx.fillStyle = '#050816';
  ctx.fillRect(0, 0, width, height);

  drawStars(ctx, width, height);
  drawGrid(ctx, width, height);

  for (const entity of world) {
    if (entity.kind === 'asteroid') {
      drawAsteroid(ctx, entity);
    }

    if (entity.kind === 'bullet') {
      drawBullet(ctx, entity);
    }

    if (entity.kind === 'explosion') {
      drawExplosionParticle(ctx, entity);
    }

    if (entity.kind === 'pickup') {
      drawPickup(ctx, entity);
    }
  }

  drawShip(ctx, ship);
}

function drawStars(ctx, width, height) {
  ctx.fillStyle = 'white';

  for (let x = 30; x < width; x += 100) {
    for (let y = 30; y < height; y += 100) {
      ctx.fillRect(x, y, 2, 2);
    }
  }
}

function drawGrid(ctx, width, height) {
  const size = 50;

  ctx.strokeStyle = '#172033';
  ctx.lineWidth = 1;

  for (let x = 0; x <= width; x += size) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  for (let y = 0; y <= height; y += size) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
}

function drawShip(ctx, ship) {
  if (!ship) {
    return;
  }

  ctx.save();

  ctx.translate(ship.x, ship.y);
  ctx.rotate(ship.angle);

  ctx.beginPath();
  ctx.moveTo(22, 0);
  ctx.lineTo(-15, -12);
  ctx.lineTo(-10, 0);
  ctx.lineTo(-15, 12);
  ctx.closePath();

  ctx.fillStyle = 'white';
  ctx.fill();

  if (ship.thrust) {
    ctx.beginPath();
    ctx.moveTo(-10, -6);
    ctx.lineTo(-28, 0);
    ctx.lineTo(-10, 6);
    ctx.closePath();

    ctx.fillStyle = 'orange';
    ctx.fill();
  }

  ctx.restore();
}

function drawBullet(ctx, bullet) {
  ctx.beginPath();

  ctx.arc(
    bullet.pos.x,
    bullet.pos.y,
    bullet.radius,
    0,
    Math.PI * 2
  );

  ctx.fillStyle = 'yellow';
  ctx.fill();
}

function drawAsteroid(ctx, asteroid) {
  ctx.beginPath();

  ctx.arc(
    asteroid.pos.x,
    asteroid.pos.y,
    asteroid.radius,
    0,
    Math.PI * 2
  );

  ctx.strokeStyle = 'gray';
  ctx.lineWidth = 3;
  ctx.stroke();
}

function drawExplosionParticle(ctx, particle) {
  const alpha = particle.ttl / 0.5;

  ctx.globalAlpha = alpha;

  ctx.beginPath();

  ctx.arc(
    particle.pos.x,
    particle.pos.y,
    particle.radius,
    0,
    Math.PI * 2
  );

  ctx.fillStyle = 'orange';
  ctx.fill();

  ctx.globalAlpha = 1;
}

function drawPickup(ctx, pickup) {
  ctx.beginPath();

  ctx.arc(
    pickup.pos.x,
    pickup.pos.y,
    pickup.radius,
    0,
    Math.PI * 2
  );

  ctx.strokeStyle = 'cyan';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.beginPath();

  ctx.moveTo(
    pickup.pos.x - 7,
    pickup.pos.y
  );

  ctx.lineTo(
    pickup.pos.x + 7,
    pickup.pos.y
  );

  ctx.moveTo(
    pickup.pos.x,
    pickup.pos.y - 7
  );

  ctx.lineTo(
    pickup.pos.x,
    pickup.pos.y + 7
  );

  ctx.stroke();
}