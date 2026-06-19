const numberLevels = [
  { emoji: '🍎', count: 2 },
  { emoji: '⭐', count: 3 },
  { emoji: '🐠', count: 4 },
  { emoji: '🌻', count: 5 },
  { emoji: '🎈', count: 2 },
  { emoji: '🍌', count: 3 },
  { emoji: '🦋', count: 4 },
  { emoji: '🌈', count: 5 }
];

let numberState = {
  currentLevelIndex: 0,
  answered: [],
  usedLevels: [],
  wrong: 0
};

function initNumbersGame() {
  numberState = {
    currentLevelIndex: 0,
    answered: [],
    usedLevels: [],
    wrong: 0
  };

  displayNumbersLevel();
}

function displayNumbersLevel() {
  const game = document.getElementById('numbersGame');
  game.innerHTML = '';

  const availableLevels = numberLevels.filter((_, idx) => !numberState.usedLevels.includes(idx));

  if (availableLevels.length === 0) {
    numberState.usedLevels = [];
  }

  const randomIdx = Math.floor(Math.random() * availableLevels.length);
  const selectedLevel = availableLevels[randomIdx];
  const actualIndex = numberLevels.indexOf(selectedLevel);
  numberState.usedLevels.push(actualIndex);

  const level = selectedLevel;

  const container = document.createElement('div');
  container.className = 'objects-container';

  for (let i = 0; i < level.count; i++) {
    const obj = document.createElement('div');
    obj.className = 'object-item';
    obj.textContent = level.emoji;
    container.appendChild(obj);
  }

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
    soundUtils.playCorrect();
    button.classList.add('correct');
    numberState.answered.push(selectedNum);

    setTimeout(() => {
      if (numberState.answered.length === 4) {
        const stars = numberState.wrong === 0 ? 3 : numberState.wrong <= 1 ? 2 : 1;
        gameManager.showWinModal('¡Contaste todos correctamente!', stars);
      } else {
        displayNumbersLevel();
      }
    }, 1000);
  } else {
    soundUtils.playWrong();
    numberState.wrong++;
    button.classList.add('wrong');

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
