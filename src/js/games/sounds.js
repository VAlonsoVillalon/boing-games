const soundAnimals = [
  { name: 'gato', emoji: '🐱', sounds: [800, 1000] },
  { name: 'perro', emoji: '🐶', sounds: [600, 400, 500] },
  { name: 'vaca', emoji: '🐄', sounds: [200, 150] },
  { name: 'pato', emoji: '🦆', sounds: [900, 850, 900] }
];

let soundState = {
  currentAnimal: null,
  answered: [],
  isDisabled: false,
  audioContext: null
};

function initSoundsGame() {
  soundState = {
    currentAnimal: null,
    answered: [],
    isDisabled: false,
    audioContext: new (window.AudioContext || window.webkitAudioContext)()
  };

  const game = document.getElementById('soundsGame');
  game.innerHTML = '';

  // Crear botón para reproducir sonido
  const playButton = document.createElement('button');
  playButton.style.width = '100%';
  playButton.style.marginBottom = '2rem';
  playButton.style.padding = '16px';
  playButton.style.background = '#00D4FF';
  playButton.style.color = 'white';
  playButton.style.border = 'none';
  playButton.style.borderRadius = '12px';
  playButton.style.fontSize = '16px';
  playButton.style.fontWeight = '600';
  playButton.style.cursor = 'pointer';
  playButton.textContent = '🔊 Escucha el sonido';
  playButton.addEventListener('click', () => playRandomSound());

  // Select random animal
  const animal = soundAnimals[Math.floor(Math.random() * soundAnimals.length)];
  soundState.currentAnimal = animal.name;

  // Create buttons
  const buttonsContainer = document.createElement('div');
  buttonsContainer.style.display = 'grid';
  buttonsContainer.style.gridTemplateColumns = 'repeat(2, 1fr)';
  buttonsContainer.style.gap = '12px';

  const shuffled = [...soundAnimals].sort(() => Math.random() - 0.5);

  shuffled.forEach((animal) => {
    const btn = document.createElement('button');
    btn.className = 'sound-btn';
    btn.innerHTML = `
      <span style="font-size: 48px;">${animal.emoji}</span>
      <span class="sound-label">${animal.name}</span>
    `;
    btn.addEventListener('click', () => checkSound(btn, animal.name));
    buttonsContainer.appendChild(btn);
  });

  game.appendChild(playButton);
  game.appendChild(buttonsContainer);

  // Play initial sound
  setTimeout(() => playRandomSound(), 300);
}

function playRandomSound() {
  const animal = soundAnimals.find(a => a.name === soundState.currentAnimal);
  if (!animal) return;

  // Reproducir secuencia de sonidos
  let delay = 0;
  animal.sounds.forEach((freq, idx) => {
    setTimeout(() => {
      playBeep(freq, 0.15);
    }, delay);
    delay += 200;
  });
}

function playBeep(frequency, duration = 0.15) {
  const audioContext = soundState.audioContext;
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = frequency;
  oscillator.type = 'sine';

  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
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
        
        // Pick new animal
        let newAnimal;
        do {
          newAnimal = soundAnimals[Math.floor(Math.random() * soundAnimals.length)];
        } while (soundState.answered.includes(newAnimal.name));
        
        soundState.currentAnimal = newAnimal.name;
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
