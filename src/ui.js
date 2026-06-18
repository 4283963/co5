import { CANVAS_WIDTH, CANVAS_HEIGHT, COLORS } from './constants.js';
import { drawPixelText, drawPixelRect } from './utils.js';

export class UI {
  constructor() {
    this.blinkPhase = 0;
    this.titleGlowPhase = 0;
  }

  update(deltaTime) {
    this.blinkPhase += deltaTime * 0.005;
    this.titleGlowPhase += deltaTime * 0.003;
  }

  renderScore(ctx, score, highScore) {
    const scoreStr = score.toString().padStart(4, '0');
    drawPixelText(ctx, `SCORE`, 20, 16, COLORS.NEON_CYAN, COLORS.NEON_CYAN, 16, 8, 'left');
    drawPixelText(ctx, scoreStr, 20, 38, COLORS.NEON_YELLOW, COLORS.NEON_YELLOW, 24, 12, 'left');

    const hiStr = `HI ${highScore.toString().padStart(4, '0')}`;
    drawPixelText(ctx, hiStr, CANVAS_WIDTH - 20, 16, COLORS.NEON_PINK, COLORS.NEON_PINK, 14, 6, 'right');
  }

  renderStartScreen(ctx) {
    const centerX = CANVAS_WIDTH / 2;
    const centerY = CANVAS_HEIGHT / 2;

    const titleGlow = Math.sin(this.titleGlowPhase) * 0.4 + 0.6;
    
    ctx.save();
    ctx.shadowColor = COLORS.NEON_PINK;
    ctx.shadowBlur = 30 * titleGlow;
    ctx.font = '32px "Press Start 2P", monospace, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const gradient = ctx.createLinearGradient(centerX - 200, 0, centerX + 200, 0);
    gradient.addColorStop(0, COLORS.NEON_PINK);
    gradient.addColorStop(0.5, COLORS.NEON_PURPLE);
    gradient.addColorStop(1, COLORS.NEON_CYAN);
    ctx.fillStyle = gradient;
    ctx.fillText('赛博霓虹', centerX, centerY - 100);
    ctx.fillText('骑士', centerX, centerY - 55);
    ctx.restore();

    ctx.save();
    ctx.shadowColor = COLORS.NEON_CYAN;
    ctx.shadowBlur = 15;
    ctx.fillStyle = COLORS.NEON_CYAN;
    ctx.font = '14px "Press Start 2P", monospace, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('CYBER NEON RIDER', centerX, centerY - 10);
    ctx.restore();

    this._renderMotoIcon(ctx, centerX, centerY + 40);

    if (Math.sin(this.blinkPhase * 3) > -0.2) {
      drawPixelText(
        ctx, 
        '按 空格键 开始', 
        centerX, 
        centerY + 140, 
        COLORS.NEON_YELLOW, 
        COLORS.NEON_YELLOW, 
        18, 
        12, 
        'center'
      );
    }

    drawPixelText(
      ctx, 
      '← → 方向键 控制移动', 
      centerX, 
      centerY + 180, 
      COLORS.NEON_GREEN, 
      COLORS.NEON_GREEN, 
      12, 
        6, 
      'center'
    );
  }

