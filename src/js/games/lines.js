let linesState = {
  isDrawing: false,
  startX: 0,
  startY: 0,
  correctPoints: 0,
  totalPoints: 50
};

function initLinesGame() {
  const canvas = document.getElementById('linesCanvas');
  const ctx = canvas.getContext('2d');

  canvas.width = canvas.offsetWidth;
  canvas.height = 400;

  linesState = {
    isDrawing: false,
    startX: 50,
    startY: 50,
    correctPoints: 0,
    totalPoints: 50
  };

  let errorEl = document.getElementById('linesError');
  if (!errorEl) {
    errorEl = document.createElement('p');
    errorEl.id = 'linesError';
    errorEl.className = 'lines-error';
    canvas.parentNode.appendChild(errorEl);
  }
  errorEl.textContent = '';

  drawLinesPath(ctx);

  canvas.addEventListener('mousedown', (e) => startDrawing(e, canvas, ctx));
  canvas.addEventListener('mousemove', (e) => drawLine(e, canvas, ctx));
  canvas.addEventListener('mouseup', () => stopDrawing(canvas, ctx));
  canvas.addEventListener('touchstart', (e) => startDrawing(e, canvas, ctx));
  canvas.addEventListener('touchmove', (e) => drawLine(e, canvas, ctx));
  canvas.addEventListener('touchend', () => stopDrawing(canvas, ctx));
}

function drawLinesPath(ctx) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  ctx.fillStyle = '#f9f9f9';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  ctx.strokeStyle = '#ccc';
  ctx.lineWidth = 6;
  ctx.setLineDash([8, 6]);
  ctx.beginPath();
  ctx.moveTo(50, 50);

  for (let i = 50; i < 350; i += 10) {
    const x = 100 + Math.sin(i * 0.05) * 40;
    const y = i;
    ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = '#00D4FF';
  ctx.beginPath();
  ctx.arc(50, 50, 15, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#FF6B9D';
  ctx.beginPath();
  ctx.arc(100, 360, 15, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#2c2c2a';
  ctx.font = '12px system-ui';
  ctx.fillText('Inicio', 25, 80);
  ctx.fillText('Fin', 75, 380);
}

function startDrawing(e, canvas, ctx) {
  const rect = canvas.getBoundingClientRect();
  const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
  const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;

  const distance = Math.sqrt((x - 50) ** 2 + (y - 50) ** 2);
  if (distance <= 20) {
    linesState.isDrawing = true;
    linesState.startX = x;
    linesState.startY = y;
    linesState.correctPoints = 0;

    const errorEl = document.getElementById('linesError');
    if (errorEl) errorEl.textContent = '';
  }
}

function drawLine(e, canvas, ctx) {
  if (!linesState.isDrawing) return;

  const rect = canvas.getBoundingClientRect();
  const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
  const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;

  drawLinesPath(ctx);

  ctx.strokeStyle = '#00D4FF';
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(linesState.startX, linesState.startY);
  ctx.lineTo(x, y);
  ctx.stroke();

  const pathX = 100 + Math.sin(y * 0.05) * 40;
  const distance = Math.abs(x - pathX);

  if (distance < 30) {
    linesState.correctPoints++;
  }
}

function stopDrawing(canvas, ctx) {
  if (!linesState.isDrawing) return;
  linesState.isDrawing = false;

  const pct = linesState.correctPoints / linesState.totalPoints;

  if (pct > 0.7) {
    soundUtils.playCorrect();
    const stars = pct >= 0.9 ? 3 : pct >= 0.8 ? 2 : 1;
    gameManager.showWinModal('¡Seguiste bien el camino!', stars);
  } else {
    soundUtils.playWrong();
    drawLinesPath(ctx);
    linesState.correctPoints = 0;
    const errorEl = document.getElementById('linesError');
    if (errorEl) errorEl.textContent = 'Intenta seguir más cerca la línea punteada.';
  }
}
