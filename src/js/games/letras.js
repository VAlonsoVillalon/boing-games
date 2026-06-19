const letrasPool = [
  { upper: 'A', lower: 'a', color: '#FF6B9D' },
  { upper: 'B', lower: 'b', color: '#4ECDC4' },
  { upper: 'C', lower: 'c', color: '#FFE66D' },
  { upper: 'D', lower: 'd', color: '#FF8C42' },
  { upper: 'E', lower: 'e', color: '#9966FF' },
  { upper: 'F', lower: 'f', color: '#1D9E75' },
  { upper: 'M', lower: 'm', color: '#378ADD' },
  { upper: 'N', lower: 'n', color: '#D4537E' },
  { upper: 'O', lower: 'o', color: '#639922' },
  { upper: 'P', lower: 'p', color: '#BA7517' },
  { upper: 'S', lower: 's', color: '#E24B4A' },
  { upper: 'T', lower: 't', color: '#00D4FF' }
];

let letrasState = { round: 0, wrong: 0, used: [], target: null, disabled: false };

function initLetrasGame() {
  letrasState = { round: 0, wrong: 0, used: [], target: null, disabled: false };
  displayLetrasRound();
}

function displayLetrasRound() {
  const game = document.getElementById('letrasGame');
  game.innerHTML = '';

  const available = letrasPool.filter(l => !letrasState.used.includes(l.upper));
  const target = available[Math.floor(Math.random() * available.length)];
  letrasState.target = target;
  letrasState.used.push(target.upper);

  const counter = document.createElement('div');
  counter.className = 'letras-counter';
  counter.textContent = `${letrasState.round + 1} / 5`;
  game.appendChild(counter);

  const prompt = document.createElement('div');
  prompt.className = 'letras-prompt';
  prompt.textContent = target.upper;
  prompt.style.color = target.color;
  game.appendChild(prompt);

  const question = document.createElement('p');
  question.className = 'letras-question';
  question.textContent = '¿Cuál es la letra minúscula?';
  game.appendChild(question);

  const distractors = letrasPool.filter(l => l.upper !== target.upper);
  const choices = [target.lower];
  while (choices.length < 4) {
    const rand = distractors[Math.floor(Math.random() * distractors.length)].lower;
    if (!choices.includes(rand)) choices.push(rand);
  }
  choices.sort(() => Math.random() - 0.5);

  const choicesGrid = document.createElement('div');
  choicesGrid.className = 'letras-choices';

  choices.forEach(letter => {
    const btn = document.createElement('button');
    btn.className = 'letra-btn';
    btn.textContent = letter;
    btn.addEventListener('click', () => checkLetra(letter, btn));
    choicesGrid.appendChild(btn);
  });

  game.appendChild(choicesGrid);
}

function checkLetra(letter, btn) {
  if (letrasState.disabled) return;
  letrasState.disabled = true;

  if (letter === letrasState.target.lower) {
    btn.classList.add('correct');
    soundUtils.playCorrect();
    letrasState.round++;
    if (letrasState.round >= 5) {
      const stars = letrasState.wrong === 0 ? 3 : letrasState.wrong <= 2 ? 2 : 1;
      setTimeout(() => gameManager.showWinModal('¡Conoces las letras!', stars), 800);
    } else {
      setTimeout(() => {
        letrasState.disabled = false;
        displayLetrasRound();
      }, 800);
    }
  } else {
    btn.classList.add('wrong');
    soundUtils.playWrong();
    letrasState.wrong++;
    setTimeout(() => {
      btn.classList.remove('wrong');
      letrasState.disabled = false;
    }, 800);
  }
}
