const soundAnimals = [
  { name: 'gato', emoji: '🐱', sound: 'Miau' },
  { name: 'perro', emoji: '🐶', sound: 'Guau' },
  { name: 'vaca', emoji: '🐄', sound: 'Muu' },
  { name: 'pato', emoji: '🦆', sound: 'Cuac' }
];

let soundState = {
  currentAnimal: null,
  answered: [],
  isDisabled: false
};

function initSoundsGame() {
  soundState = {
    currentAnimal: null,
    answered: [],
    isDisabled: false
  };

  const game = document.getElementById('soundsGame');
  game.innerHTML = '';

  // Select random animal
  playRandomSound();

  // Create buttons
  const shuffled = [...soundAnimals].sort(() => Math.random() - 0.5);

  shuffled.forEach((animal) => {
    const btn = document.createElement('button');
    btn.className = 'sound-btn';
    btn.innerHTML = `
      <span style="font-size: 48px;">${animal.emoji}</span>
      <span class="sound-label">${animal.name}</span>
    `;
    btn.addEventListener('click', () => checkSound(btn, animal.name));
    game.appendChild(btn);
  });
}

function playRandomSound() {
  const animal = soundAnimals[Math.floor(Math.random() * soundAnimals.length)];
  soundState.currentAnimal = animal.name;

  // Use Web Audio API to generate sound
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
  if (animal.name === 'gato') {
    playTone(audioContext, 1200, 0.2, 0.1);
  } else if (animal.name === 'perro') {
    playTone(audioContext, 800, 0.3, 0.15);
    setTimeout(() => playTone(audioContext, 900, 0.2, 0.1), 200);
  } else if (animal.name === 'vaca') {
    playTone(audioContext, 200, 0.4, 0.3);
  } else if (animal.name === 'pato') {
    playTone(audioContext, 600, 0.2, 0.1);
    setTimeout(() => playTone(audioContext, 700, 0.2, 0.1), 150);
  }
}

function playTone(audioContext, frequency, duration, volume = 0.3) {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = frequency;
  gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
}

function checkSound(button, animalName) {
  if (soundState.isDisabled) return;
  soundState.isDisabled = true;

  if (animalName === soundState.currentAnimal) {
    // Correct!
    button.classList.add('correct');
    soundState.answered.push(animalName);

    setTimeout(() => {
      if (soundState.answered.length === 4) {
        gameManager.showWinModal('¡Identificaste todos los sonidos! 🔊');
      } else {
        // Reset for next sound
        document.querySelectorAll('.sound-btn').forEach(btn => {
          btn.classList.remove('correct', 'wrong');
        });
        soundState.isDisabled = false;
        playRandomSound();
      }
    }, 1000);
  } else {
    // Wrong
    button.classList.add('wrong');
    setTimeout(() => {
      button.classList.remove('wrong');
      soundState.isDisabled = false;
    }, 800);
  }
}
