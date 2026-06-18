import { 
  OBSTACLE_MIN_SPEED, 
  OBSTACLE_MAX_SPEED, 
  OBSTACLE_SPAWN_INTERVAL,
  COLORS,
  ROAD_LEFT,
  ROAD_RIGHT,
  CANVAS_HEIGHT
} from './constants.js';
import { randomRange, randomInt, drawPixelRect, rectIntersect } from './utils.js';

class Obstacle {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.passed = false;
    this.glowPhase = Math.random() * Math.PI * 2;
    
    if (type === 'box') {
      this.width = 48;
      this.height = 48;
      this.speed = randomRange(OBSTACLE_MIN_SPEED, OBSTACLE_MAX_SPEED * 0.8);
    } else {
      this.width = 56;
      this.height = 96;
      this.speed = randomRange(OBSTACLE_MIN_SPEED * 1.2, OBSTACLE_MAX_SPEED);
    }
  }

  update(speedMultiplier, deltaTime) {
    this.y += this.speed * speedMultiplier;
    this.glowPhase += deltaTime * 0.005;
  }

  isOffScreen() {
    return this.y > CANVAS_HEIGHT + 50;
  }

  getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }

  render(ctx) {
    if (this.type === 'box') {
      this._renderBox(ctx);
    } else {
      this._renderTruck(ctx);
    }
  }

  _renderBox(ctx) {
    const glowIntensity = Math.sin(this.glowPhase) * 0.3 + 0.7;

    drawPixelRect(ctx, this.x, this.y, this.width, this.height, '#2a0a4a', null);

    ctx.save();
    ctx.shadowColor = COLORS.NEON_PURPLE;
    ctx.shadowBlur = 12 * glowIntensity;
    ctx.strokeStyle = COLORS.NEON_PURPLE;
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    ctx.restore();

    for (let i = 0; i < this.width; i += 12) {
      const isYellow = Math.floor(i / 12) % 2 === 0;
      const color = isYellow ? COLORS.NEON_YELLOW : '#111111';
      const glow = isYellow ? COLORS.NEON_YELLOW : null;
      drawPixelRect(ctx, this.x + i, this.y + 2, 12, 6, color, glow, 4);
      drawPixelRect(ctx, this.x + i, this.y + this.height - 8, 12, 6, color, glow, 4);
    }

    for (let i = 0; i < this.height; i += 12) {
      const isYellow = Math.floor(i / 12) % 2 === 0;
      const color = isYellow ? COLORS.NEON_YELLOW : '#111111';
      const glow = isYellow ? COLORS.NEON_YELLOW : null;
      drawPixelRect(ctx, this.x + 2, this.y + i, 6, 12, color, glow, 4);
      drawPixelRect(ctx, this.x + this.width - 8, this.y + i, 6, 12, color, glow, 4);
    }

    drawPixelRect(ctx, this.x + 18, this.y + 18, 12, 12, COLORS.NEON_RED, COLORS.NEON_RED, 6);
  }

  _renderTruck(ctx) {
    const glowIntensity = Math.sin(this.glowPhase * 1.5) * 0.3 + 0.7;

    drawPixelRect(ctx, this.x, this.y, this.width, this.height, '#3a0a1a', null);

    ctx.save();
    ctx.shadowColor = COLORS.NEON_RED;
    ctx.shadowBlur = 14 * glowIntensity;
    ctx.strokeStyle = COLORS.NEON_RED;
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    ctx.restore();

    drawPixelRect(ctx, this.x + 4, this.y + 4, this.width - 8, 20, '#0a0a2a', null);
    ctx.save();
    ctx.shadowColor = COLORS.NEON_CYAN;
    ctx.shadowBlur = 8;
    ctx.strokeStyle = COLORS.NEON_CYAN;
    ctx.lineWidth = 1;
    ctx.strokeRect(this.x + 4, this.y + 4, this.width - 8, 20);
    ctx.restore();

    const headlightGlow = Math.sin(this.glowPhase * 3) * 0.3 + 0.7;
    ctx.save();
    ctx.shadowColor = COLORS.NEON_YELLOW;
    ctx.shadowBlur = 15 * headlightGlow;
    ctx.fillStyle = COLORS.NEON_YELLOW;
    ctx.fillRect(this.x + 8, this.y + 8, 8, 8);
    ctx.fillRect(this.x + this.width - 16, this.y + 8, 8, 8);
    ctx.restore();

    drawPixelRect(ctx, this.x + 6, this.y + 30, this.width - 12, 24, COLORS.NEON_RED, null);
    drawPixelRect(ctx, this.x + 6, this.y + 58, this.width - 12, 20, '#2a0a1a', null);

    ctx.save();
    ctx.shadowColor = COLORS.NEON_ORANGE;
    ctx.shadowBlur = 8;
    ctx.fillStyle = COLORS.NEON_ORANGE;
    for (let i = 0; i < 3; i++) {
      ctx.fillRect(this.x + 10 + i * 12, this.y + 36, 8, 12);
    }
    ctx.restore();

    drawPixelRect(ctx, this.x + 4, this.y + 30, 3, 48, COLORS.NEON_RED, COLORS.NEON_RED, 6);
    drawPixelRect(ctx, this.x + this.width - 7, this.y + 30, 3, 48, COLORS.NEON_RED, COLORS.NEON_RED, 6);

    ctx.save();
    ctx.shadowColor = COLORS.NEON_RED;
    ctx.shadowBlur = 10;
    ctx.fillStyle = COLORS.NEON_RED;
    ctx.fillRect(this.x + 12, this.y + this.height - 10, 8, 6);
    ctx.fillRect(this.x + this.width - 20, this.y + this.height - 10, 8, 6);
    ctx.restore();

    drawPixelRect(ctx, this.x + 16, this.y + 62, 24, 12, '#111111', null);
    ctx.save();
    ctx.shadowColor = COLORS.NEON_YELLOW;
    ctx.shadowBlur = 6;
    ctx.fillStyle = COLORS.NEON_YELLOW;
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('!!!', this.x + this.width / 2, this.y + 64);
    ctx.restore();
  }
}

