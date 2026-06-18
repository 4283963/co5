import { CANVAS_WIDTH, CANVAS_HEIGHT, COLORS, ROAD_LEFT, ROAD_RIGHT } from './constants.js';
import { drawPixelRect } from './utils.js';

export class Background {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.roadOffset = 0;
    this.lineSpacing = 60;
    this.lineHeight = 30;
    this.neonBuildings = this._generateBuildings();
    this.stars = this._generateStars();
    this.neonGlowPhase = 0;
  }

  _generateStars() {
    const stars = [];
    for (let i = 0; i < 80; i++) {
      stars.push({
        x: Math.random() * CANVAS_WIDTH,
        y: Math.random() * CANVAS_HEIGHT * 0.4,
        size: Math.random() * 2 + 1,
        twinkle: Math.random() * Math.PI * 2
      });
    }
    return stars;
  }

  _generateBuildings() {
    const buildings = [];
    const colors = [COLORS.NEON_PINK, COLORS.NEON_CYAN, COLORS.NEON_PURPLE, COLORS.NEON_GREEN];
    
    let x = 0;
    while (x < ROAD_LEFT) {
      const w = Math.random() * 25 + 20;
      const h = Math.random() * 180 + 60;
      buildings.push({
        x: x,
        y: CANVAS_HEIGHT - h - 50,
        width: w,
        height: h,
        color: colors[Math.floor(Math.random() * colors.length)],
        windows: this._generateWindows(w, h)
      });
      x += w + 3;
    }

    x = ROAD_RIGHT;
    while (x < CANVAS_WIDTH) {
      const w = Math.random() * 25 + 20;
      const h = Math.random() * 180 + 60;
      buildings.push({
        x: x,
        y: CANVAS_HEIGHT - h - 50,
        width: w,
        height: h,
        color: colors[Math.floor(Math.random() * colors.length)],
        windows: this._generateWindows(w, h)
      });
      x += w + 3;
    }

    return buildings;
  }

  _generateWindows(buildingW, buildingH) {
    const windows = [];
    const cols = Math.floor(buildingW / 10);
    const rows = Math.floor(buildingH / 18);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (Math.random() > 0.3) {
          windows.push({
            x: c * 10 + 3,
            y: r * 18 + 5,
            width: 6,
            height: 10,
            lit: Math.random() > 0.3,
            flickerPhase: Math.random() * Math.PI * 2
          });
        }
      }
    }
    return windows;
  }

  update(speed, deltaTime) {
    this.roadOffset = (this.roadOffset + speed * 0.8) % this.lineSpacing;
    this.neonGlowPhase += deltaTime * 0.003;
  }

  render(ctx) {
    const gradient = ctx.createLinearGradient(0, 0, 0, this.height);
    gradient.addColorStop(0, '#050510');
    gradient.addColorStop(0.4, '#0a0a2e');
    gradient.addColorStop(0.7, '#0d0d3a');
    gradient.addColorStop(1, COLORS.BG);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.width, this.height);

    this._renderStars(ctx);
    this._renderBuildings(ctx);
    this._renderRoad(ctx);
    this._renderRoadEdges(ctx);
  }

  _renderStars(ctx) {
    this.stars.forEach(star => {
      const twinkle = Math.sin(this.neonGlowPhase * 2 + star.twinkle) * 0.5 + 0.5;
      const alpha = 0.3 + twinkle * 0.7;
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fillRect(Math.floor(star.x), Math.floor(star.y), star.size, star.size);
    });
  }

  _renderBuildings(ctx) {
    this.neonBuildings.forEach(b => {
      drawPixelRect(ctx, b.x, b.y, b.width, b.height, '#050515', null);

      const glowIntensity = Math.sin(this.neonGlowPhase + b.x * 0.1) * 0.3 + 0.7;
      ctx.save();
      ctx.shadowColor = b.color;
      ctx.shadowBlur = 12 * glowIntensity;
      ctx.strokeStyle = b.color;
      ctx.lineWidth = 2;
      ctx.strokeRect(Math.floor(b.x), Math.floor(b.y), b.width, b.height);
      ctx.restore();

      b.windows.forEach(w => {
        const flicker = Math.sin(this.neonGlowPhase * 3 + w.flickerPhase);
        if (w.lit && flicker > -0.3) {
          const windowAlpha = 0.6 + Math.random() * 0.4;
          ctx.fillStyle = `rgba(255, 240, 150, ${windowAlpha})`;
          ctx.fillRect(Math.floor(b.x + w.x), Math.floor(b.y + w.y), w.width, w.height);
        }
      });
    });
  }

  _renderRoad(ctx) {
    ctx.fillStyle = COLORS.ROAD_DARK;
    ctx.fillRect(ROAD_LEFT, 0, ROAD_RIGHT - ROAD_LEFT, this.height);

    const centerX = (ROAD_LEFT + ROAD_RIGHT) / 2;

    ctx.strokeStyle = COLORS.NEON_YELLOW;
    ctx.lineWidth = 4;
    ctx.setLineDash([this.lineHeight, this.lineSpacing - this.lineHeight]);
    ctx.lineDashOffset = -this.roadOffset;
    ctx.shadowColor = COLORS.NEON_YELLOW;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, this.height);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.shadowBlur = 0;

    ctx.fillStyle = 'rgba(30, 30, 70, 0.5)';
    for (let y = -this.lineSpacing; y < this.height + this.lineSpacing; y += this.lineSpacing) {
      const drawY = y + this.roadOffset;
      ctx.fillRect(ROAD_LEFT + 15, drawY, 2, this.lineHeight * 0.6);
      ctx.fillRect(ROAD_RIGHT - 17, drawY, 2, this.lineHeight * 0.6);
    }
  }

  _renderRoadEdges(ctx) {
    const edgeGlow = Math.sin(this.neonGlowPhase * 2) * 0.3 + 0.7;

    ctx.save();
    ctx.shadowColor = COLORS.NEON_PINK;
    ctx.shadowBlur = 15 * edgeGlow;
    ctx.fillStyle = COLORS.NEON_PINK;
    
    for (let y = 0; y < this.height; y += 25) {
      const h = 12;
      ctx.fillRect(ROAD_LEFT - 3, y, 3, h);
      ctx.fillRect(ROAD_RIGHT, y, 3, h);
    }
    ctx.restore();

    ctx.save();
    ctx.shadowColor = COLORS.NEON_CYAN;
    ctx.shadowBlur = 15 * edgeGlow;
    ctx.fillStyle = COLORS.NEON_CYAN;
    
    for (let y = 12; y < this.height; y += 25) {
      const h = 12;
      ctx.fillRect(ROAD_LEFT - 3, y, 3, h);
      ctx.fillRect(ROAD_RIGHT, y, 3, h);
    }
    ctx.restore();
  }
}
