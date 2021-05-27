function main() {
  // const root = document.documentElement;
  // root.style.setProperty('--unit-width', UW);
  // root.style.setProperty('--unit-height', UH);
  // root.style.setProperty('--field-width', UW * FIELD_WIDTH);
  // root.style.setProperty('--field-height', UH * FIELD_HEIGHT);
  
  const play = async () => {
    const game = new Game();
    game.setHandlers();
    togglePlayBtn(game);
    await game.start();
    game.removeHandlers();
    togglePlayBtn(game);
  }

  const spaceBar = ev => ev.keyCode == 32 && play();

  const togglePlayBtn = game => {
    if (playBtn.value == 'quit') {
      document.addEventListener('keydown', spaceBar);
      playBtn.removeEventListener('click', game.controller.kill);
      playBtn.addEventListener('click', play);
      playBtn.value = playBtn.textContent = 'play';
    } else {
      document.removeEventListener('keydown', spaceBar);
      playBtn.removeEventListener('click', play);
      playBtn.addEventListener('click', game.controller.kill);
      playBtn.value = playBtn.textContent = 'quit';
    }
    playBtn.classList.toggle('btn-danger');
  }

  const playBtn = document.getElementById('play');
  document.addEventListener('keydown', spaceBar);
  playBtn.addEventListener('click', play);
}


main();
