const memoryEmojis = ['🐱', '🐶', '🐸', '🦋', '🌸', '🍎', '🐱', '🐶', '🐸', '🦋', '🌸', '🍎'];

let memoryState = {
  flipped: [],
  matched: [],
  isChecking: false
};

function initMemoryGame() {
  memoryState = {
    flipped: [],
    matched: [],
    isChecking: false
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
    checkMemoryMatch();
  }
}

function checkMemoryMatch() {
  const [card1, card2] = memoryState.flipped;

  if (card1.dataset.emoji === card2.dataset.emoji) {
    // Match!
    card1.classList.add('matched');
    card2.classList.add('matched');
    memoryState.matched.push(card1.dataset.emoji);
    memoryState.flipped = [];
    memoryState.isChecking = false;

    if (memoryState.matched.length === 6) {
      setTimeout(() => {
        gameManager.showWinModal('¡Encontraste todos los pares! 🎉');
      }, 500);
    }
  } else {
    // No match
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
