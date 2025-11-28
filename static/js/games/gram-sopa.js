/* eslint-disable no-undef */
const MUSIC_PATH = '../assets/gramatic/gramusic.mp3';
const LETTERS = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';
const backgroundMusic = new Audio(MUSIC_PATH);
backgroundMusic.loop = true;
let musicInitialized = false;
let audioContext = null;
let currentVolume = 0.6;
backgroundMusic.volume = currentVolume;
const VOLUME_STEP = 0.1;

const grammarRounds = [
  {
    title: 'Ronda 1 · Verbos en acción',
    description: 'Ubica los verbos y descubre cómo se usan en frases cotidianas.',
    timeLimit: 120,
    size: 10,
    words: [
      {
        word: 'SALTA',
        type: 'Verbo',
        example: 'Ana salta la cuerda para hacer ejercicio.'
      },
      {
        word: 'CORRE',
        type: 'Verbo',
        example: 'Luis corre rápido para alcanzar el bus.'
      },
      {
        word: 'ESCRIBE',
        type: 'Verbo',
        example: 'María escribe cuentos en su cuaderno.'
      },
      {
        word: 'IMAGINA',
        type: 'Verbo',
        example: 'Pedro imagina mundos fantásticos al leer.'
      },
      {
        word: 'JUEGA',
        type: 'Verbo',
        example: 'La clase juega fútbol en el recreo.'
      },
      {
        word: 'LEE',
        type: 'Verbo',
        example: 'Valeria lee un poema en voz alta.'
      }
    ]
  },
  {
    title: 'Ronda 2 · Adjetivos brillantes',
    description: 'Encuentra adjetivos que describen cualidades y emociones.',
    timeLimit: 120,
    size: 10,
    words: [
      {
        word: 'FELIZ',
        type: 'Adjetivo',
        example: 'El grupo está feliz después de terminar la tarea.'
      },
      {
        word: 'AMABLE',
        type: 'Adjetivo',
        example: 'El maestro es amable cuando explica una duda.'
      },
      {
        word: 'VALIENTE',
        type: 'Adjetivo',
        example: 'Sofía fue valiente al hablar frente a todos.'
      },
      {
        word: 'HONESTO',
        type: 'Adjetivo',
        example: 'Pablo fue honesto y regresó el cuaderno perdido.'
      },
      {
        word: 'CURIOSO',
        type: 'Adjetivo',
        example: 'Un estudiante curioso hace muchas preguntas.'
      },
      {
        word: 'CALMADO',
        type: 'Adjetivo',
        example: 'Mateo permanece calmado incluso cuando hay ruido.'
      }
    ]
  },
  {
    title: 'Ronda 3 · Detectives de palabras',
    description: 'Relaciona conectores y categorías gramaticales clave.',
    timeLimit: 120,
    size: 11,
    words: [
      {
        word: 'ADVERBIO',
        type: 'Concepto',
        example: 'El adverbio indica cómo sucede una acción: “Camila corre rápidamente”.'
      },
      {
        word: 'PRONOMBRE',
        type: 'Concepto',
        example: 'Los pronombres sustituyen sustantivos: “Ellos compartirán la historia”.'
      },
      {
        word: 'SUSTANTIVO',
        type: 'Concepto',
        example: 'Un sustantivo nombra personas, lugares o cosas: “La montaña es alta”.'
      },
      {
        word: 'CONJUNCION',
        type: 'Concepto',
        example: 'Las conjunciones unen ideas: “Quiero leer y escribir”.'
      },
      {
        word: 'ANTONIMO',
        type: 'Concepto',
        example: 'Un antónimo expresa el significado opuesto: “frío” y “caliente”.'
      },
      {
        word: 'SINONIMO',
        type: 'Concepto',
        example: 'Un sinónimo comparte significado similar: “feliz” y “contento”.'
      }
    ]
  }
];

const totalWordsCount = grammarRounds.reduce((acc, round) => acc + round.words.length, 0);

