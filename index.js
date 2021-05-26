// const U = 10;
const FIELD_WIDTH = 17;
const FIELD_HEIGHT = 9;
const START_X = Math.floor(FIELD_WIDTH / 2);
const START_Y = Math.floor(FIELD_HEIGHT / 2);
const DIRECTION = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
  NONE: { x: 0, y: 0 },
};
const FRAMERATE_0 = 800;
const FRAMERATE_1 = 650;
const FRAMERATE_2 = 500;
const FRAMERATE_3 = 400;
const FRAMERATE_4 = 300;

// const view = document.getElementById('field');


class Node {
  constructor({ x, y, prev = null, next = null }) {
    this.x = x;
    this.y = y;
    this.prev = prev;
    this.next = next;
    /* this.id = Node.count++; */
  }

  /* static count = 0; */
  
  moveTo({ x, y }) {
    this.x = x;
    this.y = y;
  }
}


class Snake {
  constructor() {
    this.head = new Node({ x: START_X, y: START_Y });
    this.tail = this.head;
    this.length = 1;
    this.direction = Snake.getRandomDirection();
  }

  index(i = 0) {
    let node = this.head;
    let index = 0;
    for (; node && index < i; index++) {
      node = node.next;
    }
    return index == i ? node : null;
  }

  x(i) {
    return i == undefined ? this.head.x : (this.index(i) || {}).x;
  }

  y(i) {
    return i == undefined ? this.head.y : (this.index(i) || {}).y;
  }

  turn(direction) {
    switch (this.direction) {
      case DIRECTION.UP:
      case DIRECTION.DOWN:
        if (direction == DIRECTION.LEFT || direction == DIRECTION.RIGHT) {
          this.direction = direction;
        }
        return;
      case DIRECTION.LEFT:
      case DIRECTION.RIGHT:
        if (direction == DIRECTION.UP || direction == DIRECTION.DOWN) {
          this.direction = direction;
        }
        return;
    }
  }

  walk(grow) {
    if (grow) {
      const newHead = new Node(Snake.getNextPosition(this.head, this.direction));
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
    newHead.moveTo(Snake.getNextPosition(this.head, this.direction));
    this.head = newHead; 
  }

  find(x, y, i) {
    let node = this.index(i);
    while (node != null) {
      if (node.x == x && node.y == y) {
        return true;
      }
      node = node.next;
    }
    return false;
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
        done: node == null
      };
    }
    return { next };
  }

  static getNextPosition(node, step) {
    return {
      x: node.x + step.x,
      y: node.y + step.y
    };
  }

  static getRandomDirection() {
    switch (Math.floor(Math.random() * 4)) {
      case 0: return DIRECTION.UP;
      case 1: return DIRECTION.DOWN;
      case 2: return DIRECTION.LEFT;
      case 3: return DIRECTION.RIGHT;
    }
  }
}


class Food {
  constructor(snake) {
    let x = Math.floor(Math.random() * FIELD_WIDTH),
        y = Math.floor(Math.random() * FIELD_HEIGHT);
    while (snake.find(x, y, 0)) {
      x = Math.floor(Math.random() * FIELD_WIDTH);
      y = Math.floor(Math.random() * FIELD_HEIGHT);
    }
    this.x = x;
    this.y = y;
  }
}


class Game {
  constructor() {
    this.snake = new Snake();
    this.food = new Food(this.snake);
    this.noFood = false;
    this.score = 0;
  }

  snakeIsAlive() {
    const { x, y } = this.snake.head;
    if (
      x >= FIELD_WIDTH ||
      x < 0 ||
      y >= FIELD_HEIGHT ||
      y < 0
    ) return false;

    if (this.snake.find(x, y, 1)) return false;

    return true;
  }

  foodIsEaten() {
    const nextPosition = Snake.getNextPosition(this.snake.head, this.snake.direction);
    return this.noFood = nextPosition.x  == this.food.x && nextPosition.y == this.food.y;
  }

  checkAndReplaceFood() {
    if (this.noFood) {
      this.score += 1;
      this.food = new Food(this.snake);
    }
  }

  getHandlers() {
    return {
      up: () => this.snake.turn(DIRECTION.UP),
      down: () => this.snake.turn(DIRECTION.DOWN),
      left: () => this.snake.turn(DIRECTION.LEFT),
      right: () => this.snake.turn(DIRECTION.RIGHT)  
    };
  }

  getFramerate() {
    if (this.snake.length < 4) return FRAMERATE_0;
    if (this.snake.length < 8) return FRAMERATE_1;
    if (this.snake.length < 12) return FRAMERATE_2;
    if (this.snake.length < 20) return FRAMERATE_3;
    return FRAMERATE_4;
  }

  async start() {
    while (this.snakeIsAlive()) {      
      /* Must follow this order: render -> sleep -> clear -> update data  */
      console.clear();
      /* this.snake.turn(Snake.getRandomDirection()); // Play by itself */
      this.snake.walk(this.foodIsEaten());
      this.checkAndReplaceFood();
      consoleRender(this);
      await sleep(this.getFramerate());
    }
    console.log('Game Over');
    console.log('Press Ctrl + C or Esc to exit.\n');
  }
}


function sleep(time) {
  return new Promise(resolve => setTimeout(resolve, time));
} 


function consoleRender(game) {
  const { snake, food } = game;
  const field = new Array(FIELD_HEIGHT);
  for (let i = 0; i < FIELD_WIDTH; i++) {
    field[i] = new Array(FIELD_WIDTH).fill('-');
  }

  /* let i = 0; // For debugging */
  for (const {x, y} of snake) {
    if (x < 0 || y < 0) continue;
    /* field[y][x] = String(i++ % 10); // For debugging */
    field[y][x] = String('#');    
  }

  field[food.y][food.x] = 'o';

  for (let i = 0; i < FIELD_HEIGHT; i++) {
    for (let j = 0; j < FIELD_WIDTH; j++) {
      process.stdout.write(field[i][j]);
    }
    process.stdout.write('\n');
  }
  process.stdout.write(`Score: ${game.score}\n\n`);
}


// const startTime = new Date().getTime();

const game = new Game();
const { up, down, left, right } = game.getHandlers();

const readline = require('readline');
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on('keypress', (_, key) => {
  switch (key.name) {
    case 'up': return up();
    case 'down': return down();
    case 'left': return left();
    case 'right': return right();
    case 'escape': 
      return process.exit();
    case 'c': 
      if (key.ctrl) return process.exit();
      return;
  }
});

game.start();

// console.log(`Time: ${new Date().getTime() - startTime}`);

// module.exports = Snake;

