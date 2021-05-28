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
    this.turnLock = false;
  }

  turn(direction) {
    if (this.turnLock) return;

    switch (this.direction) {
      case DIRECTION.UP:
      case DIRECTION.DOWN:
        if (direction == DIRECTION.LEFT || direction == DIRECTION.RIGHT) {
          this.direction = direction;
          this.turnLock = true;
        }
        return;
      case DIRECTION.LEFT:
      case DIRECTION.RIGHT:
        if (direction == DIRECTION.UP || direction == DIRECTION.DOWN) {
          this.direction = direction;
          this.turnLock = true;
        }
        return;
    }
  }

  walk(grow) {
    if (grow) {
      const newHead = new Node(this.getNextPosition());
      this.head.prev = newHead;
      newHead.next = this.head;
      this.head = newHead;
      this.length += 1;
      this.turnLock = false;
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
    newHead.moveTo(this.getNextPosition());
    this.head = newHead; 
    this.turnLock = false;
  }

  find(x, y) {
    let node = this.head;
    while (node != null) {
      if (node.x == x && node.y == y) {
        return node;
      }
      node = node.next;
    }
    return null;
  }

  willDie() {
    const { x, y } = this.getNextPosition();

    if (!bounded(x, y)) return true;

    const node = this.find(x, y);
    if (node && node != this.tail) return true;
    return false;
  }

  getNextPosition() {
    return {
      x: this.head.x + this.direction.x,
      y: this.head.y + this.direction.y
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
    };
    return { next };
  }
}


class Food {
  constructor(snake) {
    let x = Math.floor(Math.random() * FIELD_WIDTH),
        y = Math.floor(Math.random() * FIELD_HEIGHT);
    while (snake.find(x, y)) {
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
    this.view = view;
    this.noFood = false;
    this.controller = new Controller();
    this.killed = false;
  }

  get score() {
    return this.snake.length - 1;
  }

  foodIsEaten() {
    const { x, y } = this.snake.getNextPosition();
    return this.noFood = x  == this.food.x && y == this.food.y;
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
      right: () => this.snake.turn(DIRECTION.RIGHT),
      kill: () => this.killed = true
    };
  }

  getFramerate() {
    if (this.snake.length < 3) return FRAMERATE_0;
    if (this.snake.length < 7) return FRAMERATE_1;
    if (this.snake.length < 11) return FRAMERATE_2;
    if (this.snake.length < 19) return FRAMERATE_3;
    if (this.snake.length < 32) return FRAMERATE_4;
    return FRAMERATE_5;
  }

  setHandlers() {
    this.controller.set(this.getHandlers());
  }

  removeHandlers() {
    this.controller.removeHandlers();
  }

  async start() {
    /* 
      The loop must follow this order: 
      clear -> render -> sleep -> check if will die after next update -> update
      Do not render if snake will die after next update.
    */
    while (true) {    
      this.view.clear();
      this.view.render(this);
      await sleep(this.getFramerate());
      if (this.killed || this.snake.willDie()) {
        this.view.finalRender(this);
        break;
      }
      this.snake.walk(this.foodIsEaten());
      this.checkAndReplaceFood();
    }
  }
}


function sleep(time) {
  return new Promise(resolve => setTimeout(resolve, time));
} 


function bounded(x, y) {
  return x >= 0 && x < FIELD_WIDTH &&
    y >= 0 && y < FIELD_HEIGHT;
}