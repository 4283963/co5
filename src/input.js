export class InputHandler {
  constructor() {
    this.keys = {
      left: false,
      right: false,
      space: false,
      spacePressed: false,
      bKey: false,
      bKeyPressed: false
    };

    this.touchStartX = 0;
    this.touchCurrentX = 0;
    this.isTouching = false;

    this._bindEvents();
  }

  _bindEvents() {
    window.addEventListener('keydown', (e) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        this.keys.left = true;
      }
      if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        this.keys.right = true;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        if (!this.keys.space) {
          this.keys.spacePressed = true;
        }
        this.keys.space = true;
      }
      if (e.code === 'KeyB') {
        if (!this.keys.bKey) {
          this.keys.bKeyPressed = true;
        }
        this.keys.bKey = true;
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        this.keys.left = false;
      }
      if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        this.keys.right = false;
      }
      if (e.code === 'Space') {
        this.keys.space = false;
      }
      if (e.code === 'KeyB') {
        this.keys.bKey = false;
      }
    });
  }

  isLeftPressed() {
    return this.keys.left;
  }

  isRightPressed() {
    return this.keys.right;
  }

  isSpaceJustPressed() {
    const pressed = this.keys.spacePressed;
    this.keys.spacePressed = false;
    return pressed;
  }

  isSpaceHeld() {
    return this.keys.space;
  }

  isBJustPressed() {
    const pressed = this.keys.bKeyPressed;
    this.keys.bKeyPressed = false;
    return pressed;
  }

  resetSpace() {
    this.keys.spacePressed = false;
  }
}
