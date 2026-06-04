// GAME MANAGER
class GameManager {
  constructor() {
    this.currentGame = null;
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Game card clicks
    document.querySelectorAll('.game-card').forEach(card => {
      card.addEventListener('click', () => {
        const game = card.dataset.game;
        this.startGame(game);
      });
    });

    // Back buttons
    document.querySelectorAll('.btn-back').forEach(btn => {
      btn.addEventListener('click', () => {
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

    // Initialize the game
    switch(gameName) {
      case 'memory':
        initMemoryGame();
        break;
      case 'colors':
        initColorsGame();
        break;
      case 'puzzle':
        initPuzzleGame();
        break;
      case 'lines':
        initLinesGame();
        break;
      case 'sounds':
        initSoundsGame();
        break;
      case 'numbers':
        initNumbersGame();
        break;
      case 'simon':
        initSimonGame();
        break;
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

  showWinModal(message = '¡Excelente trabajo, campeón!') {
    document.getElementById('winMessage').textContent = message;
    document.getElementById('winModal').classList.add('active');
    
    setTimeout(() => {
      this.goHome();
    }, 3000);
  }
}

// Initialize on page load
const gameManager = new GameManager();
