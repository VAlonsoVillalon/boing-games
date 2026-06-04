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

  // Adjust canvas size
  canvas.width = canvas.offsetWidth;
  canvas.height = 400;

  linesState = {
    isDrawing: false,
    startX: 50,
    startY: 50,
    correctPoints: 0,
    totalPoints: 50
  };

  // Draw path
  drawLinesPath(ctx);

  // Mouse events
  canvas.addEventListener('mousedown', (e) => startDrawing(e, canvas, ctx));
  canvas.addEventListener('mousemove', (e) => drawLine(e, canvas, ctx));
  canvas.addEventListener('mouseup', () => stopDrawing(canvas, ctx));
  canvas.addEventListener('touchstart', (e) => startDrawing(e, canvas, ctx));
  canvas.addEventListener('touchmove', (e) => drawLine(e, canvas, ctx));
  canvas.addEventListener('touchend', () => stopDrawing(canvas, ctx));
}

function drawLinesPath(ctx) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Draw background
  ctx.fillStyle = '#f9f9f9';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Draw the path to follow (wavy line)
  ctx.strokeStyle = '#ccc';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(50, 50);

  for (let i = 50; i < 350; i += 10) {
    const x = 100 + Math.sin(i * 0.05) * 40;
    const y = i;
    ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Draw start circle
  ctx.fillStyle = '#00D4FF';
  ctx.beginPath();
  ctx.arc(50, 50, 15, 0, Math.PI * 2);
  ctx.fill();

  // Draw end circle
  ctx.fillStyle = '#FF6B9D';
  ctx.beginPath();
  ctx.arc(100, 360, 15, 0, Math.PI * 2);
  ctx.fill();

  // Draw labels
  ctx.fillStyle = '#2c2c2a';
  ctx.font = '12px system-ui';
  ctx.fillText('Inicio', 25, 80);
  ctx.fillText('Fin', 75, 380);
}

function startDrawing(e, canvas, ctx) {
  const rect = canvas.getBoundingClientRect();
  const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
  const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;

  // Check if starting from the start circle
  const distance = Math.sqrt((x - 50) ** 2 + (y - 50) ** 2);
  if (distance <= 20) {
    linesState.isDrawing = true;
    linesState.startX = x;
    linesState.startY = y;
  }
}

function drawLine(e, canvas, ctx) {
  if (!linesState.isDrawing) return;

  const rect = canvas.getBoundingClientRect();
  const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
  const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;

  // Redraw path
  drawLinesPath(ctx);

  // Draw user line
  ctx.strokeStyle = '#00D4FF';
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(linesState.startX, linesState.startY);
  ctx.lineTo(x, y);
  ctx.stroke();

  // Check if close to path
  const pathX = 100 + Math.sin(y * 0.05) * 40;
  const distance = Math.abs(x - pathX);

  if (distance < 30) {
    linesState.correctPoints++;
  }
}

function stopDrawing(canvas, ctx) {
  if (!linesState.isDrawing) return;
  linesState.isDrawing = false;

  // Check if reached the end
  if (linesState.correctPoints > linesState.totalPoints * 0.7) {
    gameManager.showWinModal('¡Seguiste bien el camino! ✏️');
  } else {
    drawLinesPath(ctx);
    alert('Intenta seguir más cerca la línea punteada.');
    linesState.correctPoints = 0;
  }
}
