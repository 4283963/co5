import { CANVAS_WIDTH, CANVAS_HEIGHT, PLAYER_WIDTH, PLAYER_HEIGHT, GAME_STATES, SCORE_PER_OBSTACLE, OBSTACLE_MAX_SPEED } from './constants.js';
import { Background } from './background.js';
import { Player } from './player.js';
import { ObstacleManager } from './obstacle.js';
import { UI } from './ui.js';
import { InputHandler } from './input.js';

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.canvas.width = CANVAS_WIDTH;
    this.canvas.height = CANVAS_HEIGHT;

    this.state = GAME_STATES.START;
    this.score = 0;
    this.highScore = this._loadHighScore();

    this.background = new Background(CANVAS_WIDTH, CANVAS_HEIGHT);
    this.player = new Player(
      CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2,
      CANVAS_HEIGHT - PLAYER_HEIGHT - 40
    );
    this.obstacleManager = new ObstacleManager();
    this.ui = new UI();
    this.input = new InputHandler();

    this.lastTime = 0;
    this.currentTime = 0;
    this.deltaTime = 0;
    this.isRunning = false;
    this.animationId = null;

    this._handleSpace = this._handleSpace.bind(this);
    this._gameLoop = this._gameLoop.bind(this);
  }

  _loadHighScore() {
    try {
      const saved = localStorage.getItem('cyberNeonRider_highScore');
      return saved ? parseInt(saved, 10) : 0;
    } catch (e) {
      return 0;
    }
  }

  _saveHighScore() {
    try {
      if (this.score > this.highScore) {
        this.highScore = this.score;
        localStorage.setItem('cyberNeonRider_highScore', this.highScore.toString());
      }
    } catch (e) {
    }
  }

  init() {
    this.score = 0;
    this.player.reset();
    this.obstacleManager.reset();
    this.lastTime = performance.now();
    this.currentTime = this.lastTime;
  }

  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.lastTime = performance.now();
      this._gameLoop(this.lastTime);
    }
  }

  stop() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  _gameLoop(timestamp) {
    if (!this.isRunning) return;

    this.currentTime = timestamp;
    this.deltaTime = this.currentTime - this.lastTime;
    this.lastTime = this.currentTime;

    if (this.deltaTime > 50) {
      this.deltaTime = 16;
    }

    this._handleSpace();
    this.update();
    this.render();

    this.animationId = requestAnimationFrame(this._gameLoop);
  }

  _handleSpace() {
    if (this.input.isSpaceJustPressed()) {
      if (this.state === GAME_STATES.START) {
        this.init();
        this.state = GAME_STATES.PLAYING;
      } else if (this.state === GAME_STATES.GAME_OVER) {
        this.init();
        this.state = GAME_STATES.PLAYING;
      }
    }
  }

  update() {
    this.ui.update(this.deltaTime);

    if (this.state !== GAME_STATES.PLAYING) {
      this.background.update(OBSTACLE_MAX_SPEED * 0.5, this.deltaTime);
      return;
    }

    if (this.input.isLeftPressed()) {
      this.player.moveLeft();
    } else if (this.input.isRightPressed()) {
      this.player.moveRight();
    } else {
      this.player.stop();
    }

    this.player.update(this.deltaTime);
    this.obstacleManager.update(this.currentTime, this.deltaTime);
    this.obstacleManager.setDifficulty(this.score);
    this.background.update(OBSTACLE_MAX_SPEED * this.obstacleManager.speedMultiplier, this.deltaTime);

    const passed = this.obstacleManager.checkPassed(this.player.y);
    if (passed > 0) {
      this.score += passed * SCORE_PER_OBSTACLE;
    }

    if (this.obstacleManager.checkCollisions(this.player.getBounds())) {
      this._gameOver();
    }
  }

  _gameOver() {
    this.state = GAME_STATES.GAME_OVER;
    this._saveHighScore();
  }

  render() {
    this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    this.background.render(this.ctx);

    if (this.state === GAME_STATES.PLAYING || this.state === GAME_STATES.GAME_OVER) {
      this.obstacleManager.render(this.ctx);
      this.player.render(this.ctx);
      this.ui.renderScore(this.ctx, this.score, this.highScore);
      this.ui.renderPauseHint(this.ctx);
    }

    if (this.state === GAME_STATES.START) {
      this.ui.renderStartScreen(this.ctx);
    } else if (this.state === GAME_STATES.GAME_OVER) {
      this.ui.renderGameOver(this.ctx, this.score, this.highScore);
    }
  }
}
