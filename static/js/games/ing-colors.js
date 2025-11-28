const COLORS_MUSIC_PATH = '/static/assets/english/ingmusic.mp3';
const COLORS_SUCCESS_SOUND = '/static/assets/math/acierto.mp3';
const COLORS_ERROR_SOUND = '/static/assets/math/error.mp3';

const colorTranslations = {
  'light blue': 'azul claro',
  'dark green': 'verde oscuro',
  'bright red': 'rojo brillante',
  'pale yellow': 'amarillo pálido',
  'deep purple': 'morado intenso',
  'light pink': 'rosa claro',
  'dark orange': 'naranja oscuro',
  'bright yellow': 'amarillo brillante',
  'pale green': 'verde pálido',
  'deep blue': 'azul intenso',
  'soft blue': 'azul suave',
  'vivid green': 'verde vívido',
  'neon pink': 'rosa neón',
  'dark red': 'rojo oscuro',
  'light green': 'verde claro'
};

const colorQuestions = [
  {
    question: 'azul claro',
    prefix: 'light',
    color: 'blue',
    correctAnswer: 'light blue',
    explanation: 'Light blue es "azul claro" en inglés.'
  },
  {
    question: 'verde oscuro',
    prefix: 'dark',
    color: 'green',
    correctAnswer: 'dark green',
    explanation: 'Dark green es "verde oscuro" en inglés.'
  },
  {
    question: 'rojo brillante',
    prefix: 'bright',
    color: 'red',
    correctAnswer: 'bright red',
    explanation: 'Bright red es "rojo brillante" en inglés.'
  },
  {
    question: 'amarillo pálido',
    prefix: 'pale',
    color: 'yellow',
    correctAnswer: 'pale yellow',
    explanation: 'Pale yellow es "amarillo pálido" en inglés.'
  },
  {
    question: 'morado intenso',
    prefix: 'deep',
    color: 'purple',
    correctAnswer: 'deep purple',
    explanation: 'Deep purple es "morado intenso" en inglés.'
  },
  {
    question: 'rosa claro',
    prefix: 'light',
    color: 'pink',
    correctAnswer: 'light pink',
    explanation: 'Light pink es "rosa claro" en inglés.'
  },
  {
    question: 'naranja oscuro',
    prefix: 'dark',
    color: 'orange',
    correctAnswer: 'dark orange',
    explanation: 'Dark orange es "naranja oscuro" en inglés.'
  },
  {
    question: 'amarillo brillante',
    prefix: 'bright',
    color: 'yellow',
    correctAnswer: 'bright yellow',
    explanation: 'Bright yellow es "amarillo brillante" en inglés.'
  },
  {
    question: 'verde pálido',
    prefix: 'pale',
    color: 'green',
    correctAnswer: 'pale green',
    explanation: 'Pale green es "verde pálido" en inglés.'
  },
  {
    question: 'azul intenso',
    prefix: 'deep',
    color: 'blue',
    correctAnswer: 'deep blue',
    explanation: 'Deep blue es "azul intenso" en inglés.'
  }
];

