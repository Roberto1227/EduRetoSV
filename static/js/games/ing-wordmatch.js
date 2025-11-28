const WORDMATCH_MUSIC_PATH = '/static/assets/english/ingmusic.mp3';
const WORDMATCH_SUCCESS_SOUND = '/static/assets/math/acierto.mp3';
const WORDMATCH_ERROR_SOUND = '/static/assets/math/error.mp3';

const wordEmojis = {
  // Animals
  'CAT': '🐱',
  'DOG': '🐶',
  'BIRD': '🐦',
  'FISH': '🐟',
  'LION': '🦁',
  'TIGER': '🐯',
  'ELEPHANT': '🐘',
  'HORSE': '🐴',
  'COW': '🐄',
  'PIG': '🐷',
  // Objects
  'BOOK': '📚',
  'CHAIR': '🪑',
  'TABLE': '🪑',
  'PEN': '✏️',
  'PHONE': '📱',
  'CAR': '🚗',
  'BALL': '⚽',
  'TOY': '🧸',
  'LAMP': '💡',
  'CLOCK': '🕐',
  // Professions
  'TEACHER': '👨‍🏫',
  'DOCTOR': '👨‍⚕️',
  'NURSE': '👩‍⚕️',
  'COOK': '👨‍🍳',
  'POLICE': '👮',
  'FIREFIGHTER': '👨‍🚒',
  'PILOT': '✈️',
  'ARTIST': '🎨',
  'MUSICIAN': '🎵',
  'ENGINEER': '👷',
  // Animals (additional)
  'RABBIT': '🐰',
  'DUCK': '🦆',
  // Objects (additional)
  'DOOR': '🚪',
  'WINDOW': '🪟',
  // Professions (additional)
  'FARMER': '👨‍🌾',
  'DRIVER': '🚗',
  // Nature (additional)
  'GRASS': '🌱',
  'ROCK': '🪨',
  // Nature
  'SUN': '☀️',
  'MOON': '🌙',
  'STAR': '⭐',
  'TREE': '🌳',
  'FLOWER': '🌸',
  'WATER': '💧',
  'CLOUD': '☁️',
  'RAIN': '🌧️',
  'WIND': '💨',
  'LEAF': '🍃',
  // Mixed
  'HOUSE': '🏠',
  'APPLE': '🍎',
  'HEART': '❤️',
  'SMILE': '😊',
  'SCHOOL': '🏫',
  'FRIEND': '👫',
  'MUSIC': '🎵',
  'COLOR': '🎨',
  'DANCE': '💃',
  'LEARN': '📖',
  // Mixed (additional)
  'GAME': '🎮',
  'PARTY': '🎉'
};

