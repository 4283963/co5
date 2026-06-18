import { PLAYER_WIDTH, PLAYER_HEIGHT, PLAYER_SPEED, COLORS, ROAD_LEFT, ROAD_RIGHT, CANVAS_HEIGHT } from './constants.js';
import { clamp, drawPixelRect } from './utils.js';

export class Player {
  constructor(x, y) {
    this.startX = x;
    this.startY = y;
    this.x = x;
    this.y = y;
    this.width = PLAYER_WIDTH;
    this.height = PLAYER_HEIGHT;
    this.speed = PLAYER_SPEED;
    this.vx = 0;
    this.tiltAngle = 0;
    this.exhaustParticles = [];
    this.glowPhase = 0;
  }

  reset() {
    this.x = this.startX;
    this.y = this.startY;
    this.vx = 0;
    this.tiltAngle = 0;
    this.exhaustParticles = [];
  }

  moveLeft() {
    this.vx = -this.speed;
  }

  moveRight() {
    this.vx = this.speed;
  }

  stop() {
    this.vx = 0;
  }

  update(deltaTime) {
    this.x += this.vx;

    this.x = clamp(this.x, ROAD_LEFT + 4, ROAD_RIGHT - this.width - 4);

    this.tiltAngle = this.vx * 0.05;
    this.tiltAngle = clamp(this.tiltAngle, -0.25, 0.25);

    this.glowPhase += deltaTime * 0.01;

    if (this.vx !== 0 || Math.random() > 0.3) {
      this._addExhaustParticle();
    }

    this._updateExhaustParticles();
  }

  _addExhaustParticle() {
    this.exhaustParticles.push({
      x: this.x + this.width / 2 + (Math.random() - 0.5) * 10,
      y: this.y + this.height - 5,
      vy: 2 + Math.random() * 2,
      size: 3 + Math.random() * 4,
      life: 1,
      color: Math.random() > 0.5 ? COLORS.NEON_PINK : COLORS.NEON_ORANGE
    });
  }

  _updateExhaustParticles() {
    for (let i = this.exhaustParticles.length - 1; i >= 0; i--) {
      const p = this.exhaustParticles[i];
      p.y += p.vy;
      p.life -= 0.04;
      p.size *= 0.97;
      if (p.life <= 0) {
        this.exhaustParticles.splice(i, 1);
      }
    }
  }

  getBounds() {
    return {
      x: this.x + 4,
      y: this.y + 8,
      width: this.width - 8,
      height: this.height - 12
    };
  }

  render(ctx) {
    this._renderExhaust(ctx);

    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.rotate(this.tiltAngle);
    ctx.translate(-this.width / 2, -this.height / 2);

    this._renderMotorcycle(ctx);

    ctx.restore();
  }

  _renderMotorcycle(ctx) {
    const glowIntensity = Math.sin(this.glowPhase) * 0.3 + 0.7;

    drawPixelRect(ctx, 8, 50, 32, 8, COLORS.NEON_PURPLE, COLORS.NEON_PURPLE, 6);

    drawPixelRect(ctx, 16, 40, 16, 28, COLORS.NEON_CYAN, COLORS.NEON_CYAN, 8);

    drawPixelRect(ctx, 18, 30, 12, 14, '#003344', null);
    ctx.save();
    ctx.shadowColor = COLORS.NEON_CYAN;
    ctx.shadowBlur = 8 * glowIntensity;
    ctx.strokeStyle = COLORS.NEON_CYAN;
    ctx.lineWidth = 1;
    ctx.strokeRect(18, 30, 12, 14);
    ctx.restore();

    drawPixelRect(ctx, 16, 8, 16, 8, COLORS.NEON_CYAN, COLORS.NEON_CYAN, 6);
    drawPixelRect(ctx, 14, 12, 20, 6, COLORS.NEON_CYAN, null);

    drawPixelRect(ctx, 22, 2, 4, 12, COLORS.NEON_YELLOW, COLORS.NEON_YELLOW, 8);

    drawPixelRect(ctx, 6, 8, 6, 12, '#222222', null);
    drawPixelRect(ctx, 7, 10, 4, 8, COLORS.NEON_YELLOW, COLORS.NEON_YELLOW, 4);

    drawPixelRect(ctx, 36, 50, 6, 12, '#222222', null);
    drawPixelRect(ctx, 37, 52, 4, 8, COLORS.NEON_RED, COLORS.NEON_RED, 6);

    drawPixelRect(ctx, 6, 54, 8, 14, '#111111', null);
    ctx.save();
    ctx.shadowColor = COLORS.NEON_PINK;
    ctx.shadowBlur = 8;
    ctx.strokeStyle = COLORS.NEON_PINK;
    ctx.lineWidth = 1;
    ctx.strokeRect(6, 54, 8, 14);
    ctx.restore();

    drawPixelRect(ctx, 34, 54, 8, 14, '#111111', null);
    ctx.save();
    ctx.shadowColor = COLORS.NEON_PINK;
    ctx.shadowBlur = 8;
    ctx.strokeStyle = COLORS.NEON_PINK;
    ctx.lineWidth = 1;
    ctx.strokeRect(34, 54, 8, 14);
    ctx.restore();

    drawPixelRect(ctx, 8, 58, 4, 6, COLORS.NEON_PINK, COLORS.NEON_PINK, 6);
    drawPixelRect(ctx, 36, 58, 4, 6, COLORS.NEON_PINK, COLORS.NEON_PINK, 6);

    drawPixelRect(ctx, 12, 28, 24, 4, COLORS.NEON_CYAN, COLORS.NEON_CYAN, 6);
  }

  _renderExhaust(ctx) {
    this.exhaustParticles.forEach(p => {
      const alpha = p.life;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 10;
      ctx.fillStyle = p.color;
      ctx.fillRect(Math.floor(p.x - p.size / 2), Math.floor(p.y - p.size / 2), p.size, p.size);
      ctx.restore();
    });
  }
}
