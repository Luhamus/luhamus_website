// Fetch navbar
fetch('/nav.html')
  .then(r => r.text())
  .then(html => {
    document.getElementById('nav').innerHTML = html;

    // Mark the current page link as active
    const current = window.location.pathname;
    document.querySelectorAll('nav a').forEach(a => {
      if (a.getAttribute('href') === current) {
        a.classList.add('active');
      }
    })
  })

// Fetch footer
document.getElementById('footer').innerHTML = '© 2026 Luhamus';



// Handwriting title

const title = document.querySelector('.handwrite');
const hint = document.querySelector('.click-hint');

function replayTitle() {
  title.innerHTML = '<a href="gif/" class="handwrite" target="_blank">For cool GIF, click me!</a>';
  title.classList.remove('handwrite')
  void title.offsetWidth
  title.classList.add('handwrite')
  if (hint) hint.style.display = 'none'
}

if (title) title.addEventListener('click', replayTitle)
if (hint) hint.addEventListener('click', replayTitle)



/*

clock and terminal 

*/




// ── Clock ──
function drawClock() {
  const canvas = document.getElementById('clock');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const cx = 90, cy = 90, r = 85;
  const now = new Date();
  const hr = now.getHours() % 12 + now.getMinutes() / 60;
  const min = now.getMinutes() + now.getSeconds() / 60;
  const sec = now.getSeconds() + now.getMilliseconds() / 1000;

  ctx.clearRect(0, 0, 180, 180);

  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = '#1a1a1a';
  ctx.fill();

  const secAngle = (sec / 60) * Math.PI * 2 - Math.PI / 2;
  ctx.beginPath();
  ctx.arc(cx, cy, r - 4, -Math.PI / 2, secAngle);
  ctx.strokeStyle = '#a8c5a0';
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, r - 10, 0, Math.PI * 2);
  ctx.fillStyle = '#111';
  ctx.fill();

  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
    const isMain = i % 3 === 0;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * (r - 18), cy + Math.sin(a) * (r - 18));
    ctx.lineTo(cx + Math.cos(a) * (r - 12), cy + Math.sin(a) * (r - 12));
    ctx.strokeStyle = isMain ? '#a8c5a0' : '#444';
    ctx.lineWidth = isMain ? 2 : 1;
    ctx.stroke();
  }

  ctx.fillStyle = '#a8c5a0';
  ctx.font = '500 13px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  ctx.fillText(h + ':' + m, cx, cy + 28);

  function hand(angle, length, width, color, glow) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(angle) * length, cy + Math.sin(angle) * length);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    if (glow) { ctx.shadowColor = color; ctx.shadowBlur = 8; }
    ctx.stroke();
    ctx.restore();
  }

  hand((hr / 12) * Math.PI * 2 - Math.PI / 2, 45, 5, '#fff');
  hand((min / 60) * Math.PI * 2 - Math.PI / 2, 60, 3, '#ccc');
  hand((sec / 60) * Math.PI * 2 - Math.PI / 2, 68, 1.5, '#a8c5a0', true);

  ctx.beginPath();
  ctx.arc(cx, cy, 4, 0, Math.PI * 2);
  ctx.fillStyle = '#a8c5a0';
  ctx.fill();
}

setInterval(drawClock, 50);
drawClock();

// ── Terminal ──
const sequences = [
  { cmd: 'whoami', out: ['rasmus'] },
//  { cmd: 'uptime', out: ['up 4 days, 2 hours, 37 mins'] },
  { cmd: 'cat interests.txt', out: ['linux / devops / selfhosting'] },
//  { cmd: 'ls projects/', out: ['website/   dotfiles/   homelab/'] },
  { cmd: 'echo $MOOD', out: ['chill'] },
];

let seqIdx = 0, charIdx = 0, phase = 'typing', lineIdx = 0, wait = 0;
const cmdEl = document.getElementById('t-cmd');
const outEl = document.getElementById('t-output');

function termTick() {
  if (!cmdEl) return;
  const seq = sequences[seqIdx];
  if (phase === 'typing') {
    if (charIdx <= seq.cmd.length) {
      cmdEl.textContent = seq.cmd.slice(0, charIdx);
      charIdx++;
    } else { phase = 'showing'; lineIdx = 0; }
  } else if (phase === 'showing') {
    if (lineIdx < seq.out.length) {
      const p = document.createElement('p');
      p.className = 't-line t-out';
      p.textContent = seq.out[lineIdx];
      outEl.appendChild(p);
      lineIdx++;
    } else { phase = 'waiting'; wait = 0; }
  } else if (phase === 'waiting') {
    wait++;
    if (wait > 18) {
      cmdEl.textContent = '';
      outEl.innerHTML = '';
      charIdx = 0; lineIdx = 0;
      seqIdx = (seqIdx + 1) % sequences.length;
      phase = 'typing';
    }
  }
}

setInterval(termTick, 120);
