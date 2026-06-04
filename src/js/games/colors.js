const colorPairs = [
  { name: 'rojo', hex: '#FF6B6B', emojis: ['🍎', '🌹'] },
  { name: 'azul', hex: '#4ECDC4', emojis: ['🐟', '🌊'] },
  { name: 'amarillo', hex: '#FFE66D', emojis: ['⭐', '🌻'] },
  { name: 'verde', hex: '#95E1D3', emojis: ['🐢', '🍏'] }
];

let colorState = {
  selected: null,
  matched: [],
  isChecking: false,
  cards: []
};

function initColorsGame() {
  colorState = {
    selected: null,
    matched: [],
    isChecking: false,
    cards: []
  };

  const game = document.getElementById('colorsGame');
  game.innerHTML = '';

  // Crear array con todos los elementos (8 totales: 2 de cada color)
  const allItems = [];
  colorPairs.forEach((pair) => {
    allItems.push({ color: pair.name, hex: pair.hex, emoji: pair.emojis[0] });
    allItems.push({ color: pair.name, hex: pair.hex, emoji: pair.emojis[1] });
  });

  // Mezclar completamente
  const shuffled = allItems.sort(() => Math.random() - 0.5);

  // Mostrar en grid 2x4
  const gridContainer = document.createElement('div');
  gridContainer.style.display = 'grid';
  gridContainer.style.gridTemplateColumns = 'repeat(2, 1fr)';
  gridContainer.style.gap = '12px';

  shuffled.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'color-item';
    card.style.background = item.hex;
    card.style.fontSize = '48px';
    card.style.display = 'flex';
    card.style.alignItems = 'center';
    card.style.justifyContent = 'center';
    card.dataset.color = item.color;
    card.dataset.emoji = item.emoji;
    card.textContent = item.emoji;
    card.addEventListener('click', () => selectColor(card));
    
    gridContainer.appendChild(card);
    colorState.cards.push(card);
  });

  game.appendChild(gridContainer);
}

function selectColor(element) {
  if (colorState.isChecking) return;
  if (element.classList.contains('selected') || element.classList.contains('matched')) return;

  element.classList.add('selected');

  if (!colorState.selected) {
    colorState.selected = element;
  } else {
    colorState.isChecking = true;
    checkColorMatch(colorState.selected, element);
  }
}

function checkColorMatch(card1, card2) {
  const match = card1.dataset.color === card2.dataset.color;

  setTimeout(() => {
    if (match) {
      card1.classList.add('matched');
      card2.classList.add('matched');
      card1.style.opacity = '0.2';
      card2.style.opacity = '0.2';
      card1.style.pointerEvents = 'none';
      card2.style.pointerEvents = 'none';
      colorState.matched.push(card1.dataset.color);

      if (colorState.matched.length === 4) {
        setTimeout(() => {
          gameManager.showWinModal('¡Emparejaste todos los colores! 🎨');
        }, 400);
      }
    } else {
      card1.classList.remove('selected');
      card2.classList.remove('selected');
    }

    colorState.selected = null;
    colorState.isChecking = false;
  }, 800);
}
