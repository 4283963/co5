export const CANVAS_WIDTH = 480;
export const CANVAS_HEIGHT = 720;

export const PLAYER_WIDTH = 48;
export const PLAYER_HEIGHT = 72;
export const PLAYER_SPEED = 6;

export const OBSTACLE_MIN_SPEED = 3;
export const OBSTACLE_MAX_SPEED = 7;
export const OBSTACLE_SPAWN_INTERVAL = 1100;

export const SCORE_PER_OBSTACLE = 10;

export const NITRO_MAX = 100;
export const NITRO_DRAIN_RATE = 0.8;
export const NITRO_RECHARGE_RATE = 0.3;
export const NITRO_SPEED_MULTIPLIER = 2.0;

export const ROAD_LEFT = 60;
export const ROAD_RIGHT = CANVAS_WIDTH - 60;

export const COLORS = {
  BG: '#0a0a1a',
  NEON_CYAN: '#00ffff',
  NEON_PINK: '#ff00ff',
  NEON_PURPLE: '#9d00ff',
  NEON_YELLOW: '#ffff00',
  NEON_RED: '#ff3366',
  NEON_GREEN: '#00ff66',
  NEON_ORANGE: '#ff8800',
  NEON_BLUE: '#0088ff',
  NEON_DEEP_BLUE: '#0044ff',
  NEON_WHITE: '#aaddff',
  ROAD_LINE: '#1a1a3a',
  ROAD_DARK: '#0d0d20'
};

export const GAME_STATES = {
  START: 'start',
  PLAYING: 'playing',
  GAME_OVER: 'gameOver'
};
