export function rectIntersect(rect1, rect2) {
  const shrink = 6;
  return (
    rect1.x + shrink < rect2.x + rect2.width - shrink &&
    rect1.x + rect1.width - shrink > rect2.x + shrink &&
    rect1.y + shrink < rect2.y + rect2.height - shrink &&
    rect1.y + rect1.height - shrink > rect2.y + shrink
  );
}

export function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function drawPixelRect(ctx, x, y, w, h, color, glowColor, glowSize = 8) {
  if (glowColor) {
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = glowSize;
  }
  ctx.fillStyle = color;
  ctx.fillRect(Math.floor(x), Math.floor(y), w, h);
  ctx.shadowBlur = 0;
}

export function drawPixelText(ctx, text, x, y, color, glowColor, fontSize = 20, glowSize = 10, align = 'left') {
  ctx.save();
  if (glowColor) {
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = glowSize;
  }
  ctx.fillStyle = color;
  ctx.font = `${fontSize}px "Press Start 2P", monospace, sans-serif`;
  ctx.textAlign = align;
  ctx.textBaseline = 'top';
  ctx.fillText(text, x, y);
  ctx.restore();
}
