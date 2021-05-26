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
const FRAMERATE_0 = 700;
const FRAMERATE_1 = 600;
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
    this.lock = false;
  }

  index(i = 0) {
    let node = this.head;
    let index = 0;
    for (; node && index < i; index++) {
      node = node.next;
    }
    return index == i ? node : null;
  }

  turn(direction) {
    if (this.lock) return;

    switch (this.direction) {
      case DIRECTION.UP:
      case DIRECTION.DOWN:
        if (direction == DIRECTION.LEFT || direction == DIRECTION.RIGHT) {
          this.direction = direction;
          this.lock = true;
        }
        return;
      case DIRECTION.LEFT:
      case DIRECTION.RIGHT:
        if (direction == DIRECTION.UP || direction == DIRECTION.DOWN) {
          this.direction = direction;
          this.lock = true;
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
      this.lock = false;
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
    this.lock = false;
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
    this.controller = new Controller();
  }

  get score() {
    return this.snake.length - 1;
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

  setHandlers() {
    this.controller.reset(this.getHandlers());
  }

  async start() {
    while (this.snakeIsAlive()) {      
      /* Must follow this order: render -> sleep -> clear -> update data  */
      console.clear();
      this.snake.walk(this.foodIsEaten());
      this.checkAndReplaceFood();
      consoleRender(this);
      await sleep(this.getFramerate());
    }
    console.log('Game Over');
    console.log('Press Ctrl+C or Esc to exit.\n');
  }
}


function sleep(time) {
  return new Promise(resolve => setTimeout(resolve, time));
} 

function bounded(x, y) {
  return x >= 0 && x < FIELD_WIDTH &&
    y >= 0 && y < FIELD_HEIGHT;
}

function consoleRender(game) {
  const { snake, food } = game;
  const field = new Array(FIELD_HEIGHT);
  for (let i = 0; i < FIELD_WIDTH; i++) {
    field[i] = new Array(FIELD_WIDTH).fill('-');
  }

  field[food.y][food.x] = 'o';
  for (const { x, y } of snake) {
    if (bounded(x, y)) field[y][x] = String('U');
  }
  const { x, y } = snake.head;
  if (bounded(x, y)) field[y][x] = String('O');


  for (let i = 0; i < FIELD_HEIGHT; i++) {
    for (let j = 0; j < FIELD_WIDTH; j++) {
      process.stdout.write(field[i][j]);
    }
    process.stdout.write('\n');
  }
  process.stdout.write(`Score: ${game.score}\n\n`);
}


class Controller {
  constructor(handlers) {
    const readline = require('readline');
    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);
    if (handlers) this.reset(handlers);
  }

  reset({ up, down, left, right }) {
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
  }
}


const game = new Game();
game.setHandlers();
game.start();
