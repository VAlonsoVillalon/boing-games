const numberLevels = [
  { emoji: '🍎', count: 2 },
  { emoji: '⭐', count: 3 },
  { emoji: '🐠', count: 4 },
  { emoji: '🌻', count: 5 }
];

let numberState = {
  currentLevel: 0,
  answered: []
};

function initNumbersGame() {
  numberState = {
    currentLevel: 0,
    answered: []
  };

  displayNumbersLevel();
}

function displayNumbersLevel() {
  const game = document.getElementById('numbersGame');
  game.innerHTML = '';

  const level = numberLevels[numberState.currentLevel];

  // Objects to count
  const container = document.createElement('div');
  container.className = 'objects-container';

  for (let i = 0; i < level.count; i++) {
    const obj = document.createElement('div');
    obj.className = 'object-item';
    obj.textContent = level.emoji;
    container.appendChild(obj);
  }

  // Number options
  const optionsContainer = document.createElement('div');
  optionsContainer.className = 'numbers-options';

  const options = generateNumberOptions(level.count);

  options.forEach((num) => {
    const btn = document.createElement('button');
    btn.className = 'number-btn';
    btn.textContent = num;
    btn.addEventListener('click', () => checkNumber(btn, num, level.count));
    optionsContainer.appendChild(btn);
  });

  game.appendChild(container);
  game.appendChild(optionsContainer);
}

function generateNumberOptions(correctNumber) {
  const options = [correctNumber];

  while (options.length < 4) {
    const random = Math.floor(Math.random() * 6) + 1;
    if (!options.includes(random)) {
      options.push(random);
    }
  }

  return options.sort(() => Math.random() - 0.5);
}

function checkNumber(button, selectedNum, correctNum) {
  const allButtons = document.querySelectorAll('.number-btn');
  allButtons.forEach(btn => btn.disabled = true);

  if (selectedNum === correctNum) {
    // Correct
    button.classList.add('correct');
    numberState.answered.push(selectedNum);

    setTimeout(() => {
      if (numberState.answered.length === 4) {
        gameManager.showWinModal('¡Contaste todos correctamente! 🔢');
      } else {
        numberState.currentLevel++;
        displayNumbersLevel();
      }
    }, 1000);
  } else {
    // Wrong
    button.classList.add('wrong');

    // Show correct answer
    const correctBtn = Array.from(allButtons).find(btn => parseInt(btn.textContent) === correctNum);
    if (correctBtn) {
      correctBtn.classList.add('correct');
    }

    setTimeout(() => {
      allButtons.forEach(btn => {
        btn.classList.remove('correct', 'wrong');
        btn.disabled = false;
      });
    }, 1500);
  }
}