function initGame() {
  const gameContainer = document.getElementById('game-container');
  if (!gameContainer) return;

  let currentRoundIndex = 0;
  let timerInterval = null;
  let timeLeft = 0;
  let isBoardLocked = false;
  let isSelecting = false;
  let activePointerId = null;
  let currentPath = [];
  let foundWords = new Set();
  let volumeDisplay = null;

  renderLayout();
  startBackgroundMusic();
  loadRound();

  function renderLayout() {
    gameContainer.innerHTML = `
      <div class="sopa-header">
        <div class="round-info">
          <p class="round-progress" id="round-progress"></p>
          <h2 id="round-title"></h2>
          <p id="round-description"></p>
        </div>
        <div class="header-tools">
          <div class="timer-box">
            <i class='bx bx-time-five'></i>
            <span id="timer-display">00:00</span>
          </div>
          <div class="audio-controls">
            <button class="audio-btn" id="volume-down" aria-label="Bajar volumen">
              <i class='bx bx-volume-low'></i>
            </button>
            <span class="volume-level" id="volume-level">60%</span>
            <button class="audio-btn" id="volume-up" aria-label="Subir volumen">
              <i class='bx bx-volume-full'></i>
            </button>
          </div>
        </div>
      </div>
      <div class="status-banner" id="status-banner" hidden>
        <i class='bx bx-bulb' id="status-icon"></i>
        <span id="status-text"></span>
      </div>
      <div class="sopa-body">
        <div class="board-grid" id="board-grid"></div>
        <div class="word-panel">
          <h3>Palabras a encontrar</h3>
          <p class="round-progress" id="words-progress"></p>
          <ul class="word-list" id="word-list"></ul>
          <div class="example-box">
            <h4>Ejemplo educativo</h4>
            <p id="example-text">Selecciona una palabra en la sopa de letras.</p>
          </div>
          <button class="action-button" id="round-action" disabled data-action="">
            <i class='bx bx-chevrons-right'></i>
            <span id="action-label">Siguiente ronda</span>
          </button>
        </div>
      </div>
    `;

    const volumeDownBtn = document.getElementById('volume-down');
    const volumeUpBtn = document.getElementById('volume-up');
    volumeDisplay = document.getElementById('volume-level');
    volumeDownBtn.addEventListener('click', () => adjustVolume(-VOLUME_STEP));
    volumeUpBtn.addEventListener('click', () => adjustVolume(VOLUME_STEP));
    updateVolumeUI();
  }

  function loadRound() {
    triggerRoundAnimation();

    const round = grammarRounds[currentRoundIndex];
    const boardGrid = document.getElementById('board-grid');
    const wordList = document.getElementById('word-list');
    const roundTitle = document.getElementById('round-title');
    const roundDescription = document.getElementById('round-description');
    const roundProgress = document.getElementById('round-progress');
    const wordsProgress = document.getElementById('words-progress');
    const exampleText = document.getElementById('example-text');
    const roundAction = document.getElementById('round-action');
    const statusBanner = document.getElementById('status-banner');
    const actionLabel = document.getElementById('action-label');

    foundWords = new Set();
    isBoardLocked = false;
    isSelecting = false;
    currentPath = [];
    roundAction.disabled = true;
    roundAction.dataset.action = '';
    statusBanner.hidden = true;
    exampleText.textContent = 'Selecciona una palabra en la sopa de letras.';

    roundTitle.textContent = round.title;
    roundDescription.textContent = round.description;
    roundProgress.textContent = `Ronda ${currentRoundIndex + 1} de ${grammarRounds.length}`;
    updateWordsProgress();

    const boardMatrix = generateBoard(round);
    boardGrid.innerHTML = '';
    boardGrid.style.setProperty('--cols', boardMatrix[0].length);
    boardGrid.classList.remove('board-disabled');

    boardMatrix.forEach((rowStr, rowIndex) => {
      rowStr.split('').forEach((letter, colIndex) => {
        const cell = document.createElement('button');
        cell.type = 'button';
        cell.className = 'board-cell';
        cell.dataset.row = rowIndex;
        cell.dataset.col = colIndex;
        cell.dataset.letter = letter;
        cell.textContent = letter;
        boardGrid.appendChild(cell);
      });
    });

    wordList.innerHTML = '';
    round.words.forEach(({ word, type }) => {
      const normalized = word.toUpperCase().replace(/\s+/g, '');
      const li = document.createElement('li');
      li.className = 'word-item';
      li.dataset.word = normalized;
      li.innerHTML = `<span>${word}</span><span>${type}</span>`;
      wordList.appendChild(li);
    });

    attachBoardEvents(boardGrid);
    startTimer(round.timeLimit);

    roundAction.onclick = () => {
      const action = roundAction.dataset.action;
      if (action === 'next') {
        currentRoundIndex += 1;
        loadRound();
      } else if (action === 'retry') {
        loadRound();
      } else if (action === 'finish') {
        displayCompletion();
      }
    };

    function updateWordsProgress() {
      wordsProgress.textContent = `${foundWords.size} / ${round.words.length} palabras encontradas`;
    }

    function attachBoardEvents(grid) {
      grid.onpointerdown = (event) => {
        const cell = event.target.closest('.board-cell');
        if (!cell || isBoardLocked) return;
        event.preventDefault();
        if (!isSelecting) {
          window.addEventListener('pointerup', handlePointerUp);
        }
        isSelecting = true;
        activePointerId = event.pointerId;
        currentPath = [cell];
        cell.classList.add('selected');
      };

      grid.onpointerover = (event) => {
        if (!isSelecting || event.pointerId !== activePointerId) return;
        const cell = event.target.closest('.board-cell');
        if (!cell || isBoardLocked) return;
        if (currentPath.includes(cell)) return;
        const lastCell = currentPath[currentPath.length - 1];
        if (!checkNeighbor(lastCell, cell)) return;
        currentPath.push(cell);
        cell.classList.add('selected');
      };
    }

    function handlePointerUp(event) {
      if (!isSelecting || event.pointerId !== activePointerId) return;
      event.preventDefault();
      finalizeSelection();
      isSelecting = false;
      activePointerId = null;
      window.removeEventListener('pointerup', handlePointerUp);
    }

    function finalizeSelection() {
      if (!currentPath.length) return;
      const selectedWord = currentPath.map((cell) => cell.dataset.letter).join('');
      const reversed = selectedWord.split('').reverse().join('');
      const hit = round.words.find(
        ({ word }) => {
          const normalized = word.toUpperCase().replace(/\s+/g, '');
          return (
            (normalized === selectedWord || normalized === reversed) &&
            !foundWords.has(normalized)
          );
        }
      );

      if (hit) {
        currentPath.forEach((cell) => {
          cell.classList.remove('selected');
          cell.classList.add('found');
        });
        const normalizedWord = hit.word.toUpperCase().replace(/\s+/g, '');
        foundWords.add(normalizedWord);
        updateWordsProgress();
        highlightWord(normalizedWord);
        exampleText.innerHTML = `<strong>${hit.word}</strong> (${hit.type}): ${hit.example}`;
        showStatus(`¡Muy bien! "${hit.word}" identificado.`, 'bx bx-happy-beaming');
        if (foundWords.size === round.words.length) {
          handleRoundCompleted();
        }
      } else {
        currentPath.forEach((cell) => cell.classList.remove('selected'));
      }

      currentPath = [];
    }

    function highlightWord(wordKey) {
      const target = wordList.querySelector(`[data-word="${wordKey}"]`);
      if (target) {
        target.classList.add('found');
      }
    }

    function handleRoundCompleted() {
      stopTimer();
      playRoundChime();
      isBoardLocked = true;
      boardGrid.classList.add('board-disabled');
      roundAction.disabled = false;
      if (currentRoundIndex === grammarRounds.length - 1) {
        roundAction.dataset.action = 'finish';
        actionLabel.textContent = 'Ver resultado final';
        showStatus('¡Ronda superada! ¿Listo para ver tu resultado?', 'bx bx-party');
      } else {
        roundAction.dataset.action = 'next';
        actionLabel.textContent = 'Ir a la siguiente ronda';
        showStatus('¡Excelente! Pasemos a una nueva ronda.', 'bx bx-rocket');
      }
    }

    function showStatus(message, iconClass = 'bx bx-bulb') {
      const statusText = document.getElementById('status-text');
      const statusIcon = document.getElementById('status-icon');
      statusText.textContent = message;
      statusIcon.className = iconClass;
      statusBanner.hidden = false;
    }

    function onTimeUp() {
      isBoardLocked = true;
      boardGrid.classList.add('board-disabled');
      roundAction.disabled = false;
      roundAction.dataset.action = 'retry';
      actionLabel.textContent = 'Intentar la ronda de nuevo';
      showStatus('¡Tiempo agotado! Vuelve a intentarlo.', 'bx bx-time');
    }

    function startTimer(seconds) {
      stopTimer();
      timeLeft = seconds;
      updateTimerDisplay();
      timerInterval = setInterval(() => {
        timeLeft -= 1;
        if (timeLeft < 0) {
          stopTimer();
          onTimeUp();
        } else {
          updateTimerDisplay();
        }
      }, 1000);
    }

    function stopTimer() {
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
    }

    function updateTimerDisplay() {
      const timerDisplay = document.getElementById('timer-display');
      const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
      const seconds = String(timeLeft % 60).padStart(2, '0');
      timerDisplay.textContent = `${minutes}:${seconds}`;
    }

    function checkNeighbor(cellA, cellB) {
      const rowA = Number(cellA.dataset.row);
      const colA = Number(cellA.dataset.col);
      const rowB = Number(cellB.dataset.row);
      const colB = Number(cellB.dataset.col);
      return Math.abs(rowA - rowB) <= 1 && Math.abs(colA - colB) <= 1;
    }
  }

  function startBackgroundMusic() {
    if (musicInitialized && !backgroundMusic.paused) return;
    musicInitialized = true;
    backgroundMusic.play().catch(() => {
      // El usuario puede necesitar interactuar nuevamente para permitir el audio.
    });
  }

  function adjustVolume(delta) {
    currentVolume = Math.min(1, Math.max(0, parseFloat((currentVolume + delta).toFixed(2))));
    backgroundMusic.volume = currentVolume;
    updateVolumeUI();
  }

  function updateVolumeUI() {
    if (!volumeDisplay) return;
    volumeDisplay.textContent = `${Math.round(currentVolume * 100)}%`;
  }

  function triggerRoundAnimation() {
    gameContainer.classList.remove('round-enter');
    void gameContainer.offsetWidth; // reinicia la animación
    gameContainer.classList.add('round-enter');
  }

  function playRoundChime() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    if (!audioContext) {
      audioContext = new AudioCtx();
    }
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(720, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.0001, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.3, audioContext.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.6);
    oscillator.connect(gainNode).connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.6);
  }

  function displayCompletion() {
    clearInterval(timerInterval);
    timerInterval = null;
    gameContainer.innerHTML = `
      <div class="gram-complete">
        <div class="gram-card">
          <div class="gram-card-header">
            <p class="final-label">Gramática EduReto</p>
            <div class="gram-trophy">
              <i class='bx bx-book-heart'></i>
            </div>
            <h2>¡Misión lingüística completada!</h2>
            <p>Superaste las ${grammarRounds.length} rondas y recopilaste ${totalWordsCount} pistas educativas.</p>
          </div>
          <div class="gram-stats">
            <div class="gram-stat">
              <span>Rondas</span>
              <strong>${grammarRounds.length}</strong>
            </div>
            <div class="gram-stat">
              <span>Palabras</span>
              <strong>${totalWordsCount}</strong>
            </div>
            <div class="gram-stat">
              <span>Modo</span>
              <strong>Sopa</strong>
            </div>
          </div>
          <div class="gram-buttons">
            <a class="action-button gram-secondary" href="${window.gameConfig?.backUrl || '../gramatica.html'}">
              <i class='bx bx-home-smile'></i>
              Volver al módulo
            </a>
            <button class="action-button" id="replay-game">
              <i class='bx bx-refresh'></i>
              Jugar otra vez
            </button>
          </div>
        </div>
      </div>
    `;

    const replayBtn = document.getElementById('replay-game');
    replayBtn.addEventListener('click', () => {
      currentRoundIndex = 0;
      renderLayout();
      startBackgroundMusic();
      loadRound();
    });
  }
}

