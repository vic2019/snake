// "use strict";

const UNIT = 10;
const FIELD_WIDTH = 25;
const FIELD_HEIGHT = 25;
const QUEUE_CAPACITY = FIELD_WIDTH * FIELD_HEIGHT;
const START_X = Math.floor(FIELD_WIDTH / 2);
const START_Y = Math.floor(FIELD_HEIGHT / 2);
const UP = -1;
const DOWN = 1;
const LEFT = -1;
const RIGHT = 1;

// const view = document.getElementById('field');


class Snake {
  constructor() {
    this.coordsX = new Array(QUEUE_CAPACITY);
    this.coordsY = new Array(QUEUE_CAPACITY);
    this.head = this.tail = this.length = 0;
    const direction = getRandomDirection();
    this.directionX = direction[0];
    this.directionY = direction[1];

    this.coordsX[this.head] = START_X;
    this.coordsY[this.head] = START_Y;
    this.head += 1;
    this.length += 1;
  }

  x() {
    return this.coordsX[this.head - 1];
  }
  
  y() {
    return this.coordsY[this.head - 1];
  }

  walk(grow = false) {
    this.coordsX[this.head] += this.directionX;
    this.coordsY[this.head] += this.directionY;
    this.head += 1;

    if (grow) {
      this.length += 1;
    } else {
      this.tail += 1;
    }

    if (this.head == QUEUE_CAPACITY) {
      this.head = 0;
    }
    if (this.tail == QUEUE_CAPACITY) {
      this.tail = 0;
    }
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

  isAlive() {
    return this.withinBounds() && this.noCollision();
  }

  withinBounds() {
    const x = this.x(), y = this.y();
    return x < FIELD_WIDTH && x >= 0 && y < FIELD_HEIGHT && y >= 0;
  }

  noCollision(x = this.x(), y = this.y(), includeHead) {
    const upperBound = includeHead ? this.head : this.head - 1;
    if (this.head > this.tail) {
      for (let i = this.tail; i < upperBound; i++) {
        if (this.coordsX[i] == x && this.coordsY[i] == y) return false;
      }

    } else {
      for (let i = this.tail; i < QUEUE_CAPACITY; i++) {
        if (this.coordsX[i] == x && this.coordsY[i] == y) return false;
      }
      for (let i = 0; i < upperBound; i++) {
        if (this.coordsX[i] == x && this.coordsY[i] == y) return false;
      }
    }

    return true;
  }
}


function getRandomDirection() {
  const x = Math.random() > 0.5 ? Math.random() > 0.5 ? 1 : -1 : 0;
  const y = x ? 0 : Math.random() > 0.5 ? 1 : -1;
  return [x, y];
}


function devRender(snake) {
  const field = new Array(FIELD_HEIGHT);
  for (let i = 0; i < FIELD_WIDTH; i++) {
    field[i] = new Array(FIELD_WIDTH);
  }

  if (snake.head > snake.tail) {
    for (let i = snake.tail; i < snake.head - 1; i++) {
      field[ snake.coordsY[i] ][ snake.coordsX[i] ] = 'X';
    }

  } else {
    for (let i = snake.tail; i < QUEUE_CAPACITY; i++) {
      field[ snake.coordsY[i] ][ snake.coordsX[i] ] = 'X';
    }
    for (let i = 0; i < snake.head - 1; i++) {
      field[ snake.coordsY[i] ][ snake.coordsX[i] ] = 'X';
    }
  }

  for (let i = 0; i < FIELD_WIDTH; i++) {
    for (let j = 0; j < FIELD_HEIGHT; j++) {
      process.stdout.write(field[i][j] || '.');
    }
    process.stdout.write('\n');
  }
}


const snake = new Snake();
snake.walk();
snake.walk();
snake.walk();
snake.walk();

// while (snake.isAlive()) {
//   snake.turn(...getRandomDirection());
//   snake.walk(true);
// }
  
devRender(snake);