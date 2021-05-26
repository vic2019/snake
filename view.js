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