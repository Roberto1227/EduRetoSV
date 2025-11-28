const CARTAS_MUSIC_PATH = '../assets/gramatic/gramusic.mp3';
const CARTAS_SUCCESS_SOUND = '../assets/gramatic/success.mp3';
const CARTAS_ERROR_SOUND = '../assets/gramatic/error.mp3';
const MAX_ERRORS = 8;

const cartasData = [
  { word: 'montaña', type: 'sustantivo' },
  { word: 'azul', type: 'adjetivo' },
  { word: 'correr', type: 'verbo' },
  { word: 'amistad', type: 'sustantivo' },
  { word: 'brillante', type: 'adjetivo' },
  { word: 'saltar', type: 'verbo' },
  { word: 'libro', type: 'sustantivo' },
  { word: 'dulce', type: 'adjetivo' },
  { word: 'cantar', type: 'verbo' },
  { word: 'maestro', type: 'sustantivo' },
  { word: 'valiente', type: 'adjetivo' },
  { word: 'escribir', type: 'verbo' },
  { word: 'ciudad', type: 'sustantivo' },
  { word: 'suave', type: 'adjetivo' },
  { word: 'jugar', type: 'verbo' },
  { word: 'lluvia', type: 'sustantivo' },
  { word: 'rápido', type: 'adjetivo' },
  { word: 'nadar', type: 'verbo' },
  { word: 'sonrisa', type: 'sustantivo' },
  { word: 'frío', type: 'adjetivo' },
  { word: 'pensar', type: 'verbo' },
  { word: 'aventura', type: 'sustantivo' },
  { word: 'generoso', type: 'adjetivo' },
  { word: 'hablar', type: 'verbo' },
  { word: 'planeta', type: 'sustantivo' },
  { word: 'luminoso', type: 'adjetivo' },
  { word: 'construir', type: 'verbo' },
  { word: 'familia', type: 'sustantivo' }
];

const TOTAL_CARTAS = cartasData.length;
let cartasBgMusic = null;
let cartasSuccessSound = null;
let cartasErrorSound = null;
let cartasAudioReady = false;
let cartasMuted = false;
let cartasVolume = 0.5;

function ensureCartasAudio() {
  if (cartasAudioReady) return;
  cartasBgMusic = new Audio(CARTAS_MUSIC_PATH);
  cartasBgMusic.loop = true;
  cartasSuccessSound = new Audio(CARTAS_SUCCESS_SOUND);
  cartasErrorSound = new Audio(CARTAS_ERROR_SOUND);
  cartasAudioReady = true;
  setCartasAudioVolume(cartasVolume);
}

function startCartasMusic() {
  ensureCartasAudio();
  if (!cartasMuted) {
    cartasBgMusic.play().catch(() => {});
  }
}

function setCartasAudioVolume(volume) {
  cartasVolume = Math.min(1, Math.max(0, volume));
  if (!cartasAudioReady) return;
  cartasBgMusic.volume = cartasVolume;
  cartasSuccessSound.volume = cartasVolume;
  cartasErrorSound.volume = cartasVolume;
}

function playCartasSound(isCorrect) {
  ensureCartasAudio();
  if (cartasMuted) return;
  const sound = isCorrect ? cartasSuccessSound : cartasErrorSound;
  if (!sound) return;
  sound.currentTime = 0;
  sound.play().catch(() => {});
}

