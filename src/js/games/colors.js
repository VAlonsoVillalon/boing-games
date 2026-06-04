const colorPairs = [
  { name: 'rojo', hex: '#FF6B6B', emojis: ['🍎', '🌹'] },
  { name: 'azul', hex: '#4ECDC4', emojis: ['🐟', '🌊'] },
  { name: 'amarillo', hex: '#FFE66D', emojis: ['⭐', '🌻'] },
  { name: 'verde', hex: '#95E1D3', emojis: ['🐢', '🍏'] }
];

let colorState = {
  selected: null,
  matched: [],
  isChecking: false
};

function initColorsGame() {
  colorState = {
    selected: null,
    matched: [],
    isChecking: false
  };

  const game = document.getElementById('colorsGame');
  game.innerHTML = '';

  const shuffled = [...colorPairs].sort(() => Math.random() - 0.5);

  shuffled.forEach((pair, idx) => {
    const row = document.createElement('div');
    row.className = 'color-row';

    const color1 = document.createElement('div');
    color1.className = 'color-item';
    color1.style.background = pair.hex;
    color1.dataset.color = pair.name;
    color1.dataset.emoji = pair.emojis[0];
    color1.textContent = pair.emojis[0];
    color1.style.fontSize = '48px';
    color1.style.display = 'flex';
    color1.style.alignItems = 'center';
    color1.style.justifyContent = 'center';
    color1.addEventListener('click', () => selectColor(color1));

    const color2 = document.createElement('div');
    color2.className = 'color-item';
    color2.style.background = pair.hex;
    color2.dataset.color = pair.name;
    color2.dataset.emoji = pair.emojis[1];
    color2.textContent = pair.emojis[1];
    color2.style.fontSize = '48px';
    color2.style.display = 'flex';
    color2.style.alignItems = 'center';
    color2.style.justifyContent = 'center';
    color2.addEventListener('click', () => selectColor(color2));

    row.appendChild(color1);
    row.appendChild(color2);
    game.appendChild(row);
  });
}

function selectColor(element) {
  if (colorState.isChecking) return;
  if (element.classList.contains('selected')) return;

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
      card1.style.opacity = '0.3';
      card2.style.opacity = '0.3';
      card1.style.pointerEvents = 'none';
      card2.style.pointerEvents = 'none';
      colorState.matched.push(card1.dataset.color);

      if (colorState.matched.length === 4) {
        gameManager.showWinModal('¡Emparejaste todos los colores! 🎨');
      }
    } else {
      card1.classList.remove('selected');
      card2.classList.remove('selected');
    }

    colorState.selected = null;
    colorState.isChecking = false;
  }, 800);
}
