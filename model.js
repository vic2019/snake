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
    };
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
    this.view = view;
    this.noFood = false;
    this.controller = new Controller();
    this.killed = false;
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
      clear -> render -> sleep -> update -> check alive
      There should be no rendering after check alive returns false.
    */
    while (this.snakeIsAlive()) {    
      this.view.clear();
      this.view.render(this);
      await sleep(this.getFramerate());
      this.snake.walk(this.foodIsEaten());
      this.checkAndReplaceFood();
      if (this.killed) break;
    }
    this.view.finalRender(this);
  }
}


function sleep(time) {
  return new Promise(resolve => setTimeout(resolve, time));
} 


function bounded(x, y) {
  return x >= 0 && x < FIELD_WIDTH &&
    y >= 0 && y < FIELD_HEIGHT;
}