function initGame() {
  const container = document.getElementById('game-container');
  if (!container) return;

  let cards = [];
  let selectedCard = null;
  let correctCount = 0;
  let errorCount = 0;
  let elapsedSeconds = 0;
  let timerInterval = null;
  let gameFinished = false;

  let gridElement = null;
  let feedbackElement = null;
  let panelWordElement = null;
  let categoryButtons = [];

  setupGame();
  renderLayout();
  renderCards();
  updateStats();
  updateTimerDisplay();
  startTimer();

  function setupGame() {
    cards = cartasData.map((card, index) => ({
      ...card,
      index,
      revealed: false,
      correct: false
    }));
    selectedCard = null;
    correctCount = 0;
    errorCount = 0;
    elapsedSeconds = 0;
    gameFinished = false;
  }

  function renderLayout() {
    container.innerHTML = `
      <div class="cartas-header">
        <div>
          <p class="round-progress">Clasifica las ${TOTAL_CARTAS} palabras</p>
          <h2>Cartas de Gramática</h2>
        </div>
        <div class="cartas-stats">
          <div class="stat-pill">
            <span>Aciertos</span>
            <strong id="stat-correct">0</strong>
          </div>
          <div class="stat-pill">
            <span>Errores (máx ${MAX_ERRORS})</span>
            <strong id="stat-errors">0</strong>
          </div>
          <div class="stat-pill">
            <span>Restantes</span>
            <strong id="stat-remaining">${TOTAL_CARTAS}</strong>
          </div>
          <div class="stat-pill">
            <span>Tiempo</span>
            <strong id="stat-time">00:00</strong>
          </div>
        </div>
      </div>
      <div class="cartas-content">
        <div class="cartas-grid" id="cartas-grid"></div>
        <div class="cartas-panel">
          <h3>Clasifica la palabra</h3>
          <div class="panel-word" id="panel-word">Abre una caja para descubrir la palabra.</div>
          <div class="category-buttons">
            <button class="category-btn" data-type="sustantivo">
              <i class='bx bxs-package'></i> Sustantivo
            </button>
            <button class="category-btn" data-type="adjetivo">
              <i class='bx bxs-star'></i> Adjetivo
            </button>
            <button class="category-btn" data-type="verbo">
              <i class='bx bx-run'></i> Verbo
            </button>
          </div>
          <div class="cartas-feedback" id="cartas-feedback">
            Selecciona una caja numerada para comenzar.
          </div>
          <button class="cartas-reset" id="cartas-reset">
            <i class='bx bx-refresh'></i> Reiniciar juego
          </button>
        </div>
      </div>
    `;

    gridElement = document.getElementById('cartas-grid');
    feedbackElement = document.getElementById('cartas-feedback');
    panelWordElement = document.getElementById('panel-word');
    categoryButtons = Array.from(document.querySelectorAll('.category-btn'));

    categoryButtons.forEach((btn) => {
      btn.addEventListener('click', () => handleCategoryClick(btn.dataset.type));
    });

    document.getElementById('cartas-reset').addEventListener('click', resetGame);
    setCategoryButtonsDisabled(true);
    startCartasMusic();
  }

  function renderCards() {
    if (!gridElement) return;
    gridElement.innerHTML = cards
      .map((card) => {
        const classes = [
          'carta-box',
          card.revealed ? 'revealed' : '',
          card.correct ? 'correct disabled' : '',
          selectedCard === card.index ? 'active' : ''
        ]
          .filter(Boolean)
          .join(' ');
        return `
          <button class="${classes}" data-card="${card.index}" ${card.correct ? 'disabled' : ''}>
            <span class="box-number">#${card.index + 1}</span>
            <span class="box-word">${card.word}</span>
          </button>
        `;
      })
      .join('');

    gridElement.querySelectorAll('.carta-box').forEach((cardElement) => {
      cardElement.addEventListener('click', () => {
        const index = Number(cardElement.getAttribute('data-card'));
        handleCardClick(index);
      });
    });
  }

  function handleCardClick(index) {
    if (gameFinished) return;
    const card = cards[index];
    if (card.correct) {
      setFeedback(`"${card.word}" ya fue clasificada. Abre otra caja.`, '');
      return;
    }

    cards[index].revealed = true;
    selectedCard = index;
    panelWordElement.textContent = cards[index].word;
    setFeedback('Selecciona la categoría correcta para esta palabra.', '');
    setCategoryButtonsDisabled(false);
    renderCards();
  }

  function handleCategoryClick(selectedType) {
    if (selectedCard === null || gameFinished) {
      setFeedback('Primero abre una caja y observa la palabra.', '');
      return;
    }

    const card = cards[selectedCard];
    if (card.correct) {
      setFeedback('Esta palabra ya fue clasificada. Elige otra caja.', '');
      setCategoryButtonsDisabled(true);
      return;
    }

    if (card.type === selectedType) {
      playCartasSound(true);
      card.correct = true;
      card.revealed = true;
      correctCount += 1;
      setFeedback(`¡Correcto! "${card.word}" es un ${selectedType}.`, 'success');
      flashCardState(card.index, 'correct');
      selectedCard = null;
      panelWordElement.textContent = 'Abre otra caja para continuar.';
      setCategoryButtonsDisabled(true);
      if (correctCount === TOTAL_CARTAS) {
        finishGame();
        return;
      }
    } else {
      errorCount += 1;
      playCartasSound(false);
      setFeedback(`"${card.word}" no es ${selectedType}. Inténtalo nuevamente.`, 'error');
      flashCardState(card.index, 'error');
      if (errorCount >= MAX_ERRORS) {
        setCategoryButtonsDisabled(true);
        finishGame(false);
        return;
      }
    }

    updateStats();
    renderCards();
  }

  function flashCardState(index, state) {
    const cardElement = document.querySelector(`[data-card="${index}"]`);
    if (!cardElement) return;
    cardElement.classList.remove('correct', 'error');
    cardElement.classList.add(state);
    if (state === 'error') {
      setTimeout(() => {
        cardElement.classList.remove('error');
      }, 700);
    }
  }

  function setCategoryButtonsDisabled(disabled) {
    categoryButtons.forEach((btn) => {
      btn.disabled = disabled;
    });
  }

  function updateStats() {
    const remaining = TOTAL_CARTAS - correctCount;
    const correctElement = document.getElementById('stat-correct');
    const errorElement = document.getElementById('stat-errors');
    const remainingElement = document.getElementById('stat-remaining');
    if (correctElement) correctElement.textContent = correctCount;
    if (errorElement) errorElement.textContent = errorCount;
    if (remainingElement) remainingElement.textContent = remaining;
  }

  function setFeedback(message, type) {
    if (!feedbackElement) return;
    feedbackElement.textContent = message;
    feedbackElement.classList.remove('success', 'error');
    if (type) {
      feedbackElement.classList.add(type);
    }
  }

  function startTimer() {
    stopTimer();
    timerInterval = setInterval(() => {
      elapsedSeconds += 1;
      updateTimerDisplay();
    }, 1000);
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function updateTimerDisplay() {
    const timeElement = document.getElementById('stat-time');
    if (timeElement) {
      timeElement.textContent = formatTime(elapsedSeconds);
    }
  }

  function formatTime(seconds) {
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  }

  function resetGame() {
    stopTimer();
    setupGame();
    renderLayout();
    renderCards();
    updateStats();
    updateTimerDisplay();
    startTimer();
  }

  function finishGame(didWin = true) {
    gameFinished = true;
    stopTimer();
    showFinalScreen(didWin);
  }

  function showFinalScreen(didWin) {
    const title = didWin ? '¡Clasificación completada!' : 'Game Over';
    const description = didWin
      ? `Clasificaste las ${TOTAL_CARTAS} palabras en ${formatTime(elapsedSeconds)}.`
      : `Alcanzaste el máximo de ${MAX_ERRORS} errores. ¡Vuelve a intentarlo!`;
    const finalClass = didWin ? 'cartas-final' : 'cartas-final game-over';
    const trophyIcon = didWin ? 'bxs-book-open' : 'bx-x';
    container.innerHTML = `
      <div class="${finalClass}">
        <p class="final-label">${didWin ? 'Gramática EduReto' : 'Has usado todos tus intentos'}</p>
        <div class="gram-trophy">
          <i class='bx ${trophyIcon}'></i>
        </div>
        <h2>${title}</h2>
        <p>${description}</p>
        <div class="gram-stats">
          <div class="gram-stat">
            <span>Aciertos</span>
            <strong>${correctCount}</strong>
          </div>
          <div class="gram-stat">
            <span>Errores</span>
            <strong>${errorCount}</strong>
          </div>
          <div class="gram-stat">
            <span>Tiempo</span>
            <strong>${formatTime(elapsedSeconds)}</strong>
          </div>
        </div>
        <div class="gram-buttons">
          <a class="action-button gram-secondary" href="${window.gameConfig?.backUrl || '../gramatica.html'}">
            <i class='bx bx-home-smile'></i>
            Volver al módulo
          </a>
          <button class="action-button" id="cartas-restart">
            <i class='bx bx-refresh'></i>
            Jugar otra vez
          </button>
        </div>
      </div>
    `;

    const restartBtn = document.getElementById('cartas-restart');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        initGame();
      });
    }
  }
}

