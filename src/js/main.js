// GAME MANAGER
class GameManager {
  constructor() {
    this.currentGame = null;
    this.checkPremium();
    this.setupEventListeners();
    this.setupParentZoneTrigger();
    progressManager.renderAll();
  }

  checkPremium() {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('premium');
    if (token) {
      localStorage.setItem('boing_premium', token);
      window.history.replaceState({}, '', window.location.pathname);
    }
    if (localStorage.getItem('boing_premium')) {
      document.body.classList.add('is-premium');
    }
  }

  setupParentZoneTrigger() {
    const mascot = document.getElementById('boingMascot');
    if (!mascot) return;
    let pressTimer = null;

    const startPress = () => {
      mascot.classList.add('mascot-press');
      pressTimer = setTimeout(() => {
        mascot.classList.remove('mascot-press');
        this.openParentScreen();
      }, 3000);
    };

    const cancelPress = () => {
      mascot.classList.remove('mascot-press');
      clearTimeout(pressTimer);
    };

    mascot.addEventListener('mousedown', startPress);
    mascot.addEventListener('touchstart', startPress, { passive: true });
    mascot.addEventListener('mouseup', cancelPress);
    mascot.addEventListener('mouseleave', cancelPress);
    mascot.addEventListener('touchend', cancelPress);
  }

  openParentScreen() {
    this.updateParentProgress();
    document.getElementById('parentScreen').classList.add('active');
  }

  updateParentProgress() {
    const data = progressManager.load();
    const gameNames = {
      memory: 'Memoria', colors: 'Colores', puzzle: 'Puzzle',
      lines: 'Líneas', sounds: 'Sonidos', numbers: 'Números',
      simon: 'Simon', formas: 'Formas', letras: 'Letras'
    };
    const tbody = document.getElementById('parentProgressBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    Object.entries(gameNames).forEach(([key, label]) => {
      const g = data[key] || { stars: 0, plays: 0 };
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${label}</td><td>${'★'.repeat(g.stars)}${'☆'.repeat(3 - g.stars)}</td><td>${g.plays}</td>`;
      tbody.appendChild(tr);
    });
    const totalEl = document.getElementById('parentTotalStars');
    if (totalEl) totalEl.textContent = progressManager.getTotalStars();
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
    setTimeout(() => { if (el.parentNode) el.remove(); }, (delay + duration + 0.3) * 1000);
  }
}

const gameManager = new GameManager();
