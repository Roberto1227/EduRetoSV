const WORDBUILDER_MUSIC_PATH = '/static/assets/english/ingmusic.mp3';
const WORDBUILDER_SUCCESS_SOUND = '/static/assets/math/acierto.mp3';
const WORDBUILDER_ERROR_SOUND = '/static/assets/math/error.mp3';

const wordList = [
  { word: 'CAT', translation: 'gato', hint: 'Un animal que maúlla' },
  { word: 'DOG', translation: 'perro', hint: 'El mejor amigo del hombre' },
  { word: 'SUN', translation: 'sol', hint: 'Brilla en el cielo durante el día' },
  { word: 'MOON', translation: 'luna', hint: 'Brilla en el cielo durante la noche' },
  { word: 'STAR', translation: 'estrella', hint: 'Brilla en el cielo nocturno' },
  { word: 'TREE', translation: 'árbol', hint: 'Tiene hojas y crece en el bosque' },
  { word: 'BOOK', translation: 'libro', hint: 'Se lee para aprender' },
  { word: 'HOUSE', translation: 'casa', hint: 'Lugar donde vives' },
  { word: 'WATER', translation: 'agua', hint: 'Bebemos esto todos los días' },
  { word: 'APPLE', translation: 'manzana', hint: 'Una fruta roja o verde' },
  { word: 'BIRD', translation: 'pájaro', hint: 'Animal que vuela y canta' },
  { word: 'FISH', translation: 'pez', hint: 'Vive en el agua' },
  { word: 'FLOWER', translation: 'flor', hint: 'Crece en el jardín y huele bien' },
  { word: 'HEART', translation: 'corazón', hint: 'Órgano que bombea sangre' },
  { word: 'SMILE', translation: 'sonrisa', hint: 'Expresión de felicidad' }
];

