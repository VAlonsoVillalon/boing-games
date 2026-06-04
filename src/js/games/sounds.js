const soundAnimals = [
  { name: 'gato', emoji: '🐱' },
  { name: 'perro', emoji: '🐶' },
  { name: 'vaca', emoji: '🐄' },
  { name: 'pato', emoji: '🦆' }
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
  playButton.addEventListener('click', () => playAnimalSound(soundState.currentAnimal));

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
  setTimeout(() => playAnimalSound(soundState.currentAnimal), 300);
}

function playAnimalSound(animalName) {
  const audioContext = soundState.audioContext;
  const now = audioContext.currentTime;

  switch(animalName) {
    case 'gato':
      // Gato: Miau agudo y resonante
      playFrequencyWithNoise(audioContext, 1500, 0.4, 'sine');
      setTimeout(() => playFrequencyWithNoise(audioContext, 1800, 0.3, 'sine'), 200);
      break;
    case 'perro':
      // Perro: Guau profundo con modulación
      playFrequencyWithNoise(audioContext, 400, 0.5, 'triangle');
      setTimeout(() => playFrequencyWithNoise(audioContext, 350, 0.4, 'triangle'), 300);
      break;
    case 'vaca':
      // Vaca: Muuu muy profundo y largo
      playFrequencyWithNoise(audioContext, 150, 0.6, 'sine');
      break;
    case 'pato':
      // Pato: Cuac agudo repetido
      playFrequencyWithNoise(audioContext, 800, 0.4, 'square');
      setTimeout(() => playFrequencyWithNoise(audioContext, 750, 0.35, 'square'), 150);
      setTimeout(() => playFrequencyWithNoise(audioContext, 800, 0.3, 'square'), 300);
      break;
  }
}

function playFrequencyWithNoise(audioContext, frequency, duration, waveType = 'sine') {
  const now = audioContext.currentTime;
  
  // Oscilador principal
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.type = waveType;
  oscillator.frequency.setValueAtTime(frequency, now);
  
  // Modulación de frecuencia (vibrato)
  const lfo = audioContext.createOscillator();
  const lfoGain = audioContext.createGain();
  lfo.frequency.value = 5; // Vibrato de 5Hz
  lfoGain.gain.value = frequency * 0.05; // Modula 5% la frecuencia
  
  lfo.connect(oscillator.frequency);
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  // Envolvente ADSR
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(0.4, now + 0.05); // Attack
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration); // Decay
  
  oscillator.start(now);
  lfo.start(now);
  
  oscillator.stop(now + duration);
  lfo.stop(now + duration);
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
        playAnimalSound(soundState.currentAnimal);
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
