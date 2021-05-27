class View {
  constructor(canvas) {
    this.ctx = canvas.getContext('2d');
  }

  clear() {
    this.ctx.fillStyle = COLOR_BLANK;
    this.ctx.clearRect(0, 0, FIELD_WIDTH * U, FIELD_HEIGHT * U);
  }

  render(game) {
    const { snake, food } = game;
    const ctx = this.ctx;

    ctx.fillStyle = COLOR_FOOD;
    ctx.fillRect(food.x * U + 1, food.y * U + 1, U - 2, U - 2);

    ctx.fillStyle = COLOR_SNAKE_BODY;
    for (const { x, y } of snake) {
      ctx.fillRect(x * U + 1, y * U + 1, U - 2, U - 2);
    }

    const { x, y } = snake.head;
    ctx.fillStyle = COLOR_SNAKE_HEAD;
    ctx.fillRect(x * U + 1, y * U + 1, U - 2, U - 2);
  }
}


/*
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

  let output = '';
  for (let i = 0; i < FIELD_HEIGHT; i++) {
    for (let j = 0; j < FIELD_WIDTH; j++) {
      output += field[i][j];
    }
    output += ('\n');
  }
  output += `Score: ${game.score}\n\n`;
  console.log(output);
}
*/