export class ObstacleManager {
  constructor() {
    this.obstacles = [];
    this.lastSpawnTime = 0;
    this.spawnInterval = OBSTACLE_SPAWN_INTERVAL;
    this.speedMultiplier = 1;
  }

  reset() {
    this.obstacles = [];
    this.lastSpawnTime = 0;
    this.speedMultiplier = 1;
  }

  setDifficulty(score) {
    this.speedMultiplier = 1 + Math.min(score / 500, 1.5);
    this.spawnInterval = Math.max(500, OBSTACLE_SPAWN_INTERVAL - score * 2);
  }

  update(currentTime, deltaTime) {
    if (currentTime - this.lastSpawnTime > this.spawnInterval) {
      this._spawn();
      this.lastSpawnTime = currentTime;
    }

    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obs = this.obstacles[i];
      obs.update(this.speedMultiplier, deltaTime);
      if (obs.isOffScreen()) {
        this.obstacles.splice(i, 1);
      }
    }
  }

  _spawn() {
    const type = Math.random() > 0.4 ? 'box' : 'truck';
    const width = type === 'box' ? 48 : 56;
    const x = randomRange(ROAD_LEFT + 8, ROAD_RIGHT - width - 8);
    const y = -100;
    
    const newObs = new Obstacle(x, y, type);
    
    const hasOverlap = this.obstacles.some(obs => {
      const distance = Math.abs(obs.y - newObs.y);
      return distance < 120 && rectIntersect(newObs.getBounds(), obs.getBounds());
    });
    
    if (!hasOverlap) {
      this.obstacles.push(newObs);
    }
  }

  checkPassed(playerY) {
    let scoreGain = 0;
    this.obstacles.forEach(obs => {
      if (!obs.passed && obs.y > playerY + obs.height) {
        obs.passed = true;
        scoreGain += 1;
      }
    });
    return scoreGain;
  }

  checkCollisions(playerBounds) {
    return this.obstacles.some(obs => rectIntersect(playerBounds, obs.getBounds()));
  }

  render(ctx) {
    this.obstacles.forEach(obs => obs.render(ctx));
  }

  getObstacles() {
    return this.obstacles;
  }
}
