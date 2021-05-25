// "use strict";

const U = 10;
const FIELD_WIDTH = 13;
const FIELD_HEIGHT = 7;
const START_X = Math.floor(FIELD_WIDTH / 2);
const START_Y = Math.floor(FIELD_HEIGHT / 2);
const UP = -1;
const DOWN = 1;
const LEFT = -1;
const RIGHT = 1;
const NONE = 0;

// const view = document.getElementById('field');


class Node {
  static count = 0;
  constructor(x, y, prev = null, next = null) {
    this.x = x;
    this.y = y;
    this.prev = prev;
    this.next = next;
    this.id = Node.count++;
  }

  moveTo(x, y) {
    this.x = x;
    this.y = y;
  }
}


class Snake {
  constructor() {
    this.head = new Node(START_X, START_Y);
    this.tail = this.head;
    this.length = 1;
    const direction = Snake.getRandomDirection();
    this.directionX = direction[0];
    this.directionY = direction[1];
  }

  index(i = 0) {
    let node = this.head;
    for (let index = 0; node && index < i; index++) {
      node = node.next;
    }
    return index == i ? node : {};
  }

  x(i) {
    return i == undefined ? this.head.x : this.index(i).x;
  }

  y(i) {
    return i == undefined ? this.head.y : this.index(i).y;
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

  walk(grow) {
    if (grow) {
      const newHead = new Node(
        this.head.x + this.directionX, this.head.y + this.directionY
      );
      this.head.prev = newHead;
      newHead.next = this.head;
      this.head = newHead;
      this.length += 1;
      return;
    }

    const newHead = this.tail;
    if (this.length > 1) {
      this.tail = newHead.prev;
      this.tail.next = null;
      this.head.prev = newHead;
      newHead.prev = null;
      newHead.next = this.head;
    }

    /* Reassign this.head only after moving newHead to 
      allow accessing the old head's coordinates */
    newHead.moveTo(this.head.x + this.directionX, this.head.y + this.directionY);
    this.head = newHead; 
  }

  isAlive() {
    const head = this.head;
    if (
      head.x >= FIELD_WIDTH ||
      head.x < 0 ||
      head.y >= FIELD_HEIGHT ||
      head.y < 0
    ) return false;

    let node = this.head.next;
    while (node != null) {
      if (node.x == head.x && node.y == head.y) {
        return false;
      }
      node = node.next;
    }
    return true;
  }

  [Symbol.iterator]() {
    let node = { prev: this.tail };
    const next = () => {
      node = node.prev;
      return {
        value: { 
          x: (node || {}).x, 
          y: (node || {}).y 
        },
        done: !Boolean(node)
      };
    }
    return { next };
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

  let i = 0;
  for (const {x, y} of snake) {
    if (x < 0 || y < 0) continue;
    field[y][x] = String(i++ % 10);    
  }

  for (let i = 0; i < FIELD_HEIGHT; i++) {
    for (let j = 0; j < FIELD_WIDTH; j++) {
      process.stdout.write(field[i][j]);
    }
    process.stdout.write('\n');
  }
}


let snake = new Snake();
let count = 0;
const startTime = new Date().getTime();
while (
  count++ < 2000 && 
  ( snake.isAlive() || (snake = new Snake()) )
) {
  devRender(snake);
  console.log();
  snake.turn(...Snake.getRandomDirection());
  snake.walk(Math.random() > 0.5);
}

console.log(`Time: ${new Date().getTime() - startTime}`);


module.exports = Snake;

