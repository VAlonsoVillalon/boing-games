const simonColors = [
  { name: 'rojo', hex: '#FF6B6B', sound: 400 },
  { name: 'azul', hex: '#4ECDC4', sound: 600 },
  { name: 'verde', hex: '#95E1D3', sound: 800 },
  { name: 'amarillo', hex: '#FFE66D', sound: 1000 }
];

let simonState = {
  sequence: [],
  userSequence: [],
  isPlaying: false,
  level: 0,
  round: 1
};

function initSimonGame() {
  simonState = {
    sequence: [],
    userSequence: [],
    isPlaying: false,
    level: 0,
    round: 1
  };

  const game = document.getElementById('simonGame');
  game.innerHTML = '';

  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.gap = '2rem';

  const levelInfo = document.createElement('div');
  levelInfo.id = 'simonLevelInfo';
  levelInfo.style.textAlign = 'center';
  levelInfo.style.fontSize = '24px';
  levelInfo.style.fontWeight = '700';
  levelInfo.style.color = '#2c2c2a';
  levelInfo.textContent = 'Nivel 1 - Escucha la secuencia';

  const simonGrid = document.createElement('div');
  simonGrid.id = 'simonGrid';
  simonGrid.style.display = 'grid';
  simonGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
  simonGrid.style.gap = '12px';
  simonGrid.style.marginBottom = '2rem';

  simonColors.forEach((color) => {
    const btn = document.createElement('button');
    btn.className = 'simon-btn';
    btn.dataset.color = color.name;
    btn.dataset.sound = color.sound;
    btn.style.background = color.hex;
    btn.style.border = 'none';
    btn.style.borderRadius = '12px';
    btn.style.cursor = 'pointer';
    btn.style.minHeight = '100px';
    btn.style.transition = 'transform 0.1s, box-shadow 0.1s';
    btn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
    btn.addEventListener('click', () => simonButtonClick(btn));
    simonGrid.appendChild(btn);
  });

  const startBtn = document.createElement('button');
  startBtn.id = 'simonStartBtn';
  startBtn.style.width = '100%';
  startBtn.style.padding = '16px';
  startBtn.style.background = '#FF6B9D';
  startBtn.style.color = 'white';
  startBtn.style.border = 'none';
  startBtn.style.borderRadius = '12px';
  startBtn.style.fontSize = '16px';
  startBtn.style.fontWeight = '600';
  startBtn.style.cursor = 'pointer';
  startBtn.textContent = 'Comenzar Juego';
  startBtn.addEventListener('click', () => startSimonGame());

  container.appendChild(levelInfo);
  container.appendChild(simonGrid);
  container.appendChild(startBtn);
  game.appendChild(container);
}

function startSimonGame() {
  simonState.sequence = [];
  simonState.userSequence = [];
  simonState.level = 0;
  simonState.round = 1;
  document.getElementById('simonStartBtn').style.display = 'none';
  playSimonRound();
}

function playSimonRound() {
  simonState.isPlaying = true;
  simonState.userSequence = [];

  const randomColor = simonColors[Math.floor(Math.random() * simonColors.length)];
  simonState.sequence.push(randomColor);
  simonState.level = simonState.sequence.length;

  document.getElementById('simonLevelInfo').textContent = `Nivel ${simonState.level} - Escucha la secuencia`;

  let delay = 1000;
  simonState.sequence.forEach((color) => {
    setTimeout(() => {
      flashButton(color.name);
      playSimonSound(color.sound);
    }, delay);
    delay += 800;
  });

  setTimeout(() => {
    simonState.isPlaying = false;
    document.getElementById('simonLevelInfo').textContent = `Nivel ${simonState.level} - ¡Tu turno!`;
  }, delay);
}

function flashButton(colorName) {
  const buttons = document.querySelectorAll('.simon-btn');
  const btn = Array.from(buttons).find(b => b.dataset.color === colorName);

  if (btn) {
    btn.style.transform = 'scale(0.95)';
    btn.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.5)';

    setTimeout(() => {
      btn.style.transform = 'scale(1)';
      btn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
    }, 300);
  }
}

function simonButtonClick(btn) {
  if (simonState.isPlaying) return;

  const colorName = btn.dataset.color;
  const sound = parseInt(btn.dataset.sound);

  flashButton(colorName);
  playSimonSound(sound);

  simonState.userSequence.push(colorName);

  const lastIndex = simonState.userSequence.length - 1;
  const expectedColor = simonState.sequence[lastIndex];

  if (simonState.userSequence[lastIndex] !== expectedColor) {
    simonGameOver();
    return;
  }

  if (simonState.userSequence.length === simonState.sequence.length) {
    setTimeout(() => {
      playSimonRound();
    }, 1500);
  }
}

function simonGameOver() {
  simonState.isPlaying = true;
  const levelInfoEl = document.getElementById('simonLevelInfo');
  levelInfoEl.style.color = '#FF6B6B';
  levelInfoEl.textContent = `¡Game Over! Llegaste al Nivel ${simonState.level}`;

  const stars = simonState.level >= 6 ? 3 : simonState.level >= 4 ? 2 : 1;
  setTimeout(() => {
    gameManager.showWinModal(`¡Excelente! Llegaste al nivel ${simonState.level}`, stars);
  }, 2000);
}

function playSimonSound(frequency) {
  const ctx = soundUtils.ctx;
  const now = ctx.currentTime;
  const duration = 0.2;

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.frequency.value = frequency;
  oscillator.type = 'sine';

  gainNode.gain.setValueAtTime(0.3, now);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

  oscillator.start(now);
  oscillator.stop(now + duration);
}