const wordCategories = {
  animals: [
    { english: 'CAT', spanish: 'gato' },
    { english: 'DOG', spanish: 'perro' },
    { english: 'BIRD', spanish: 'pájaro' },
    { english: 'FISH', spanish: 'pez' },
    { english: 'LION', spanish: 'león' },
    { english: 'TIGER', spanish: 'tigre' },
    { english: 'ELEPHANT', spanish: 'elefante' },
    { english: 'HORSE', spanish: 'caballo' },
    { english: 'COW', spanish: 'vaca' },
    { english: 'PIG', spanish: 'cerdo' },
    { english: 'RABBIT', spanish: 'conejo' },
    { english: 'DUCK', spanish: 'pato' }
  ],
  objects: [
    { english: 'BOOK', spanish: 'libro' },
    { english: 'CHAIR', spanish: 'silla' },
    { english: 'TABLE', spanish: 'mesa' },
    { english: 'PEN', spanish: 'bolígrafo' },
    { english: 'PHONE', spanish: 'teléfono' },
    { english: 'CAR', spanish: 'carro' },
    { english: 'BALL', spanish: 'pelota' },
    { english: 'TOY', spanish: 'juguete' },
    { english: 'LAMP', spanish: 'lámpara' },
    { english: 'CLOCK', spanish: 'reloj' },
    { english: 'DOOR', spanish: 'puerta' },
    { english: 'WINDOW', spanish: 'ventana' }
  ],
  professions: [
    { english: 'TEACHER', spanish: 'maestro' },
    { english: 'DOCTOR', spanish: 'doctor' },
    { english: 'NURSE', spanish: 'enfermera' },
    { english: 'COOK', spanish: 'cocinero' },
    { english: 'POLICE', spanish: 'policía' },
    { english: 'FIREFIGHTER', spanish: 'bombero' },
    { english: 'PILOT', spanish: 'piloto' },
    { english: 'ARTIST', spanish: 'artista' },
    { english: 'MUSICIAN', spanish: 'músico' },
    { english: 'ENGINEER', spanish: 'ingeniero' },
    { english: 'FARMER', spanish: 'granjero' },
    { english: 'DRIVER', spanish: 'conductor' }
  ],
  nature: [
    { english: 'SUN', spanish: 'sol' },
    { english: 'MOON', spanish: 'luna' },
    { english: 'STAR', spanish: 'estrella' },
    { english: 'TREE', spanish: 'árbol' },
    { english: 'FLOWER', spanish: 'flor' },
    { english: 'WATER', spanish: 'agua' },
    { english: 'CLOUD', spanish: 'nube' },
    { english: 'RAIN', spanish: 'lluvia' },
    { english: 'WIND', spanish: 'viento' },
    { english: 'LEAF', spanish: 'hoja' },
    { english: 'GRASS', spanish: 'césped' },
    { english: 'ROCK', spanish: 'roca' }
  ],
  mixed: [
    { english: 'HOUSE', spanish: 'casa' },
    { english: 'APPLE', spanish: 'manzana' },
    { english: 'HEART', spanish: 'corazón' },
    { english: 'SMILE', spanish: 'sonrisa' },
    { english: 'SCHOOL', spanish: 'escuela' },
    { english: 'FRIEND', spanish: 'amigo' },
    { english: 'MUSIC', spanish: 'música' },
    { english: 'COLOR', spanish: 'color' },
    { english: 'DANCE', spanish: 'bailar' },
    { english: 'LEARN', spanish: 'aprender' },
    { english: 'GAME', spanish: 'juego' },
    { english: 'PARTY', spanish: 'fiesta' }
  ]
};

const levelOrder = ['animals', 'objects', 'professions', 'nature', 'mixed'];
const levelNames = {
  animals: 'Animales',
  objects: 'Objetos',
  professions: 'Profesiones',
  nature: 'Naturaleza',
  mixed: 'Mixto'
};