function initGame() {
  const container = document.getElementById('game-container');
  if (!container) return;

  let currentWordIndex = 0;
  let score = 0;
  let correctWords = 0;
  let draggedLetter = null;
  let bgMusic = null;
  let successSound = null;
  let errorSound = null;
  let audioReady = false;
  let isMuted = false;
  let currentVolume = 0.5;
  let currentWordSlots = [];
  let usedLetters = [];

  // Shuffle word list
  const shuffledWords = shuffleArray([...wordList]);

  renderLayout();
  loadWord();

  function renderLayout() {
    container.innerHTML = `
      <div class="wordbuilder-header">
        <div>
          <p class="round-progress" id="word-progress">Palabra 1 de ${shuffledWords.length}</p>
          <h2>Word Builder</h2>
        </div>
        <div class="wordbuilder-stats">
          <div class="stat-pill">
            <span>Puntuación</span>
            <strong id="wordbuilder-score">0</strong>
          </div>
          <div class="stat-pill">
            <span>Correctas</span>
            <strong id="wordbuilder-correct">0/${shuffledWords.length}</strong>
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
      <div class="wordbuilder-body">
        <div class="question-container">
          <div class="question-title" id="word-title"></div>
          <div class="question-text" id="word-translation"></div>
          <div class="word-hint" id="word-hint"></div>
          
          <div class="word-slots-container" id="word-slots"></div>
          
          <div class="letters-container">
            <div class="letters-label">Arrastra las letras aquí</div>
            <div class="letters-grid" id="letters-grid"></div>
          </div>
          
          <button class="clear-button" id="clear-button">
            <i class='bx bx-refresh'></i> Limpiar
          </button>
          
          <div class="feedback-message hidden" id="feedback-message"></div>
        </div>
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
    setupDragAndDrop();
    setupClearButton();
  }

  function loadWord() {
    if (currentWordIndex >= shuffledWords.length) {
      showFinalScreen();
      return;
    }

    const wordData = shuffledWords[currentWordIndex];
    currentWordSlots = [];
    usedLetters = [];

    document.getElementById('word-progress').textContent = 
      `Palabra ${currentWordIndex + 1} de ${shuffledWords.length}`;
    document.getElementById('word-title').textContent = `Construye la palabra en inglés:`;
    document.getElementById('word-translation').textContent = `"${wordData.translation}"`;
    document.getElementById('word-hint').textContent = `💡 ${wordData.hint}`;
    document.getElementById('wordbuilder-score').textContent = score;
    document.getElementById('wordbuilder-correct').textContent = `${correctWords}/${shuffledWords.length}`;

    // Create word slots
    const wordSlotsContainer = document.getElementById('word-slots');
    wordSlotsContainer.innerHTML = '';
    for (let i = 0; i < wordData.word.length; i++) {
      const slot = document.createElement('div');
      slot.className = 'word-slot';
      slot.dataset.index = i;
      slot.dataset.expected = wordData.word[i];
      wordSlotsContainer.appendChild(slot);
      currentWordSlots.push({ element: slot, letter: null });
    }

    // Create letter tiles (shuffled)
    const letters = wordData.word.split('');
    const extraLetters = generateExtraLetters(letters);
    const allLetters = shuffleArray([...letters, ...extraLetters]);
    
    const lettersGrid = document.getElementById('letters-grid');
    lettersGrid.innerHTML = '';
    allLetters.forEach((letter, index) => {
      const letterEl = document.createElement('div');
      letterEl.className = 'letter-item';
      letterEl.textContent = letter;
      letterEl.draggable = true;
      letterEl.dataset.letter = letter;
      letterEl.dataset.letterId = `letter-${index}`;
      lettersGrid.appendChild(letterEl);
    });

    // Reset feedback
    const feedback = document.getElementById('feedback-message');
    feedback.classList.add('hidden');
    feedback.classList.remove('success', 'error');

    setupDragAndDrop();
  }

  function generateExtraLetters(correctLetters) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const extra = [];
    const correctSet = new Set(correctLetters);
    
    // Add 3-5 random incorrect letters
    const numExtra = Math.floor(Math.random() * 3) + 3;
    for (let i = 0; i < numExtra; i++) {
      let randomLetter;
      do {
        randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
      } while (correctSet.has(randomLetter) && extra.includes(randomLetter));
      extra.push(randomLetter);
    }
    
    return extra;
  }

  function setupDragAndDrop() {
    const letterItems = document.querySelectorAll('.letter-item');
    const wordSlots = document.querySelectorAll('.word-slot');

    letterItems.forEach(item => {
      item.addEventListener('dragstart', handleLetterDragStart);
      item.addEventListener('dragend', handleLetterDragEnd);
    });

    wordSlots.forEach(slot => {
      slot.addEventListener('dragover', handleSlotDragOver);
      slot.addEventListener('drop', handleSlotDrop);
      slot.addEventListener('dragleave', handleSlotDragLeave);
      slot.addEventListener('click', handleSlotClick);
    });
  }

  function handleLetterDragStart(e) {
    if (e.target.classList.contains('used')) return;
    draggedLetter = e.target;
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', e.target.dataset.letter);
  }

  function handleLetterDragEnd(e) {
    e.target.classList.remove('dragging');
    document.querySelectorAll('.word-slot').forEach(slot => {
      slot.classList.remove('drag-over');
    });
  }

  function handleSlotDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!e.currentTarget.classList.contains('filled')) {
      e.currentTarget.classList.add('drag-over');
    }
  }

  function handleSlotDragLeave(e) {
    e.currentTarget.classList.remove('drag-over');
  }

  function handleSlotDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');

    if (!draggedLetter) return;
    if (e.currentTarget.classList.contains('filled')) return;

    const slot = e.currentTarget;
    const letter = draggedLetter.dataset.letter;
    const slotIndex = parseInt(slot.dataset.index);

    // Place letter in slot
    slot.textContent = letter;
    slot.classList.add('filled');
    slot.dataset.placedLetter = letter;
    currentWordSlots[slotIndex].letter = letter;

    // Mark letter as used
    draggedLetter.classList.add('used');
    draggedLetter.draggable = false;
    usedLetters.push(draggedLetter);

    // Check if word is complete
    checkWordComplete();

    draggedLetter = null;
  }

  function handleSlotClick(e) {
    const slot = e.currentTarget;
    if (!slot.classList.contains('filled')) return;

    // Remove letter from slot
    const letter = slot.dataset.placedLetter;
    slot.textContent = '';
    slot.classList.remove('filled');
    slot.removeAttribute('data-placed-letter');
    
    const slotIndex = parseInt(slot.dataset.index);
    currentWordSlots[slotIndex].letter = null;

    // Find and restore the letter
    const letterElement = Array.from(usedLetters).find(el => 
      el.dataset.letter === letter && el.classList.contains('used')
    );
    if (letterElement) {
      letterElement.classList.remove('used');
      letterElement.draggable = true;
      usedLetters = usedLetters.filter(el => el !== letterElement);
    }

    checkWordComplete();
  }

  function checkWordComplete() {
    const wordData = shuffledWords[currentWordIndex];
    const isComplete = currentWordSlots.every((slot, index) => 
      slot.letter === wordData.word[index]
    );

    if (isComplete && currentWordSlots.every(slot => slot.letter !== null)) {
      validateWord();
    }
  }

  function validateWord() {
    const wordData = shuffledWords[currentWordIndex];
    let userWord = '';
    let allCorrect = true;

    currentWordSlots.forEach((slot, index) => {
      const expected = wordData.word[index];
      const actual = slot.letter;
      
      if (actual === expected) {
        slot.element.classList.add('correct');
        slot.element.classList.remove('incorrect');
      } else {
        slot.element.classList.add('incorrect');
        slot.element.classList.remove('correct');
        allCorrect = false;
      }
      
      userWord += actual || '';
    });

    const feedback = document.getElementById('feedback-message');
    feedback.classList.remove('hidden');

    if (allCorrect && userWord === wordData.word) {
      playFeedbackSound(true);
      score += 20;
      correctWords++;
      feedback.classList.add('success');
      feedback.classList.remove('error');
      feedback.textContent = `✓ ¡Correcto! "${wordData.word}" = "${wordData.translation}"`;
      document.getElementById('wordbuilder-score').textContent = score;
      document.getElementById('wordbuilder-correct').textContent = `${correctWords}/${shuffledWords.length}`;
      
      // Auto-advance after 2 seconds
      setTimeout(() => {
        currentWordIndex++;
        loadWord();
      }, 2000);
    } else {
      playFeedbackSound(false);
      feedback.classList.add('error');
      feedback.classList.remove('success');
      feedback.textContent = `✗ Incorrecto. La palabra correcta es "${wordData.word}" (${wordData.translation})`;
    }
  }

  function setupClearButton() {
    const clearBtn = document.getElementById('clear-button');
    clearBtn.addEventListener('click', () => {
      clearWord();
    });
  }

  function clearWord() {
    // Remove all letters from slots
    currentWordSlots.forEach(slot => {
      if (slot.letter) {
        slot.element.textContent = '';
        slot.element.classList.remove('filled', 'correct', 'incorrect');
        slot.element.removeAttribute('data-placed-letter');
        
        // Restore letter
        const letterElement = Array.from(usedLetters).find(el => 
          el.dataset.letter === slot.letter && el.classList.contains('used')
        );
        if (letterElement) {
          letterElement.classList.remove('used');
          letterElement.draggable = true;
          usedLetters = usedLetters.filter(el => el !== letterElement);
        }
        
        slot.letter = null;
      }
    });

    // Reset feedback
    const feedback = document.getElementById('feedback-message');
    feedback.classList.add('hidden');
    feedback.classList.remove('success', 'error');
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
    bgMusic = new Audio(WORDBUILDER_MUSIC_PATH);
    bgMusic.loop = true;
    successSound = new Audio(WORDBUILDER_SUCCESS_SOUND);
    errorSound = new Audio(WORDBUILDER_ERROR_SOUND);
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

  function showFinalScreen() {
    container.innerHTML = `
      <div class="gram-complete" style="background: radial-gradient(circle at top, rgba(156, 39, 176, 0.2), transparent 60%);">
        <div class="gram-card" style="border: 2px solid rgba(156, 39, 176, 0.2);">
          <div class="gram-card-header">
            <p class="final-label" style="color: #9c27b0;">English EduReto</p>
            <div class="gram-trophy" style="background: rgba(156, 39, 176, 0.12); color: #9c27b0;">
              <i class='bx bx-book'></i>
            </div>
            <h2>¡Palabras completadas!</h2>
            <p>Construiste todas las ${shuffledWords.length} palabras correctamente.</p>
          </div>
          <div class="gram-stats">
            <div class="gram-stat" style="background: #f3e5f5; border: 1px solid rgba(156, 39, 176, 0.35);">
              <span style="color: #7b1fa2;">Puntuación</span>
              <strong style="color: #6a1b9a;">${score}</strong>
            </div>
            <div class="gram-stat" style="background: #f3e5f5; border: 1px solid rgba(156, 39, 176, 0.35);">
              <span style="color: #7b1fa2;">Palabras Correctas</span>
              <strong style="color: #6a1b9a;">${correctWords}/${shuffledWords.length}</strong>
            </div>
            <div class="gram-stat" style="background: #f3e5f5; border: 1px solid rgba(156, 39, 176, 0.35);">
              <span style="color: #7b1fa2;">Palabras</span>
              <strong style="color: #6a1b9a;">${shuffledWords.length}</strong>
            </div>
          </div>
          <div class="gram-buttons">
            <a class="action-button gram-secondary" href="${window.gameConfig?.backUrl || '../ingles.html'}" style="background: transparent; color: #9c27b0; border: 2px solid rgba(156, 39, 176, 0.6);">
              <i class='bx bx-home-smile'></i>
              Volver al módulo
            </a>
            <button class="action-button" id="restart-wordbuilder" style="background: #9c27b0; color: #fff; box-shadow: 0 10px 20px rgba(156, 39, 176, 0.4);">
              <i class='bx bx-refresh'></i>
              Jugar otra vez
            </button>
          </div>
        </div>
      </div>
    `;
    document.getElementById('restart-wordbuilder').addEventListener('click', () => {
      currentWordIndex = 0;
      score = 0;
      correctWords = 0;
      const newShuffledWords = shuffleArray([...wordList]);
      shuffledWords.length = 0;
      shuffledWords.push(...newShuffledWords);
      renderLayout();
      loadWord();
    });
  }
}
















