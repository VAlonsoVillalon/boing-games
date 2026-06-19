const progressManager = {
  STORAGE_KEY: 'boing_progress',
  GAMES: ['memory', 'colors', 'puzzle', 'lines', 'sounds', 'numbers', 'simon', 'formas', 'letras'],

  _defaultState() {
    const state = {};
    this.GAMES.forEach(g => { state[g] = { stars: 0, plays: 0 }; });
    return state;
  },

  load() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : this._defaultState();
    } catch (_) {
      return this._defaultState();
    }
  },

  save(data) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  },

  getStars(gameName) {
    return this.load()[gameName]?.stars || 0;
  },

  getTotalStars() {
    const data = this.load();
    return Object.values(data).reduce((sum, g) => sum + (g.stars || 0), 0);
  },

  recordWin(gameName, starCount) {
    if (!gameName) return;
    const data = this.load();
    if (!data[gameName]) data[gameName] = { stars: 0, plays: 0 };
    data[gameName].plays++;
    if (starCount > data[gameName].stars) {
      data[gameName].stars = starCount;
    }
    this.save(data);
  },

  renderAll() {
    const data = this.load();

    document.querySelectorAll('.game-card[data-game]').forEach(card => {
      const gameName = card.dataset.game;
      const stars = data[gameName]?.stars || 0;

      let display = card.querySelector('.star-display');
      if (!display) {
        display = document.createElement('div');
        display.className = 'star-display';
        card.appendChild(display);
      }

      const filled = '★'.repeat(stars);
      const empty = '<span class="star-empty">★</span>'.repeat(3 - stars);
      display.innerHTML = filled + empty;
    });

    const totalEl = document.getElementById('totalStarsCount');
    if (totalEl) {
      totalEl.textContent = this.getTotalStars();
    }
  }
};