function initGame() {
  const container = document.getElementById('game-container');
  if (!container) return;

  let currentLevelIndex = 0;
  let currentLevel = null;
  let gameCards = [];
  let selectedCards = [];
  let matchedPairs = 0;
  let attempts = 0;
  let score = 0;
  let startTime = null;
  let timerInterval = null;
  let elapsedTime = 0;
  let totalElapsedTime = 0;
  let bgMusic = null;
  let successSound = null;
  let errorSound = null;
  let audioReady = false;
  let isMuted = false;
  let currentVolume = 0.5;
  let isLocked = false;
  let totalMatchedPairs = 0;
  let totalAttempts = 0;

  renderLayout();
  startFirstLevel();

  function renderLayout() {
    container.innerHTML = `
      <div class="wordmatch-header">
        <div>
          <p class="round-progress" id="game-status">Selecciona un nivel</p>
          <h2>Word Match</h2>
        </div>
        <div class="wordmatch-stats">
          <div class="stat-pill">
            <span>Puntuación</span>
            <strong id="wordmatch-score">0</strong>
          </div>
          <div class="stat-pill">
            <span>Intentos</span>
            <strong id="wordmatch-attempts">0</strong>
          </div>
          <div class="stat-pill">
            <span>Tiempo</span>
            <strong id="wordmatch-time">00:00</strong>
          </div>
          <div class="volume-control">
            <button class="volume-toggle" id="volume-toggle" title="Silenciar/activar sonido">
              <i class='bx bx-volume-full'></i>
            </button>
            <input
              type="range"
              class="volume-slider"
              id="volume-range"
              min="0"
              max="100"
              value="${Math.round(currentVolume * 100)}"
            />
          </div>
        </div>
      </div>
      <div class="wordmatch-body">
        <div class="cards-container" id="cards-container"></div>
        <div class="feedback-message hidden" id="feedback-message"></div>
      </div>
    `;

    const volumeToggle = document.getElementById('volume-toggle');
    const volumeRange = document.getElementById('volume-range');
    if (volumeToggle) {
      volumeToggle.addEventListener('click', toggleMute);
    }
    if (volumeRange) {
      volumeRange.addEventListener('input', handleVolumeChange);
    }
    updateVolumeUI();
    startBackgroundMusic();
  }

  function startFirstLevel() {
    currentLevelIndex = 0;
    currentLevel = levelOrder[0];
    startGame();
  }

  function startGame() {
    matchedPairs = 0;
    attempts = 0;
    elapsedTime = 0;
    selectedCards = [];
    isLocked = false;
    startTime = Date.now();

    const selectedPairs = shuffleArray([...wordCategories[currentLevel]]).slice(0, 12);
    
    // Create cards array with both English and Spanish (all visible)
    gameCards = [];
    selectedPairs.forEach(pair => {
      gameCards.push({ type: 'english', content: pair.english, pairId: pair.english, emoji: wordEmojis[pair.english] || '❓' });
      gameCards.push({ type: 'spanish', content: pair.spanish, pairId: pair.english });
    });
    gameCards = shuffleArray(gameCards);

    renderCards();
    startTimer();
    updateStats();
  }

  function renderCards() {
    const container = document.getElementById('cards-container');
    container.className = 'cards-container grid-layout';
    container.innerHTML = '';

    // Shuffle all cards together (English and Spanish mixed)
    const shuffledCards = shuffleArray([...gameCards]);

    shuffledCards.forEach((card, index) => {
      const cardEl = document.createElement('div');
      cardEl.className = `match-card ${card.type}-card`;
      cardEl.dataset.index = index;
      cardEl.dataset.type = card.type;
      cardEl.dataset.pairId = card.pairId;
      
      if (card.type === 'english') {
        // Add emoji and text for English cards
        const emoji = document.createElement('span');
        emoji.textContent = card.emoji || '❓';
        emoji.style.cssText = 'font-size: 2rem; margin-bottom: 0.3rem; display: block; line-height: 1;';
        cardEl.appendChild(emoji);
        
        const text = document.createElement('span');
        text.textContent = card.content;
        text.style.cssText = 'font-size: 0.85rem; font-weight: 600;';
        cardEl.appendChild(text);
      } else {
        // Just text for Spanish cards
        cardEl.textContent = card.content;
      }
      
      cardEl.addEventListener('click', () => handleCardClick(cardEl, card));
      container.appendChild(cardEl);
    });

    document.getElementById('game-status').textContent = 
      `Nivel ${currentLevelIndex + 1}/5: ${levelNames[currentLevel]} - Empareja las palabras con sus traducciones`;
  }

  function handleCardClick(cardEl, cardData) {
    if (isLocked) return;
    if (cardEl.classList.contains('matched') || cardEl.classList.contains('selected')) return;

    // Select card
    cardEl.classList.add('selected');
    selectedCards.push({ element: cardEl, data: cardData });

    if (selectedCards.length === 2) {
      isLocked = true;
      attempts++;
      updateStats();
      checkMatch();
    }
  }

  function checkMatch() {
    const [card1, card2] = selectedCards;
    const isMatch = card1.data.pairId === card2.data.pairId && 
                    card1.data.type !== card2.data.type;

    if (isMatch) {
      playFeedbackSound(true);
      card1.element.classList.remove('selected');
      card1.element.classList.add('matched');
      card2.element.classList.remove('selected');
      card2.element.classList.add('matched');
      matchedPairs++;
      score += 50;
      updateStats();

      const feedback = document.getElementById('feedback-message');
      feedback.classList.remove('hidden');
      feedback.classList.add('success');
      feedback.classList.remove('error');
      feedback.textContent = `✓ ¡Pareja encontrada! "${card1.data.content}" = "${card2.data.content}"`;

      selectedCards = [];
      isLocked = false;

      if (matchedPairs === 12) {
        totalMatchedPairs += matchedPairs;
        setTimeout(() => {
          stopTimer();
          if (currentLevelIndex < levelOrder.length - 1) {
            showLevelComplete();
          } else {
            showFinalScreen();
          }
        }, 1000);
      }
    } else {
      playFeedbackSound(false);
      card1.element.classList.add('mismatch');
      card2.element.classList.add('mismatch');

      const feedback = document.getElementById('feedback-message');
      feedback.classList.remove('hidden');
      feedback.classList.add('error');
      feedback.classList.remove('success');
      feedback.textContent = '✗ No es una pareja correcta. Intenta de nuevo.';

      setTimeout(() => {
        card1.element.classList.remove('selected', 'mismatch');
        card2.element.classList.remove('selected', 'mismatch');
        selectedCards = [];
        isLocked = false;
        feedback.classList.add('hidden');
      }, 1500);
    }
  }

  function startTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    timerInterval = setInterval(() => {
      elapsedTime = Math.floor((Date.now() - startTime) / 1000);
      const minutes = Math.floor(elapsedTime / 60);
      const seconds = elapsedTime % 60;
      document.getElementById('wordmatch-time').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function updateStats() {
    document.getElementById('wordmatch-score').textContent = score;
    document.getElementById('wordmatch-attempts').textContent = attempts;
  }

  function shuffleArray(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function ensureAudioInstances() {
    if (audioReady) return;
    bgMusic = new Audio(WORDMATCH_MUSIC_PATH);
    bgMusic.loop = true;
    successSound = new Audio(WORDMATCH_SUCCESS_SOUND);
    errorSound = new Audio(WORDMATCH_ERROR_SOUND);
    audioReady = true;
    setAudioVolume(currentVolume);
    bgMusic.muted = isMuted;
    successSound.muted = isMuted;
    errorSound.muted = isMuted;
  }

  function startBackgroundMusic() {
    ensureAudioInstances();
    if (isMuted) return;
    bgMusic.play().catch(() => {});
  }

  function toggleMute() {
    isMuted = !isMuted;
    ensureAudioInstances();
    bgMusic.muted = isMuted;
    successSound.muted = isMuted;
    errorSound.muted = isMuted;
    if (isMuted) {
      bgMusic.pause();
    } else {
      startBackgroundMusic();
    }
    updateVolumeUI();
  }

  function handleVolumeChange(event) {
    const value = Number(event.target.value) / 100;
    ensureAudioInstances();
    setAudioVolume(value);
    if (value <= 0) {
      isMuted = true;
      bgMusic.pause();
    } else {
      isMuted = false;
      bgMusic.muted = false;
      successSound.muted = false;
      errorSound.muted = false;
      startBackgroundMusic();
    }
    updateVolumeUI();
  }

  function setAudioVolume(volume) {
    currentVolume = Math.min(1, Math.max(0, volume));
    if (!audioReady) return;
    bgMusic.volume = currentVolume;
    successSound.volume = currentVolume;
    errorSound.volume = currentVolume;
  }

  function updateVolumeUI() {
    const icon = document.querySelector('#volume-toggle i');
    const slider = document.getElementById('volume-range');
    if (slider) {
      slider.value = Math.round((isMuted ? 0 : currentVolume) * 100);
    }
    if (icon) {
      let iconClass = 'bx bx-volume-full';
      if (isMuted || currentVolume === 0) {
        iconClass = 'bx bx-volume-mute';
      } else if (currentVolume < 0.4) {
        iconClass = 'bx bx-volume-low';
      }
      icon.className = iconClass;
    }
  }

  function playFeedbackSound(isCorrect) {
    ensureAudioInstances();
    if (isMuted) return;
    const sound = isCorrect ? successSound : errorSound;
    if (!sound) return;
    sound.currentTime = 0;
    sound.play().catch(() => {});
  }

  function showLevelComplete() {
    totalElapsedTime += elapsedTime;
    totalMatchedPairs += matchedPairs;
    totalAttempts += attempts;
    
    const feedback = document.getElementById('feedback-message');
    feedback.classList.remove('hidden');
    feedback.classList.add('success');
    feedback.classList.remove('error');
    feedback.textContent = `✓ ¡Nivel completado! Pasando al siguiente nivel...`;

    setTimeout(() => {
      currentLevelIndex++;
      currentLevel = levelOrder[currentLevelIndex];
      startGame();
    }, 2000);
  }

  function showFinalScreen() {
    totalElapsedTime += elapsedTime;
    totalMatchedPairs += matchedPairs;
    totalAttempts += attempts;
    
    const totalMinutes = Math.floor(totalElapsedTime / 60);
    const totalSeconds = totalElapsedTime % 60;
    const timeString = `${totalMinutes.toString().padStart(2, '0')}:${totalSeconds.toString().padStart(2, '0')}`;
    
    // Calculate bonus points based on attempts and time
    const maxPairs = 60; // 12 pairs per level * 5 levels
    const perfectAttempts = maxPairs;
    const attemptBonus = Math.max(0, (perfectAttempts - totalAttempts) * 5);
    const timeBonus = Math.max(0, Math.floor((1800 - totalElapsedTime) / 10));
    const finalScore = score + attemptBonus + timeBonus;

    container.innerHTML = `
      <div class="gram-complete" style="background: radial-gradient(circle at top, rgba(156, 39, 176, 0.2), transparent 60%);">
        <div class="gram-card" style="border: 2px solid rgba(156, 39, 176, 0.2);">
          <div class="gram-card-header">
            <p class="final-label" style="color: #9c27b0;">English EduReto</p>
            <div class="gram-trophy" style="background: rgba(156, 39, 176, 0.12); color: #9c27b0;">
              <i class='bx bx-brain'></i>
            </div>
            <h2>¡Todos los niveles completados!</h2>
            <p>Completaste los 5 niveles en ${timeString} con ${totalAttempts} intentos totales.</p>
          </div>
          <div class="gram-stats">
            <div class="gram-stat" style="background: #f3e5f5; border: 1px solid rgba(156, 39, 176, 0.35);">
              <span style="color: #7b1fa2;">Puntuación Final</span>
              <strong style="color: #6a1b9a;">${finalScore}</strong>
            </div>
            <div class="gram-stat" style="background: #f3e5f5; border: 1px solid rgba(156, 39, 176, 0.35);">
              <span style="color: #7b1fa2;">Parejas Encontradas</span>
              <strong style="color: #6a1b9a;">${totalMatchedPairs + matchedPairs}/60</strong>
            </div>
            <div class="gram-stat" style="background: #f3e5f5; border: 1px solid rgba(156, 39, 176, 0.35);">
              <span style="color: #7b1fa2;">Tiempo Total</span>
              <strong style="color: #6a1b9a;">${timeString}</strong>
            </div>
          </div>
          <div class="gram-buttons">
            <a class="action-button gram-secondary" href="${window.gameConfig?.backUrl || '../ingles.html'}" style="background: transparent; color: #9c27b0; border: 2px solid rgba(156, 39, 176, 0.6);">
              <i class='bx bx-home-smile'></i>
              Volver al módulo
            </a>
            <button class="action-button" id="restart-wordmatch" style="background: #9c27b0; color: #fff; box-shadow: 0 10px 20px rgba(156, 39, 176, 0.4);">
              <i class='bx bx-refresh'></i>
              Jugar otra vez
            </button>
          </div>
        </div>
      </div>
    `;
    document.getElementById('restart-wordmatch').addEventListener('click', () => {
      matchedPairs = 0;
      attempts = 0;
      score = 0;
      elapsedTime = 0;
      totalElapsedTime = 0;
      selectedCards = [];
      isLocked = false;
      totalMatchedPairs = 0;
      totalAttempts = 0;
      currentLevelIndex = 0;
      currentLevel = null;
      renderLayout();
      startFirstLevel();
    });
  }
}

