const ruletaConfig = {
  totalRounds: 10,
  pointsPerValidSentence: 2,
  streakBonus: 0,
  dictionary: [
    'amigo', 'bosque', 'caminar', 'descubrir', 'escribir',
    'felicidad', 'guitarra', 'honesto', 'imaginación', 'jardín',
    'kilo', 'luminosa', 'mariposa', 'navegar', 'obedecer',
    'pintar', 'querido', 'risas', 'sabio', 'trabajar',
    'universo', 'valiente', 'whisky', 'xilófono', 'yoyo', 'zorro'
  ]
};

function initGame() {
  const container = document.getElementById('game-container');
  if (!container) return;

  let currentRound = 1;
  let currentWords = [];
  let selectedWord = '';
  let score = 0;
  let streak = 0;
  let canvas, ctx;
  let spinning = false;
  let currentRotation = 0;
let wheelWords = ruletaConfig.dictionary.slice(0, 10);
const bgMusic = new Audio('../assets/gramatic/gramusic.mp3');
bgMusic.loop = true;
let currentVolume = 0.4;
bgMusic.volume = currentVolume;
const successSound = new Audio('../assets/gramatic/success.mp3');
const errorSound = new Audio('../assets/gramatic/error.mp3');
successSound.volume = currentVolume;
errorSound.volume = currentVolume;
let isMuted = false;

  renderLayout();
  setupCanvas();
  updateStats();
  startBackgroundMusic();

  function renderLayout() {
    container.innerHTML = `
      <div class="ruleta-header">
        <div>
          <p class="round-progress">Ronda ${currentRound} de ${ruletaConfig.totalRounds}</p>
          <h2>Ruleta Gramatical</h2>
        </div>
        <div class="ruleta-info">
          <div class="stat-card">
            <span>PUNTOS</span>
            <strong id="stat-score">0</strong>
          </div>
          <div class="stat-card">
            <span>RACHA</span>
            <strong id="stat-streak">0</strong>
          </div>
          <div class="volume-control">
            <button class="volume-toggle" id="volume-toggle" title="Silenciar/activar sonido">
              <i class='bx bx-volume-full'></i>
            </button>
            <input type="range" id="volume-range" min="0" max="100" value="${currentVolume * 100}" />
          </div>
        </div>
      </div>
      <div class="ruleta-body">
        <div class="ruleta-canvas">
          <div class="ruleta-pointer" id="ruleta-pointer">
            <span>Usa esta palabra</span>
          </div>
          <canvas id="ruleta-canvas" width="360" height="360"></canvas>
          <div class="ruleta-controls">
            <button class="ruleta-btn spin" id="btn-spin">
              <i class='bx bx-refresh'></i> Girar Ruleta
            </button>
            <button class="ruleta-btn secondary" id="btn-clear">
              <i class='bx bx-eraser'></i> Limpiar Oración
            </button>
          </div>
        </div>
        <div class="ruleta-panel">
          <h3>Palabra seleccionada</h3>
          <div class="palabras-lista" id="palabras-lista"></div>
          <h3>Tu oración</h3>
          <textarea class="textarea-ruleta" id="textarea-oracion" placeholder="Escribe aquí tu oración..."></textarea>
          <div class="ruleta-controls">
            <button class="ruleta-btn spin" id="btn-validar">
              <i class='bx bx-check'></i> Validar oración
            </button>
          </div>
          <div class="ruleta-feedback" id="ruleta-feedback">
            Gira la ruleta para recibir palabras.
          </div>
        </div>
      </div>
    `;

    document.getElementById('btn-spin').addEventListener('click', handleSpin);
    document.getElementById('btn-clear').addEventListener('click', () => {
      document.getElementById('textarea-oracion').value = '';
      setFeedback('Escribe tu nueva oración.', '');
    });
    document.getElementById('btn-validar').addEventListener('click', validateSentence);
    document.getElementById('volume-toggle').addEventListener('click', toggleVolume);
    document.getElementById('volume-range').addEventListener('input', handleVolumeChange);
  }

  function setupCanvas() {
    canvas = document.getElementById('ruleta-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    currentRotation = 0;
    drawWheel(wheelWords, currentRotation);
  }

  function drawWheel(words, rotation = 0) {
    if (!ctx) return;
    const segments = words.length;
    const angle = (2 * Math.PI) / segments;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotation);
    ctx.translate(-centerX, -centerY);

    words.forEach((word, index) => {
      const startAngle = index * angle;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + angle);
      ctx.fillStyle = index % 2 === 0 ? '#ffb347' : '#ff9100';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.save();
      ctx.translate(
        centerX + Math.cos(startAngle + angle / 2) * (radius * 0.65),
        centerY + Math.sin(startAngle + angle / 2) * (radius * 0.65)
      );
      ctx.rotate(startAngle + angle / 2);
      ctx.fillStyle = '#3b1f00';
      ctx.font = 'bold 16px "Poppins"';
      ctx.textAlign = 'center';
      ctx.fillText(word.toUpperCase(), 0, 5);
      ctx.restore();
    });

    ctx.restore();
  }

  function handleSpin() {
    if (spinning) return;
    spinning = true;
    wheelWords = shuffleArray(ruletaConfig.dictionary).slice(0, 10);
    const segments = wheelWords.length;
    const angle = (2 * Math.PI) / segments;
    const targetIndex = Math.floor(Math.random() * segments);
    selectedWord = wheelWords[targetIndex];

    const pointerAngle = -Math.PI / 2;
    const segmentCenter = targetIndex * angle + angle / 2;
    const desiredRotation = pointerAngle - segmentCenter;
    const fullTurns = Math.floor(Math.random() * 3) + 5; // 5-7 vueltas completas
    const finalRotation = desiredRotation + 2 * Math.PI * fullTurns;
    const startRotation = 0;
    const animationDuration = 3200;
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      currentRotation = startRotation + (finalRotation - startRotation) * eased;
      drawWheel(wheelWords, currentRotation);
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        spinning = false;
        currentWords = wheelWords;
        showWords();
        setFeedback(`Tu palabra es "${selectedWord}". Escríbela en una oración completa.`, '');
      }
    };

    requestAnimationFrame(animate);
  }

  function showWords() {
    const containerWords = document.getElementById('palabras-lista');
    if (!selectedWord) {
      containerWords.innerHTML = '<p class="palabra-diana">Gira la ruleta para obtener tu palabra.</p>';
      setPointerWord('');
      return;
    }
    containerWords.innerHTML = `<p class="palabra-diana">Debes usar la palabra <strong>${selectedWord}</strong> en tu oración.</p>`;
    setPointerWord(selectedWord);
  }

  function setPointerWord(word) {
    const pointer = document.getElementById('ruleta-pointer');
    if (!pointer) return;
    pointer.querySelector('span').textContent = word ? word.toUpperCase() : 'GIRA LA RULETA';
  }

  function validateSentence() {
    if (!selectedWord) {
      setFeedback('Gira la ruleta para obtener tu palabra.', 'error');
      return;
    }
    const textarea = document.getElementById('textarea-oracion');
    const sentence = textarea.value.trim();
    if (!sentence) {
      setFeedback('Escribe tu oración antes de validar.', 'error');
      return;
    }
    const errors = [];
    if (!/^[A-ZÁÉÍÓÚÜÑ]/.test(sentence)) {
      errors.push('La oración debe iniciar con mayúscula.');
    }
    if (!/[.!?]$/.test(sentence)) {
      errors.push('La oración debe terminar con un signo de puntuación (., !, ?).');
    }
    if (!sentence.toLowerCase().includes(selectedWord.toLowerCase())) {
      errors.push(`La oración debe incluir la palabra "${selectedWord}".`);
    }

    if (errors.length) {
      streak = 0;
      updateStats();
      setFeedback(errors.join(' '), 'error');
      playSound(errorSound);
      nextRound(false);
      return;
    }

    const points = ruletaConfig.pointsPerValidSentence;
    score += points;
    streak += 1;
    updateStats();
    setFeedback(`¡Excelente! Sumaste ${points} puntos y llevas ${streak} de racha.`, 'success');
    playSound(successSound);
    nextRound(true);
  }
  function startBackgroundMusic() {
    bgMusic.play().catch(() => {});
  }

  function playSound(audio) {
    if (isMuted) return;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }

  function toggleVolume() {
    isMuted = !isMuted;
    bgMusic.muted = isMuted;
    successSound.muted = isMuted;
    errorSound.muted = isMuted;
    const icon = isMuted ? 'bx-volume-mute' : 'bx-volume-full';
    const toggle = document.getElementById('volume-toggle');
    if (toggle) {
      toggle.innerHTML = `<i class='bx ${icon}'></i>`;
    }
  }

  function handleVolumeChange(e) {
    currentVolume = Number(e.target.value) / 100;
    bgMusic.volume = currentVolume;
    successSound.volume = currentVolume;
    errorSound.volume = currentVolume;
  }

  function nextRound(success) {
    document.getElementById('textarea-oracion').value = '';
    selectedWord = '';
    showWords();
    if (currentRound >= ruletaConfig.totalRounds) {
      showFinalScreen();
      return;
    }
    currentRound += 1;
    document.querySelector('.round-progress').textContent =
      `Ronda ${currentRound} de ${ruletaConfig.totalRounds}`;
  }

  function updateStats() {
    document.getElementById('stat-score').textContent = score;
    document.getElementById('stat-streak').textContent = streak;
  }

  function setFeedback(message, type) {
    const feedback = document.getElementById('ruleta-feedback');
    feedback.textContent = message;
    feedback.classList.remove('success', 'error');
    if (type) feedback.classList.add(type);
  }

  function showFinalScreen() {
    const finalMessage = `
      <div class="ruleta-final">
        <p class="final-label">Gramática EduReto</p>
        <div class="gram-trophy">
          <i class='bx bx-game'></i>
        </div>
        <h2>Giro final completado</h2>
        <p>Jugaste ${ruletaConfig.totalRounds} rondas y obtuviste estas estadísticas:</p>
        <div class="gram-stats">
          <div class="gram-stat">
            <span>Puntuación</span>
            <strong>${score}</strong>
          </div>
          <div class="gram-stat">
            <span>Mejor racha</span>
            <strong>${streak}</strong>
          </div>
        </div>
        <div class="gram-buttons">
          <a class="action-button gram-secondary" href="${window.gameConfig?.backUrl || '../gramatica.html'}">
            <i class='bx bx-home-smile'></i>
            Volver al módulo
          </a>
          <button class="action-button" id="ruleta-restart">
            <i class='bx bx-refresh'></i>
            Jugar otra vez
          </button>
        </div>
      </div>
    `;
    container.innerHTML = finalMessage;
    document.getElementById('ruleta-restart').addEventListener('click', () => {
      currentRound = 1;
      currentWords = [];
      score = 0;
      streak = 0;
      renderLayout();
      setupCanvas();
      updateStats();
    });
  }
}

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

