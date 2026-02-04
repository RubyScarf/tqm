// ====== CONFIG ======
const totalNodes = 20;
const startTime = new Date(Date.UTC(2026, 1, 3, 15, 0, 0));
const unlockInterval = 2 * 60 * 60 * 1000; // 2 hours in ms

// Placeholder links for chapter pages
const chapterLinks = Array.from({length: totalNodes}, (_, i) => `chapters/chapter${i+1}.html`);

// ====== Countdown Timer ======
const countdownEl = document.getElementById("countdown");

function updateCountdown() {
  const now = new Date();
  const elapsed = now - startTime;
  
  // How many nodes have unlocked
  let unlockedCount = Math.floor(elapsed / unlockInterval);
  
  // Next unlock time
  const nextUnlockTime = startTime.getTime() + (unlockedCount + 1) * unlockInterval;
  let distance = nextUnlockTime - now.getTime();

  if (distance <= 0) {
    countdownEl.textContent = "Next drop unlocking now! ✨";
    return;
  }

  const hours = Math.floor(distance / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  countdownEl.textContent = `Next drop in: ${hours}h ${minutes}m ${seconds}s`;
}

// Update every second
setInterval(updateCountdown, 1000);
updateCountdown(); // initial call

// ====== Create Nodes ======
const pathContainer = document.getElementById('pathContainer');
for (let i = 0; i < totalNodes; i++) {
  const node = document.createElement('div');
  node.classList.add('node', 'locked');
  node.dataset.index = i;
  node.innerHTML = `<span>${i+1}</span>`;
  node.addEventListener('click', () => openNode(i));
  pathContainer.appendChild(node);
}

// ====== Unlock Logic ======
function updateNodes() {
  const now = new Date();
  let elapsed = now - startTime;
  let unlockedCount = Math.floor(elapsed / unlockInterval) + 1;
  if (unlockedCount > totalNodes) unlockedCount = totalNodes;

  const nodes = document.querySelectorAll('.node');
  nodes.forEach((n, idx) => {
    if (idx < unlockedCount) {
      n.classList.remove('locked');
      n.classList.add('unlocked');
    } else {
      n.classList.remove('unlocked');
      n.classList.add('locked');
    }
  });
}

// ====== Open Node ======
function openNode(index) {
  const node = document.querySelector(`.node[data-index='${index}']`);
  if (!node.classList.contains('unlocked')) {
    alert("This moment hasn't arrived yet ✨");
    return;
  }
  // open new page
  window.location.href = chapterLinks[index];
}

// ====== Stars Animation ======
const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');
let stars = [];

function initStars() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  updateMoon(); // recalc moon every resize

  stars = [];
  for (let i = 0; i < 150; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5,
      dx: (Math.random() - 0.5) * 0.2,
      dy: (Math.random() - 0.5) * 0.2
    });
  }
}

window.addEventListener('resize', initStars);


// ====== Waning Crescent Moon (responsive) ======
let moon = {
  xRatio: 0.8,  // % of width
  yRatio: 0.2,  // % of height
  rRatio: 0.06, // % of width for radius
  x: 0,
  y: 0,
  r: 0
};

function updateMoon() {
  moon.x = canvas.width * moon.xRatio;
  moon.y = canvas.height * moon.yRatio;
  moon.r = canvas.width * moon.rRatio; // adjust size relative to width
}

function drawMoon() {
  // Full moon base
  ctx.beginPath();
  ctx.arc(moon.x, moon.y, moon.r, 0, Math.PI * 2);
  ctx.fillStyle = "#f5f3ce"; // pale yellow
  ctx.fill();

  // Northern hemisphere waning crescent (light mostly on bottom)
  ctx.save();
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc(moon.x - moon.r * 0.3, moon.y - moon.r * 0.2, moon.r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawStars() {
  ctx.clearRect(0,0,canvas.width,canvas.height);

  drawMoon(); // draw the crescent first

  ctx.fillStyle = "white";
  stars.forEach(s => {
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
    ctx.fill();
    s.x += s.dx;
    s.y += s.dy;
    if (s.x < 0) s.x = canvas.width;
    if (s.x > canvas.width) s.x = 0;
    if (s.y < 0) s.y = canvas.height;
    if (s.y > canvas.height) s.y = 0;
  });

  requestAnimationFrame(drawStars);
}

window.addEventListener('resize', initStars);
initStars();
drawStars();
updateNodes();
setInterval(updateNodes, 10000); // refresh every 10 sec

