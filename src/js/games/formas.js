const shapeDefs = [
  { id: 'circle',    name: 'círculo',    color: '#FF6B9D' },
  { id: 'square',    name: 'cuadrado',   color: '#4ECDC4' },
  { id: 'triangle',  name: 'triángulo',  color: '#FFE66D' },
  { id: 'star',      name: 'estrella',   color: '#FF8C42' },
  { id: 'diamond',   name: 'rombo',      color: '#9966FF' },
  { id: 'rectangle', name: 'rectángulo', color: '#1D9E75' }
];

let formasState = { round: 0, wrong: 0, usedShapes: [], target: null, disabled: false };

function buildShape(id, color, size) {
  const wrapper = document.createElement('div');
  wrapper.style.cssText = `width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center;`;

  const s = document.createElement('div');
  const half = Math.round(size * 0.6);

  switch (id) {
    case 'circle':
      s.style.cssText = `width:${size}px;height:${size}px;border-radius:50%;background:${color};`;
      break;
    case 'square':
      s.style.cssText = `width:${size}px;height:${size}px;border-radius:${Math.round(size * 0.07)}px;background:${color};`;
      break;
    case 'triangle':
      s.style.cssText = `width:0;height:0;border-left:${half}px solid transparent;border-right:${half}px solid transparent;border-bottom:${size}px solid ${color};background:none;`;
      break;
    case 'star':
      s.style.cssText = `width:${size}px;height:${size}px;background:${color};clip-path:polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%);`;
      break;
    case 'diamond':
      const d = Math.round(size * 0.72);
      s.style.cssText = `width:${d}px;height:${d}px;background:${color};transform:rotate(45deg);border-radius:${Math.round(d * 0.07)}px;`;
      break;
    case 'rectangle':
      s.style.cssText = `width:${Math.round(size * 1.5)}px;height:${Math.round(size * 0.6)}px;background:${color};border-radius:${Math.round(size * 0.07)}px;`;
      break;
  }

  wrapper.appendChild(s);
  return wrapper;
}

function initFormasGame() {
  formasState = { round: 0, wrong: 0, usedShapes: [], target: null, disabled: false };
  displayFormasRound();
}

function displayFormasRound() {
  const game = document.getElementById('formasGame');
  game.innerHTML = '';

  const available = shapeDefs.filter(s => !formasState.usedShapes.includes(s.id));
  const target = available[Math.floor(Math.random() * available.length)];
  formasState.target = target;
  formasState.usedShapes.push(target.id);

  const counter = document.createElement('div');
  counter.className = 'formas-counter';
  counter.textContent = `${formasState.round + 1} / 5`;
  game.appendChild(counter);

  const targetBox = document.createElement('div');
  targetBox.className = 'formas-target';
  targetBox.appendChild(buildShape(target.id, target.color, 100));
  const question = document.createElement('p');
  question.className = 'formas-question';
  question.textContent = '¿Cuál forma es esta?';
  targetBox.appendChild(question);
  game.appendChild(targetBox);

  const distractors = shapeDefs.filter(s => s.id !== target.id);
  const choices = [target];
  while (choices.length < 4) {
    const rand = distractors[Math.floor(Math.random() * distractors.length)];
    if (!choices.find(c => c.id === rand.id)) choices.push(rand);
  }
  choices.sort(() => Math.random() - 0.5);

  const choicesGrid = document.createElement('div');
  choicesGrid.className = 'formas-choices';

  choices.forEach(shape => {
    const btn = document.createElement('button');
    btn.className = 'formas-choice-btn';
    btn.appendChild(buildShape(shape.id, shape.color, 50));
    const nameLabel = document.createElement('span');
    nameLabel.className = 'formas-label';
    nameLabel.textContent = shape.name;
    btn.appendChild(nameLabel);
    btn.addEventListener('click', () => checkForma(shape.id, btn));
    choicesGrid.appendChild(btn);
  });

  game.appendChild(choicesGrid);
}

function checkForma(selectedId, btn) {
  if (formasState.disabled) return;
  formasState.disabled = true;

  if (selectedId === formasState.target.id) {
    btn.classList.add('correct');
    soundUtils.playCorrect();
    formasState.round++;
    if (formasState.round >= 5) {
      const stars = formasState.wrong === 0 ? 3 : formasState.wrong <= 2 ? 2 : 1;
      setTimeout(() => gameManager.showWinModal('¡Conoces todas las formas!', stars), 800);
    } else {
      setTimeout(() => {
        formasState.disabled = false;
        displayFormasRound();
      }, 800);
    }
  } else {
    btn.classList.add('wrong');
    soundUtils.playWrong();
    formasState.wrong++;
    setTimeout(() => {
      btn.classList.remove('wrong');
      formasState.disabled = false;
    }, 800);
  }
}
