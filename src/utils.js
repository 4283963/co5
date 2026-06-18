export function rectIntersect(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}

export function circleRectIntersect(circle, rect) {
  const closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
  const closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));
  
  const distanceX = circle.x - closestX;
  const distanceY = circle.y - closestY;
  const distanceSquared = distanceX * distanceX + distanceY * distanceY;
  
  return distanceSquared < circle.radius * circle.radius;
}

export function multiRectIntersect(rects1, rects2) {
  for (let i = 0; i < rects1.length; i++) {
    for (let j = 0; j < rects2.length; j++) {
      if (rectIntersect(rects1[i], rects2[j])) {
        return true;
      }
    }
  }
  return false;
}

export function multiRectWithSingleRectIntersect(multiRects, singleRect) {
  for (let i = 0; i < multiRects.length; i++) {
    if (rectIntersect(multiRects[i], singleRect)) {
      return true;
    }
  }
  return false;
}

export function shrinkRect(rect, shrinkX, shrinkY = shrinkX) {
  return {
    x: rect.x + shrinkX,
    y: rect.y + shrinkY,
    width: rect.width - shrinkX * 2,
    height: rect.height - shrinkY * 2
  };
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
