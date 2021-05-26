const readline = require('readline');
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on('keypress', (_, key) => {
  if (key.ctrl && key.name === 'c') return process.exit();
  console.log(key);
});