  renderGameOver(ctx, score, highScore) {
    const centerX = CANVAS_WIDTH / 2;
    const centerY = CANVAS_HEIGHT / 2;

    ctx.fillStyle = 'rgba(10, 10, 26, 0.85)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    const glitchOffset = Math.sin(this.blinkPhase * 10) * 2;
    
    ctx.save();
    ctx.shadowColor = COLORS.NEON_RED;
    ctx.shadowBlur = 25;
    ctx.fillStyle = COLORS.NEON_RED;
    ctx.font = '36px "Press Start 2P", monospace, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('GAME OVER', centerX + glitchOffset, centerY - 80);
    ctx.restore();

    if (score >= highScore && score > 0) {
      const newHiGlow = Math.sin(this.blinkPhase * 5) * 0.4 + 0.6;
      ctx.save();
      ctx.shadowColor = COLORS.NEON_YELLOW;
      ctx.shadowBlur = 20 * newHiGlow;
      ctx.fillStyle = COLORS.NEON_YELLOW;
      ctx.font = '16px "Press Start 2P", monospace, sans-serif';
      ctx.fillText('★ 新纪录！ ★', centerX, centerY - 30);
      ctx.restore();
    }

    drawPixelText(
      ctx, 
      '最终得分', 
      centerX, 
      centerY + 5, 
      COLORS.NEON_CYAN, 
      COLORS.NEON_CYAN, 
      14, 
      6, 
      'center'
    );
    
    const scoreStr = score.toString().padStart(4, '0');
    drawPixelText(
      ctx, 
      scoreStr, 
      centerX, 
      centerY + 30, 
      COLORS.NEON_YELLOW, 
      COLORS.NEON_YELLOW, 
      32, 
      15, 
      'center'
    );

    drawPixelText(
      ctx, 
      `最高分 ${highScore.toString().padStart(4, '0')}`, 
      centerX, 
      centerY + 80, 
      COLORS.NEON_PINK, 
      COLORS.NEON_PINK, 
      14, 
      6, 
      'center'
    );

    if (Math.sin(this.blinkPhase * 3) > -0.2) {
      drawPixelText(
        ctx, 
        '按 空格键 重新开始', 
        centerX, 
        centerY + 140, 
        COLORS.NEON_GREEN, 
        COLORS.NEON_GREEN, 
        16, 
        10, 
        'center'
      );
    }
  }

  renderPauseHint(ctx) {
    drawPixelText(
      ctx, 
      'P 暂停', 
      CANVAS_WIDTH - 20, 
      CANVAS_HEIGHT - 25, 
      COLORS.NEON_PURPLE, 
      COLORS.NEON_PURPLE, 
      10, 
      4, 
      'right'
    );
  }

  _renderMotoIcon(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);

    drawPixelRect(ctx, -24, 10, 48, 12, COLORS.NEON_PURPLE, COLORS.NEON_PURPLE, 8);
    drawPixelRect(ctx, -16, -20, 32, 40, COLORS.NEON_CYAN, COLORS.NEON_CYAN, 10);
    drawPixelRect(ctx, -12, -35, 24, 18, '#003344', null);
    
    ctx.save();
    ctx.shadowColor = COLORS.NEON_CYAN;
    ctx.shadowBlur = 10;
    ctx.strokeStyle = COLORS.NEON_CYAN;
    ctx.lineWidth = 2;
    ctx.strokeRect(-12, -35, 24, 18);
    ctx.restore();

    drawPixelRect(ctx, -4, -48, 8, 18, COLORS.NEON_YELLOW, COLORS.NEON_YELLOW, 10);
    drawPixelRect(ctx, -26, -30, 10, 18, '#111111', null);
    drawPixelRect(ctx, -24, -26, 6, 10, COLORS.NEON_YELLOW, COLORS.NEON_YELLOW, 6);
    drawPixelRect(ctx, 16, 10, 10, 18, '#111111', null);
    drawPixelRect(ctx, 18, 14, 6, 10, COLORS.NEON_RED, COLORS.NEON_RED, 8);

    drawPixelRect(ctx, -26, 0, 10, 18, '#111111', null);
    drawPixelRect(ctx, 16, 0, 10, 18, '#111111', null);
    
    ctx.save();
    ctx.shadowColor = COLORS.NEON_PINK;
    ctx.shadowBlur = 10;
    ctx.strokeStyle = COLORS.NEON_PINK;
    ctx.lineWidth = 1;
    ctx.strokeRect(-26, 0, 10, 18);
    ctx.strokeRect(16, 0, 10, 18);
    ctx.restore();

    ctx.restore();
  }
}
