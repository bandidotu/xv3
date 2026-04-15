/* ================================
   XV AÑOS – XIMENA  |  script.js
   ================================ */

/* ---- SOBRE ---- */
(function initEnvelope() {
  const wrap    = document.getElementById('envelopeWrap');
  const flap    = document.getElementById('envFlap');
  const letter  = document.getElementById('envLetter');
  const seal    = document.getElementById('waxSeal');
  const hint    = document.getElementById('envHint');
  const screen  = document.getElementById('envelope-screen');
  const inv     = document.getElementById('invitation');

  let opened = false;

  function openEnvelope() {
    if (opened) return;
    opened = true;

    hint.classList.add('fade');

    // 1. Sello desaparece
    setTimeout(() => seal.classList.add('dissolve'), 100);

    // 2. Tapa se abre (flip hacia atrás)
    setTimeout(() => flap.classList.add('open'), 350);

    // 3. Carta sube
    setTimeout(() => letter.classList.add('rise'), 700);

    // 4. Pantalla cierra y muestra la invitación
    setTimeout(() => {
      screen.classList.add('closing');
      inv.classList.remove('hidden');
      document.body.style.overflow = '';
      setTimeout(() => {
        screen.style.display = 'none';
        // Disparar primera animación de entrada
        const first = document.querySelector('#invitation .reveal');
        if (first) first.classList.add('visible');
      }, 850);
    }, 1700);
  }

  wrap.addEventListener('click', openEnvelope);
  wrap.addEventListener('touchstart', openEnvelope, { passive: true });
  document.body.style.overflow = 'hidden';
})();


/* ---- SCROLL REVEAL ---- */
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      if (el.classList.contains('tl-item')) {
        const items = Array.from(document.querySelectorAll('.tl-item'));
        const delay = items.indexOf(el) * 140;
        setTimeout(() => el.classList.add('visible'), delay);
      } else {
        el.classList.add('visible');
      }
      observer.unobserve(el);
    });
  }, { threshold: 0.14 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  document.querySelectorAll('.tl-item').forEach(el => observer.observe(el));
}


/* ---- COUNTDOWN ---- */
function initCountdown() {
  const target = new Date('2026-03-14T18:00:00');
  const cdEl   = document.getElementById('countdown');
  const msgEl  = document.getElementById('granDia');

  function pad(n) { return String(n).padStart(2, '0'); }

  function tick() {
    const diff = target - Date.now();

    if (diff <= 0) {
      cdEl.style.display = 'none';
      msgEl.classList.remove('hidden');
      return;
    }

    const days  = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins  = Math.floor((diff % 3600000) / 60000);
    const secs  = Math.floor((diff % 60000) / 1000);

    document.getElementById('cd-days').textContent  = pad(days);
    document.getElementById('cd-hours').textContent = pad(hours);
    document.getElementById('cd-mins').textContent  = pad(mins);
    document.getElementById('cd-secs').textContent  = pad(secs);
  }

  tick();
  setInterval(tick, 1000);
}


/* ---- CALENDARIO ---- */
function buildCalendar() {
  const special     = 14;
  const year        = 2026;
  const month       = 2;   // 0-indexed → Marzo
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  let firstDay = new Date(year, month, 1).getDay();
  firstDay = firstDay === 0 ? 6 : firstDay - 1; // Lunes primero

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  let html = '';
  for (let r = 0; r < cells.length / 7; r++) {
    html += '<tr>';
    for (let c = 0; c < 7; c++) {
      const v = cells[r * 7 + c];
      if (!v) { html += '<td></td>'; continue; }
      const cls = v === special ? ' class="today"' : '';
      html += `<td${cls}>${v}</td>`;
    }
    html += '</tr>';
  }
  document.getElementById('cal-body').innerHTML = html;
}


/* ---- REPRODUCTOR ---- */
let playing = false;

function togglePlay() {
  const btn   = document.querySelector('.ctrl-btn');
  const audio = document.getElementById('audio');
  const fill  = document.getElementById('fill');

  if (audio.src && audio.src !== window.location.href) {
    if (playing) { audio.pause(); btn.textContent = '▶'; }
    else         { audio.play().catch(() => {}); btn.textContent = '⏸'; }
    playing = !playing;
  } else {
    playing = !playing;
    btn.textContent = playing ? '⏸' : '▶';
    if (playing) {
      fill.style.transition = 'width 30s linear';
      fill.style.width = '100%';
    } else {
      fill.style.transition = 'none';
      fill.style.width = '0%';
    }
  }
}

document.getElementById('audio').addEventListener('timeupdate', function () {
  if (this.duration) {
    document.getElementById('fill').style.width =
      ((this.currentTime / this.duration) * 100) + '%';
  }
});


/* ---- PARALLAX PÉTALOS ---- */
window.addEventListener('scroll', () => {
  const sy = window.scrollY;
  document.querySelectorAll('.petal').forEach((p, i) => {
    p.style.transform = `translateY(${sy * (0.08 + i * 0.04)}px)`;
  });
}, { passive: true });


/* ---- INIT ---- */
document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initCountdown();
  buildCalendar();
});
