const puzzlePieces = [
  { emoji: '🐱', name: 'gato' },
  { emoji: '🦁', name: 'leon' },
  { emoji: '🐻', name: 'oso' },
  { emoji: '🐼', name: 'panda' }
];

let puzzleState = {
  placed: [],
  selectedPiece: null,
  wrong: 0
};

function initPuzzleGame() {
  puzzleState = {
    placed: [],
    selectedPiece: null,
    wrong: 0
  };

  const game = document.getElementById('puzzleGame');
  game.innerHTML = '';

  const slotsContainer = document.createElement('div');
  slotsContainer.style.marginBottom = '2rem';

  const shuffledForDisplay = [...puzzlePieces].sort(() => Math.random() - 0.5);

  shuffledForDisplay.forEach((piece) => {
    const slot = document.createElement('div');
    slot.className = 'puzzle-slot';
    slot.dataset.target = piece.name;
    slot.style.position = 'relative';
    slot.style.overflow = 'hidden';

    const ghost = document.createElement('div');
    ghost.style.position = 'absolute';
    ghost.style.fontSize = '48px';
    ghost.style.opacity = '0.1';
    ghost.style.top = '50%';
    ghost.style.left = '50%';
    ghost.style.transform = 'translate(-50%, -50%)';
    ghost.style.pointerEvents = 'none';
    ghost.textContent = piece.emoji;
    slot.appendChild(ghost);

    slot.addEventListener('click', () => dropPuzzlePiece(slot, piece.name));
    slotsContainer.appendChild(slot);
  });

  const piecesContainer = document.createElement('div');
  piecesContainer.className = 'puzzle-pieces';

  const shuffled = [...puzzlePieces].sort(() => Math.random() - 0.5);

  shuffled.forEach((piece) => {
    const btn = document.createElement('button');
    btn.className = 'puzzle-piece';
    btn.textContent = piece.emoji;
    btn.dataset.piece = piece.name;
    btn.addEventListener('click', () => selectPuzzlePiece(btn, piece.name));
    piecesContainer.appendChild(btn);
  });

  game.appendChild(slotsContainer);
  game.appendChild(piecesContainer);
}

function selectPuzzlePiece(element, name) {
  if (element.classList.contains('placed')) return;

  if (puzzleState.selectedPiece) {
    puzzleState.selectedPiece.style.borderColor = '#ccc';
    puzzleState.selectedPiece.style.background = 'white';
  }

  puzzleState.selectedPiece = element;
  element.style.borderColor = '#4ECDC4';
  element.style.background = '#E0F7F6';
}

function dropPuzzlePiece(slot, targetName) {
  if (!puzzleState.selectedPiece) return;

  const pieceName = puzzleState.selectedPiece.dataset.piece;

  if (pieceName === targetName) {
    soundUtils.playCorrect();
    slot.textContent = puzzleState.selectedPiece.textContent;
    slot.classList.add('filled');
    slot.style.pointerEvents = 'none';
    puzzleState.selectedPiece.classList.add('placed');
    puzzleState.selectedPiece.style.pointerEvents = 'none';
    puzzleState.placed.push(targetName);

    puzzleState.selectedPiece.style.borderColor = '#ccc';
    puzzleState.selectedPiece.style.background = 'white';
    puzzleState.selectedPiece = null;

    if (puzzleState.placed.length === 4) {
      const stars = puzzleState.wrong === 0 ? 3 : puzzleState.wrong <= 1 ? 2 : 1;
      setTimeout(() => {
        gameManager.showWinModal('¡Armaste el puzzle!', stars);
      }, 500);
    }
  } else {
    soundUtils.playWrong();
    puzzleState.wrong++;
    slot.style.animation = 'none';
    setTimeout(() => {
      slot.style.animation = 'shake 0.3s';
    }, 10);
  }
}

// Add shake animation
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }
`;
document.head.appendChild(style);
