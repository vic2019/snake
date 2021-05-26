function main() {
  const play = async () => {
    const game = new Game();
    game.setHandlers();
    togglePlayBtn();
    await game.start();
    game.removeHandlers();
    togglePlayBtn();
  }

  const togglePlayBtn = () => {
    if (playBtn.value == '...') {
      playBtn.addEventListener('click', play);
      playBtn.value = playBtn.textContent = 'play';
    } else {
      playBtn.removeEventListener('click', play);
      playBtn.value = playBtn.textContent = '...';
    }
    playBtn.classList.toggle('btn-danger');
  }

  const playBtn = document.getElementById('play');
  playBtn.addEventListener('click', play);
}


main();
