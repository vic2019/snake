// "use strict";

const U = 10;
const FIELD_WIDTH = 40;
const FIELD_HEIGHT = 40;
const START_X = Math.floor(FIELD_WIDTH / 2);
const START_Y = Math.floor(FIELD_HEIGHT / 2);
const UP = -1;
const DOWN = 1;
const LEFT = -1;
const RIGHT = 1;

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
  constructor(x = START_X, y = START_Y) {
    this.head = new Node(x, y);
    this.tail = this.head;
    this.length = 1;
    const direction = getRandomDirection();
    this.directionX = direction[0];
    this.directionY = direction[1];
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

  /* May lengthen only before walk */
  walk() {
    const newHead = this.tail;
    if (this.length > 1) {
      this.tail = newHead.prev;
      this.tail.next = null;
      this.head.prev = newHead;
      newHead.prev = null;
      newHead.next = this.head;
    }

    /* Reassign this.head only after moving newHead to allow accessing the old head's coordinates */
    newHead.moveTo(this.head.x + this.directionX, this.head.y + this.directionY);
    this.head = newHead; 
  }

  /* May lengthen only before walk */
  lengthen() {
    const newTail = new Node(this.tail.x, this.tail.y, this.tail, null);
    this.tail.next = newTail;
    this.tail = newTail;
    this.length += 1;
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

  print() {
    let node = this.head;
    while(node != null) {
      console.log(`${node.id}:`, node.x, node.y);
      node = node.next;
    }
    console.log(
      `---- Head: ${this.head.id} (${this.head.x}, ${this.head.y})`,  
      `Tail: ${this.tail.id} (${this.tail.x}, ${this.tail.y})`,  
      `Direction: (${this.directionX}, ${this.directionY})`,  
      `Length: ${this.length} ----`
    );
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

  let node = snake.head;
  let i = 0;
  while(node != null) {
    if (
      node.x >= FIELD_WIDTH ||
      node.x < 0 ||
      node.y >= FIELD_HEIGHT ||
      node.y < 0
    ) {
      node = node.next;
      continue;
    };
    field[node.y][node.x] = i++;
    node = node.next;
  }

  for (let i = 0; i < FIELD_WIDTH; i++) {
    for (let j = 0; j < FIELD_HEIGHT; j++) {
      process.stdout.write(String(field[i][j] % 9 + 1 || '.'));
    }
    process.stdout.write('\n');
  }
}


const snake = new Snake();

while (snake.isAlive()) {
  // snake.print();
  snake.turn(...getRandomDirection());
  snake.lengthen();
  snake.walk();
}

devRender(snake);