function initGame() {
  const container = document.getElementById('game-container');
  if (!container) return;

  let currentQuestion = 0;
  let score = 0;
  let correctAnswers = 0;
  let lives = 3;
  let draggedElement = null;
  let bgMusic = null;
  let successSound = null;
  let errorSound = null;
  let audioReady = false;
  let isMuted = false;
  let currentVolume = 0.5;
  let currentPrefix = null;
  let currentColor = null;
  let timerInterval = null;
  let timeLeft = 0;
  let questionStartTime = 0;

  renderLayout();
  loadQuestion();

  function renderLayout() {
    container.innerHTML = `
      <div class="colors-header">
        <div>
          <p class="round-progress" id="question-progress">Pregunta 1 de 10</p>
          <h2>English Colors</h2>
        </div>
        <div class="colors-stats">
          <div class="stat-pill">
            <span>Puntuación</span>
            <strong id="colors-score">0</strong>
          </div>
          <div class="stat-pill">
            <span>Correctas</span>
            <strong id="colors-correct">0/10</strong>
          </div>
          <div class="stat-pill">
            <span>Vidas</span>
            <strong id="colors-lives">3</strong>
          </div>
          <div class="stat-pill timer-pill" id="timer-pill">
            <span>Tiempo</span>
            <strong id="timer-display">30</strong>
          </div>
          <div class="volume-control">
            <button class="volume-toggle" id="volume-toggle" title="Mute/unmute sound">
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
      <div class="colors-body">
        <div class="question-container">
          <div class="question-title" id="question-title"></div>
          <div class="question-text" id="question-text"></div>
          
          <div class="drop-zone" id="drop-zone">
            <div class="drop-zone-placeholder">Arrastra un prefijo y un color aquí para formar la respuesta</div>
          </div>
          
          <div class="drag-drop-area">
            <div class="prefixes-container">
              <div class="container-label">Prefijos</div>
              <div id="prefixes-list"></div>
            </div>
            
            <div class="colors-container">
              <div class="container-label">Colores</div>
              <div id="colors-list"></div>
            </div>
          </div>
          
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
  }

  function loadQuestion() {
    if (currentQuestion >= colorQuestions.length) {
      showFinalScreen();
      return;
    }

    const question = colorQuestions[currentQuestion];
    currentPrefix = null;
    currentColor = null;

    document.getElementById('question-progress').textContent = 
      `Pregunta ${currentQuestion + 1} de ${colorQuestions.length}`;
    document.getElementById('question-title').textContent = `Forma el color: "${question.question}"`;
    document.getElementById('question-text').textContent = 
      `Arrastra el prefijo y el color en inglés para formar: "${question.question}"`;
    document.getElementById('colors-score').textContent = score;
    document.getElementById('colors-correct').textContent = `${correctAnswers}/${colorQuestions.length}`;

    // Generate random prefixes and colors (more options for difficulty)
    const allPrefixes = ['light', 'dark', 'bright', 'pale', 'deep', 'soft', 'vivid', 'neon'];
    const allColors = ['blue', 'green', 'red', 'yellow', 'purple', 'pink', 'orange', 'brown', 'gray', 'black', 'white'];
    
    // Calculate time based on difficulty (less time as questions progress)
    const baseTime = 30;
    const timeReduction = Math.floor(currentQuestion / 3) * 3; // Reduce 3 seconds every 3 questions
    timeLeft = Math.max(15, baseTime - timeReduction); // Minimum 15 seconds
    
    // Start timer
    questionStartTime = Date.now();
    startTimer();

    // Shuffle and select 6 prefixes (including the correct one) - more options = more difficulty
    const shuffledPrefixes = shuffleArray([...allPrefixes]);
    const selectedPrefixes = [question.prefix];
    shuffledPrefixes.forEach(p => {
      if (selectedPrefixes.length < 6 && !selectedPrefixes.includes(p)) {
        selectedPrefixes.push(p);
      }
    });
    const finalPrefixes = shuffleArray(selectedPrefixes);

    // Shuffle and select 6 colors (including the correct one) - more options = more difficulty
    const shuffledColors = shuffleArray([...allColors]);
    const selectedColors = [question.color];
    shuffledColors.forEach(c => {
      if (selectedColors.length < 6 && !selectedColors.includes(c)) {
        selectedColors.push(c);
      }
    });
    const finalColors = shuffleArray(selectedColors);

    // Render prefixes
    const prefixesList = document.getElementById('prefixes-list');
    prefixesList.innerHTML = '';
    finalPrefixes.forEach(prefix => {
      const prefixEl = document.createElement('div');
      prefixEl.className = 'draggable-item';
      prefixEl.textContent = prefix;
      prefixEl.draggable = true;
      prefixEl.dataset.type = 'prefix';
      prefixEl.dataset.value = prefix;
      prefixesList.appendChild(prefixEl);
    });

    // Render colors
    const colorsList = document.getElementById('colors-list');
    colorsList.innerHTML = '';
    finalColors.forEach(color => {
      const colorEl = document.createElement('div');
      colorEl.className = `draggable-item color-${color}`;
      colorEl.textContent = color;
      colorEl.draggable = true;
      colorEl.dataset.type = 'color';
      colorEl.dataset.value = color;
      colorsList.appendChild(colorEl);
    });

    // Reset drop zone
    const dropZone = document.getElementById('drop-zone');
    dropZone.classList.remove('filled', 'drag-over');
    dropZone.innerHTML = '<div class="drop-zone-placeholder">Arrastra un prefijo y un color aquí para formar la respuesta</div>';

    // Reset feedback
    const feedback = document.getElementById('feedback-message');
    feedback.classList.add('hidden');
    feedback.classList.remove('success', 'error');

    // Update lives display
    document.getElementById('colors-lives').textContent = lives;
    updateLivesDisplay();

    setupDragAndDrop();
  }

  function startTimer() {
    // Clear any existing timer
    if (timerInterval) {
      clearInterval(timerInterval);
    }

    document.getElementById('timer-display').textContent = timeLeft;
    const timerPill = document.getElementById('timer-pill');
    timerPill.classList.remove('timer-warning', 'timer-danger');

    timerInterval = setInterval(() => {
      timeLeft--;
      document.getElementById('timer-display').textContent = timeLeft;

      // Visual warnings
      if (timeLeft <= 5) {
        timerPill.classList.add('timer-danger');
      } else if (timeLeft <= 10) {
        timerPill.classList.add('timer-warning');
      }

      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        handleTimeUp();
      }
    }, 1000);
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function handleTimeUp() {
    stopTimer();
    playFeedbackSound(false);
    lives--;
    document.getElementById('colors-lives').textContent = lives;
    updateLivesDisplay();

    const feedback = document.getElementById('feedback-message');
    feedback.classList.remove('hidden');
    feedback.classList.add('error');
    feedback.classList.remove('success');
    const question = colorQuestions[currentQuestion];
    feedback.textContent = `⏱️ ¡Tiempo agotado! La respuesta correcta era "${question.correctAnswer}" (${question.question}).`;

    if (lives <= 0) {
      setTimeout(() => {
        showGameOver();
      }, 2000);
    } else {
      setTimeout(() => {
        nextQuestion();
      }, 2000);
    }
  }

  function updateLivesDisplay() {
    const livesEl = document.getElementById('colors-lives');
    if (lives <= 1) {
      livesEl.parentElement.classList.add('lives-low');
    } else {
      livesEl.parentElement.classList.remove('lives-low');
    }
  }

  function setupDragAndDrop() {
    const draggableItems = document.querySelectorAll('.draggable-item');
    const dropZone = document.getElementById('drop-zone');

    draggableItems.forEach(item => {
      item.addEventListener('dragstart', handleDragStart);
      item.addEventListener('dragend', handleDragEnd);
    });

    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('drop', handleDrop);
    dropZone.addEventListener('dragleave', handleDragLeave);
  }

  function handleDragStart(e) {
    draggedElement = e.target;
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.innerHTML);
  }

  function handleDragEnd(e) {
    e.target.classList.remove('dragging');
    const dropZone = document.getElementById('drop-zone');
    dropZone.classList.remove('drag-over');
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const dropZone = document.getElementById('drop-zone');
    if (!dropZone.classList.contains('filled')) {
      dropZone.classList.add('drag-over');
    }
  }

  function handleDragLeave(e) {
    const dropZone = document.getElementById('drop-zone');
    dropZone.classList.remove('drag-over');
  }

  function handleDrop(e) {
    e.preventDefault();
    const dropZone = document.getElementById('drop-zone');
    dropZone.classList.remove('drag-over');

    if (!draggedElement) return;

    const type = draggedElement.dataset.type;
    const value = draggedElement.dataset.value;

    // Check if item is already used
    if (draggedElement.classList.contains('used')) {
      return;
    }

    if (type === 'prefix') {
      // Remove previous prefix if exists
      if (currentPrefix) {
        document.querySelectorAll('.draggable-item[data-type="prefix"]').forEach(item => {
          if (item.dataset.value === currentPrefix) {
            item.classList.remove('used');
            item.draggable = true;
          }
        });
      }
      currentPrefix = value;
    } else if (type === 'color') {
      // Remove previous color if exists
      if (currentColor) {
        document.querySelectorAll('.draggable-item[data-type="color"]').forEach(item => {
          if (item.dataset.value === currentColor) {
            item.classList.remove('used');
            item.draggable = true;
          }
        });
      }
      currentColor = value;
    }

    // Mark item as used
    draggedElement.classList.add('used');
    draggedElement.draggable = false;

    // Update drop zone
    updateDropZone();

    // Check if both are selected
    if (currentPrefix && currentColor) {
      setTimeout(() => {
        checkAnswer();
      }, 300);
    }
  }

  function updateDropZone() {
    const dropZone = document.getElementById('drop-zone');
    const answer = currentPrefix && currentColor ? `${currentPrefix} ${currentColor}` : '';
    
    if (answer) {
      dropZone.classList.add('filled');
      dropZone.innerHTML = `
        <div class="drop-zone-content">
          <span>${currentPrefix || '___'}</span>
          <span>${currentColor || '___'}</span>
        </div>
      `;
    } else {
      dropZone.classList.remove('filled');
      dropZone.innerHTML = '<div class="drop-zone-placeholder">Drag a prefix and a color here to form the answer</div>';
    }
  }

  function checkAnswer() {
    const question = colorQuestions[currentQuestion];
    const userAnswer = `${currentPrefix} ${currentColor}`;
    const isCorrect = userAnswer === question.correctAnswer;

    const feedback = document.getElementById('feedback-message');
    feedback.classList.remove('hidden');

    stopTimer();
    const timeTaken = Date.now() - questionStartTime;
    const secondsTaken = Math.floor(timeTaken / 1000);
    const timeBonus = Math.max(0, timeLeft * 2); // Bonus points for remaining time

    if (isCorrect) {
      playFeedbackSound(true);
      // Base points + time bonus + speed bonus
      const basePoints = 10;
      const speedBonus = Math.max(0, Math.floor((timeLeft / 2))); // More points for faster answers
      const pointsEarned = basePoints + timeBonus + speedBonus;
      score += pointsEarned;
      correctAnswers++;
      feedback.classList.add('success');
      feedback.classList.remove('error');
      feedback.textContent = `✓ ¡Correcto! "${question.correctAnswer}" = "${question.question}". ${question.explanation} (+${pointsEarned} puntos - ${secondsTaken}s)`;
      document.getElementById('colors-score').textContent = score;
      document.getElementById('colors-correct').textContent = `${correctAnswers}/${colorQuestions.length}`;
      
      // Auto-advance after 2 seconds
      setTimeout(() => {
        nextQuestion();
      }, 2000);
    } else {
      playFeedbackSound(false);
      lives--;
      document.getElementById('colors-lives').textContent = lives;
      updateLivesDisplay();
      feedback.classList.add('error');
      feedback.classList.remove('success');
      feedback.textContent = `✗ Incorrecto. La respuesta correcta es "${question.correctAnswer}" (${question.question}). ${question.explanation}`;
      
      if (lives <= 0) {
        setTimeout(() => {
          showGameOver();
        }, 2000);
      } else {
        // Allow retry by resetting
        setTimeout(() => {
          resetCurrentQuestion();
        }, 2000);
      }
    }
  }

  function resetCurrentQuestion() {
    currentPrefix = null;
    currentColor = null;
    
    // Reset timer
    const baseTime = 30;
    const timeReduction = Math.floor(currentQuestion / 3) * 3;
    timeLeft = Math.max(15, baseTime - timeReduction);
    questionStartTime = Date.now();
    startTimer();
    
    // Reset all draggable items
    document.querySelectorAll('.draggable-item').forEach(item => {
      item.classList.remove('used');
      item.draggable = true;
    });

    // Reset drop zone
    const dropZone = document.getElementById('drop-zone');
    dropZone.classList.remove('filled');
    dropZone.innerHTML = '<div class="drop-zone-placeholder">Arrastra un prefijo y un color aquí para formar la respuesta</div>';

    // Reset feedback
    const feedback = document.getElementById('feedback-message');
    feedback.classList.add('hidden');
    feedback.classList.remove('success', 'error');

    setupDragAndDrop();
  }

  function nextQuestion() {
    stopTimer();
    currentQuestion++;
    loadQuestion();
  }

  function showGameOver() {
    stopTimer();
    container.innerHTML = `
      <div class="gram-complete" style="background: radial-gradient(circle at top, rgba(156, 39, 176, 0.2), transparent 60%);">
        <div class="gram-card" style="border: 2px solid rgba(156, 39, 176, 0.2);">
          <div class="gram-card-header">
            <p class="final-label" style="color: #9c27b0;">English EduReto</p>
            <div class="gram-trophy" style="background: rgba(156, 39, 176, 0.12); color: #9c27b0;">
              <i class='bx bx-time'></i>
            </div>
            <h2>¡Juego terminado!</h2>
            <p>Se te acabaron las vidas. Completaste ${correctAnswers} de ${colorQuestions.length} preguntas.</p>
          </div>
          <div class="gram-stats">
            <div class="gram-stat" style="background: #f3e5f5; border: 1px solid rgba(156, 39, 176, 0.35);">
              <span style="color: #7b1fa2;">Puntuación Final</span>
              <strong style="color: #6a1b9a;">${score}</strong>
            </div>
            <div class="gram-stat" style="background: #f3e5f5; border: 1px solid rgba(156, 39, 176, 0.35);">
              <span style="color: #7b1fa2;">Respuestas Correctas</span>
              <strong style="color: #6a1b9a;">${correctAnswers}/${colorQuestions.length}</strong>
            </div>
            <div class="gram-stat" style="background: #f3e5f5; border: 1px solid rgba(156, 39, 176, 0.35);">
              <span style="color: #7b1fa2;">Vidas Restantes</span>
              <strong style="color: #6a1b9a;">${lives}</strong>
            </div>
          </div>
          <div class="gram-buttons">
            <a class="action-button gram-secondary" href="${window.gameConfig?.backUrl || '../ingles.html'}" style="background: transparent; color: #9c27b0; border: 2px solid rgba(156, 39, 176, 0.6);">
              <i class='bx bx-home-smile'></i>
              Volver al módulo
            </a>
            <button class="action-button" id="restart-colors" style="background: #9c27b0; color: #fff; box-shadow: 0 10px 20px rgba(156, 39, 176, 0.4);">
              <i class='bx bx-refresh'></i>
              Jugar otra vez
            </button>
          </div>
        </div>
      </div>
    `;
    document.getElementById('restart-colors').addEventListener('click', () => {
      currentQuestion = 0;
      score = 0;
      correctAnswers = 0;
      lives = 3;
      renderLayout();
      loadQuestion();
    });
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
    bgMusic = new Audio(COLORS_MUSIC_PATH);
    bgMusic.loop = true;
    successSound = new Audio(COLORS_SUCCESS_SOUND);
    errorSound = new Audio(COLORS_ERROR_SOUND);
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
    stopTimer();
    container.innerHTML = `
      <div class="gram-complete" style="background: radial-gradient(circle at top, rgba(156, 39, 176, 0.2), transparent 60%);">
        <div class="gram-card" style="border: 2px solid rgba(156, 39, 176, 0.2);">
          <div class="gram-card-header">
            <p class="final-label" style="color: #9c27b0;">English EduReto</p>
            <div class="gram-trophy" style="background: rgba(156, 39, 176, 0.12); color: #9c27b0;">
              <i class='bx bx-palette'></i>
            </div>
            <h2>¡Colores completados!</h2>
            <p>Completaste las ${colorQuestions.length} preguntas y formaste todos los colores correctamente.</p>
          </div>
          <div class="gram-stats">
            <div class="gram-stat" style="background: #f3e5f5; border: 1px solid rgba(156, 39, 176, 0.35);">
              <span style="color: #7b1fa2;">Puntuación</span>
              <strong style="color: #6a1b9a;">${score}</strong>
            </div>
            <div class="gram-stat" style="background: #f3e5f5; border: 1px solid rgba(156, 39, 176, 0.35);">
              <span style="color: #7b1fa2;">Respuestas Correctas</span>
              <strong style="color: #6a1b9a;">${correctAnswers}/${colorQuestions.length}</strong>
            </div>
            <div class="gram-stat" style="background: #f3e5f5; border: 1px solid rgba(156, 39, 176, 0.35);">
              <span style="color: #7b1fa2;">Preguntas</span>
              <strong style="color: #6a1b9a;">${colorQuestions.length}</strong>
            </div>
          </div>
          <div class="gram-buttons">
            <a class="action-button gram-secondary" href="${window.gameConfig?.backUrl || '../ingles.html'}" style="background: transparent; color: #9c27b0; border: 2px solid rgba(156, 39, 176, 0.6);">
              <i class='bx bx-home-smile'></i>
              Volver al módulo
            </a>
            <button class="action-button" id="restart-colors" style="background: #9c27b0; color: #fff; box-shadow: 0 10px 20px rgba(156, 39, 176, 0.4);">
              <i class='bx bx-refresh'></i>
              Jugar otra vez
            </button>
          </div>
        </div>
      </div>
    `;
    document.getElementById('restart-colors').addEventListener('click', () => {
      currentQuestion = 0;
      score = 0;
      correctAnswers = 0;
      renderLayout();
      loadQuestion();
    });
  }
}

