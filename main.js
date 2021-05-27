function main() {
  const play = async () => {
    const game = new Game();
    game.setHandlers();
    togglePlay(game);
    await game.start();
    game.removeHandlers();
    togglePlay(game);
  };

  const handleClick = () => {
    /* Must unfocus playBtn. See comment below */
    playBtn.blur();
    play();
  };
  
  const handleSpaceBar = ev => {
    if (ev.keyCode != 32) return;
    play();
  };

  const togglePlay = game => {
    /* Space Bar keydown will trigger mouse click when playBtn is focused.
      Must blur playBtn before adding game.controller.kill */
    playBtn.blur();
    if (playBtn.value == 'play') {
      document.removeEventListener('keydown', handleSpaceBar);
      playBtn.removeEventListener('click', handleClick);
      playBtn.addEventListener('click', game.controller.kill);
      playBtn.value = playBtn.textContent = 'quit';
    } else {
      playBtn.removeEventListener('click', game.controller.kill);
      playBtn.addEventListener('click', handleClick);
      playBtn.value = playBtn.textContent = 'play';
      document.addEventListener('keydown', handleSpaceBar);
    }
    playBtn.classList.toggle('btn-danger')
  };

  const playBtn = document.getElementById('play');
  document.addEventListener('keydown', handleSpaceBar);
  playBtn.addEventListener('click', handleClick);
}


main();
