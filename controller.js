class Controller {
  constructor() {
    this.upBtn = document.getElementById('up');
    this.downBtn = document.getElementById('down');
    this.leftBtn = document.getElementById('left');
    this.rightBtn = document.getElementById('right');
  }

  set({ up, down, left, right, kill }) {
    this.upBtn.addEventListener('click', _ => { up(); this.upBtn.blur(); });
    this.downBtn.addEventListener('click', _ => { down(); this.downBtn.blur(); });
    this.leftBtn.addEventListener('click', _ => { left(); this.leftBtn.blur(); });
    this.rightBtn.addEventListener('click', _ => { right(); this.rightBtn.blur(); });

    const handleKeydown = ev => {
      switch (ev.keyCode) {
        case 37: return left();
        case 38: return up();
        case 39: return right();
        case 40: return down();
        case 27: return kill();
      }
    };
    document.addEventListener('keydown', handleKeydown);

    this.up = up;
    this.down = down;
    this.left = left;
    this.right = right;
    this.kill = kill;
    this.handleKeydown = handleKeydown;
  }

  removeHandlers() {
    document.removeEventListener('keydown', this.handleKeydown);
    this.upBtn.removeEventListener('click', this.up);
    this.downBtn.removeEventListener('click', this.down);
    this.leftBtn.removeEventListener('click', this.left);
    this.rightBtn.removeEventListener('click', this.right);
  }
}