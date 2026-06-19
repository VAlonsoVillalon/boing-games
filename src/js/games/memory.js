const memoryEmojis = ['🐱', '🐶', '🐸', '🦋', '🌸', '🍎', '🐱', '🐶', '🐸', '🦋', '🌸', '🍎'];

let memoryState = {
  flipped: [],
  matched: [],
  isChecking: false,
  totalFlips: 0
};

function initMemoryGame() {
  memoryState = {
    flipped: [],
    matched: [],
    isChecking: false,
    totalFlips: 0
  };

  const grid = document.getElementById('memoryGrid');
  grid.innerHTML = '';

  const shuffled = [...memoryEmojis].sort(() => Math.random() - 0.5);

  shuffled.forEach((emoji, idx) => {
    const card = document.createElement('button');
    card.className = 'memory-card';
    card.textContent = '?';
    card.dataset.emoji = emoji;
    card.dataset.index = idx;
    card.addEventListener('click', () => flipMemoryCard(card));
    grid.appendChild(card);
  });
}

function flipMemoryCard(card) {
  if (memoryState.isChecking) return;
  if (card.classList.contains('revealed') || card.classList.contains('matched')) return;
  if (memoryState.flipped.length >= 2) return;

  card.textContent = card.dataset.emoji;
  card.classList.add('revealed');
  memoryState.flipped.push(card);

  if (memoryState.flipped.length === 2) {
    memoryState.isChecking = true;
    memoryState.totalFlips++;
    checkMemoryMatch();
  }
}

function checkMemoryMatch() {
  const [card1, card2] = memoryState.flipped;

  if (card1.dataset.emoji === card2.dataset.emoji) {
    soundUtils.playCorrect();
    card1.classList.add('matched');
    card2.classList.add('matched');
    memoryState.matched.push(card1.dataset.emoji);
    memoryState.flipped = [];
    memoryState.isChecking = false;

    if (memoryState.matched.length === 6) {
      const stars = memoryState.totalFlips < 8 ? 3 : memoryState.totalFlips < 10 ? 2 : 1;
      setTimeout(() => {
        gameManager.showWinModal('¡Encontraste todos los pares!', stars);
      }, 500);
    }
  } else {
    soundUtils.playWrong();
    setTimeout(() => {
      card1.textContent = '?';
      card2.textContent = '?';
      card1.classList.remove('revealed');
      card2.classList.remove('revealed');
      memoryState.flipped = [];
      memoryState.isChecking = false;
    }, 1200);
  }
}
