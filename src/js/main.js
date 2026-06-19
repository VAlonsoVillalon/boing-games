// GAME MANAGER
class GameManager {
  constructor() {
    this.currentGame = null;
    this.setupEventListeners();
    progressManager.renderAll();
  }

  setupEventListeners() {
    document.querySelectorAll('.game-card').forEach(card => {
      card.addEventListener('click', () => {
        soundUtils.playClick();
        const game = card.dataset.game;
        this.startGame(game);
      });
    });

    document.querySelectorAll('.btn-back').forEach(btn => {
      btn.addEventListener('click', () => {
        soundUtils.playClick();
        this.goHome();
      });
    });
  }

  startGame(gameName) {
    this.hideAllScreens();
    this.currentGame = gameName;

    const screenId = `${gameName}Screen`;
    const screen = document.getElementById(screenId);
    if (screen) {
      screen.classList.add('active');
    }

    switch (gameName) {
      case 'memory':  initMemoryGame();  break;
      case 'colors':  initColorsGame();  break;
      case 'puzzle':  initPuzzleGame();  break;
      case 'lines':   initLinesGame();   break;
      case 'sounds':  initSoundsGame();  break;
      case 'numbers': initNumbersGame(); break;
      case 'simon':   initSimonGame();   break;
      case 'formas':  initFormasGame();  break;
      case 'letras':  initLetrasGame();  break;
    }
  }

  goHome() {
    this.hideAllScreens();
    document.getElementById('homeScreen').classList.add('active');
    document.getElementById('winModal').classList.remove('active');
    this.currentGame = null;
  }

  hideAllScreens() {
    document.querySelectorAll('.screen').forEach(screen => {
      screen.classList.remove('active');
    });
  }

  showWinModal(message = '¡Excelente trabajo, campeón!', starCount = 1) {
    triggerConfetti();
    soundUtils.playFanfare();

    const starsEl = document.getElementById('winStars');
    if (starsEl) {
      starsEl.innerHTML =
        '★'.repeat(starCount) +
        '<span class="win-star-empty">★</span>'.repeat(3 - starCount);
    }

    document.getElementById('winMessage').textContent = message;
    document.getElementById('winModal').classList.add('active');

    progressManager.recordWin(this.currentGame, starCount);
    progressManager.renderAll();

    setTimeout(() => {
      this.goHome();
    }, 3500);
  }
}

function triggerConfetti() {
  const colors = ['#FF6B9D', '#4ECDC4', '#FFE66D', '#FF8C42', '#9966FF', '#00D4FF', '#95E1D3'];
  for (let i = 0; i < 45; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    const color = colors[Math.floor(Math.random() * colors.length)];
    const x = Math.random() * 100;
    const delay = Math.random() * 0.6;
    const duration = 1.5 + Math.random();
    const size = 6 + Math.floor(Math.random() * 9);
    const isCircle = Math.random() > 0.5;
    el.style.cssText = `left:${x}vw;width:${size}px;height:${isCircle ? size : Math.round(size * 1.6)}px;background:${color};border-radius:${isCircle ? '50%' : '2px'};animation-delay:${delay}s;animation-duration:${duration}s;`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), (delay + duration + 0.3) * 1000);
  }
}

const gameManager = new GameManager();