function generateBoard(round) {
  const size = round.size || 10;
  const board = Array.from({ length: size }, () => Array(size).fill(''));
  const directions = [
    { row: 0, col: 1 },
    { row: 0, col: -1 },
    { row: 1, col: 0 },
    { row: -1, col: 0 },
    { row: 1, col: 1 },
    { row: 1, col: -1 },
    { row: -1, col: 1 },
    { row: -1, col: -1 }
  ];

  round.words
    .map((entry) => entry.word.toUpperCase().replace(/\s+/g, ''))
    .forEach((word) => placeWord(word));

  for (let r = 0; r < size; r += 1) {
    for (let c = 0; c < size; c += 1) {
      if (!board[r][c]) {
        board[r][c] = LETTERS[Math.floor(Math.random() * LETTERS.length)];
      }
    }
  }

  return board.map((row) => row.join(''));

  function placeWord(word) {
    const attempts = 120;
    for (let attempt = 0; attempt < attempts; attempt += 1) {
      const direction = directions[Math.floor(Math.random() * directions.length)];
      const startRow = getRandomInt(0, size - 1);
      const startCol = getRandomInt(0, size - 1);
      const endRow = startRow + direction.row * (word.length - 1);
      const endCol = startCol + direction.col * (word.length - 1);

      if (endRow < 0 || endRow >= size || endCol < 0 || endCol >= size) {
        continue;
      }

      let fits = true;
      for (let i = 0; i < word.length; i += 1) {
        const row = startRow + direction.row * i;
        const col = startCol + direction.col * i;
        const currentLetter = board[row][col];
        if (currentLetter && currentLetter !== word[i]) {
          fits = false;
          break;
        }
      }

      if (!fits) continue;

      for (let i = 0; i < word.length; i += 1) {
        const row = startRow + direction.row * i;
        const col = startCol + direction.col * i;
        board[row][col] = word[i];
      }
      return;
    }

    // Fallback horizontal placement if random attempts fail
    for (let row = 0; row < size; row += 1) {
      for (let col = 0; col <= size - word.length; col += 1) {
        let fits = true;
        for (let i = 0; i < word.length; i += 1) {
          const currentLetter = board[row][col + i];
          if (currentLetter && currentLetter !== word[i]) {
            fits = false;
            break;
          }
        }
        if (!fits) continue;
        for (let i = 0; i < word.length; i += 1) {
          board[row][col + i] = word[i];
        }
        return;
      }
    }
  }
}

function getRandomInt(min, max) {
  const minCeil = Math.ceil(min);
  const maxFloor = Math.floor(max);
  return Math.floor(Math.random() * (maxFloor - minCeil + 1)) + minCeil;
}

