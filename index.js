// "use strict";

const UNIT = 10;
const FIELD_WIDTH = 13;
const FIELD_HEIGHT = 7;
const MAX_LENGTH = FIELD_WIDTH * FIELD_HEIGHT;
const START_X = Math.floor(FIELD_WIDTH / 2);
const START_Y = Math.floor(FIELD_HEIGHT / 2);
const UP = -1;
const DOWN = 1;
const LEFT = -1;
const RIGHT = 1;
const NONE = 0;

// const view = document.getElementById('field');

class CoordinateQueue extends Array {
  constructor() {
    super();
    this._head = this._tail = 0;
    this._loopedBack = false;
  }

  x(i = (this._head || MAX_LENGTH) - 1) {
    return this[i * 2];
  }

  y(i = (this._head || MAX_LENGTH) - 1) {
    return this[i * 2 + 1];
  }

  index(i) {
    return { x: this.x(i), y: this.y(i) };
  }

  get size() {
    return this._loopedBack ? 
      MAX_LENGTH - this._tail + this._head :
      this._head - this._tail;
  }

  push(x, y) {
    if (arguments.length != 2) throw new Error();
    if (this.size == MAX_LENGTH) throw new Error();
    if (this._head == MAX_LENGTH) {
      this._head = 0;
      this._loopedBack = !this._loopedBack;
    }
    this[this._head * 2] = x;
    this[this._head * 2 + 1] = y;
    this._head += 1;
  }

  shift() {
    if (this.size == 0) throw new Error('');
    this._tail += 1;
    if (this._tail == MAX_LENGTH) {
      this._tail = 0;
      this._loopedBack = !this._loopedBack;
    }
  }

  find(x, y) {
    const excludeHead = arguments.length == 0;
    if (!excludeHead && arguments.length != 2) throw new Error();

    let bound1 = this._loopedBack ? MAX_LENGTH : this._head;
    let bound2 = this._head;
    if (excludeHead) {
      bound1 = this._loopedBack ? MAX_LENGTH: this._head - 1;
      bound2 = this._head - 1;
    }

    if (excludeHead) {
      x = this.x();
      y = this.y();
    }

    for (let i = this._tail; i < bound1; i++) {
      if (this.x(i) == x && this.y(i) == y) return true;
    }
    if (!this._loopedBack) return false;

    for (let i = 0; i < bound2; i++) {
      if (this.x(i) == x && this.y(i) == y) return true;
    }
    return false;
  }

  [Symbol.iterator]() {
    const loopedBack = this._loopedBack;
    const bound1 = loopedBack ? MAX_LENGTH : this._head;
    const bound2 = this._head;
    let bound = bound1;
    let i = this._tail;

    const next = () => {
      if (loopedBack && i == MAX_LNGTH) {
        i = 0;
        bound = bound2;
      }
      return { 
        value: this.index(i), 
        done: i++ == bound 
      };
    };
    return { next };
  }
}


class Snake extends CoordinateQueue{
  constructor() {
    super();
    const direction = Snake.getRandomDirection();
    this.directionX = direction[0];
    this.directionY = direction[1];
    this.push(START_X, START_Y);
  }

  turn(dirX, dirY) {
    if (dirX && !this.directionX) {
      this.directionX = dirX;
      this.directionY = 0;
    } else if (dirY && !this.directionY) {
      this.directionY = dirY;
      this.directionX = 0
    }
  }

  walk(grow = false) {
    this.push(
      this.x() + this.directionX,
      this.y() + this.directionY
    );
    if (grow) return;

    this.shift();
    return;
  }

  isAlive() {
    const x = this.x(),
          y = this.y();
    return x >= 0 && 
      x < FIELD_WIDTH && 
      y >= 0 && 
      y < FIELD_HEIGHT && 
      !this.find()
  }

  static getRandomDirection() {
    const x = Math.random() > 0.5 ? Math.random() > 0.5 ? LEFT : RIGHT : NONE;
    const y = x ? NONE : Math.random() > 0.5 ? UP : DOWN;
    return [x, y];
  }
}


function devRender(snake) {
  const field = new Array(FIELD_HEIGHT);
  for (let i = 0; i < FIELD_WIDTH; i++) {
    field[i] = new Array(FIELD_WIDTH).fill('-');
  }

  let count = 0;
  for (const { x, y } of snake) {
    if (x < 0 || y < 0) continue;
    field[y][x] = String(count++ % 10);
  }

  for (let i = 0; i < FIELD_HEIGHT; i++) {
    for (let j = 0; j < FIELD_WIDTH; j++) {
      process.stdout.write(field[i][j]);
    }
    process.stdout.write('\n');
  }
}


let snake = new Snake();

while (snake.isAlive() || (snake = new Snake())) {
  devRender(snake);
  console.log();
  snake.turn(...Snake.getRandomDirection());
  snake.walk(Math.random() > 0.5);
}
  

module.exports = Snake;