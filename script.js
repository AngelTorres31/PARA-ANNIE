/* =====================================================
   Regalo de cumpleaños para Annie 🎁
   ----------------------------------------------------
   Para cambiar la fecha o el nombre, edita CONFIG.
   ===================================================== */

const CONFIG = {
  year: 2026,
  month: 10,      // 1 = enero ... 10 = octubre
  day: 28,
  hour: 0,
  minute: 0       // 00:00 => medianoche, según la hora del dispositivo
};

(() => {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const CATS = Array.from({ length: 17 }, (_, i) => `img/cat${i + 1}.png`);
  const EXTRAS = ['img/paw1.png', 'img/paw2.png', 'img/yarn.png', 'img/fish.png'];
  const IMG_PAW = 'img/paw1.png';
  [...CATS, ...EXTRAS].forEach((src) => { const im = new Image(); im.src = src; });

  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const randomSprite = (catChance = 0.8) => pick(Math.random() < catChance ? CATS : EXTRAS);

  const intro = $('intro');
  const gift = $('gift');
  const scene = $('scene');
  const floaters = $('floaters');
  const confetti = $('confetti');
  const note = $('note');
  const card = $('card');
  const fx = $('fx');

  /* ---------- Stickers de gatitos ---------- */
  function makeSticker(src, size) {
    const el = document.createElement('div');
    el.className = 'sticker';
    el.style.setProperty('--sz', size + 'px');
    const img = document.createElement('img');
    img.src = src;
    img.alt = '';
    el.appendChild(img);
    return el;
  }

  // gatitos que suben flotando como globos
  function rise() {
    const vw = innerWidth, vh = innerHeight;
    const sz = rand(46, 86);
    const el = makeSticker(randomSprite(), sz);
    const x = rand(-8, vw - sz + 8);
    const sway = rand(18, 55) * (Math.random() < 0.5 ? -1 : 1);
    const r = rand(6, 20);
    floaters.appendChild(el);
    const anim = el.animate([
      { transform: `translate(${x}px, ${vh + 20}px) rotate(${-r}deg) scale(.6)`, opacity: 0 },
      { transform: `translate(${x + sway}px, ${vh * 0.78}px) rotate(${r}deg) scale(1)`, opacity: 1, offset: 0.08 },
      { transform: `translate(${x - sway}px, ${vh * 0.52}px) rotate(${-r}deg) scale(1)`, offset: 0.4 },
      { transform: `translate(${x + sway}px, ${vh * 0.27}px) rotate(${r}deg) scale(1)`, offset: 0.7 },
      { transform: `translate(${x}px, ${-sz - 20}px) rotate(${-r}deg) scale(.95)`, opacity: 1 }
    ], { duration: rand(9000, 15000), easing: 'linear', fill: 'forwards' });
    anim.onfinish = () => el.remove();
  }

  // busca un lugar libre que no tape la nota / cartulina
  function freeSpot(sz) {
    const vw = innerWidth, vh = innerHeight;
    const target = !note.hidden ? note : (!card.hidden ? card : null);
    const r = target ? target.getBoundingClientRect() : null;
    for (let i = 0; i < 14; i++) {
      const x = rand(6, vw - sz - 6), y = rand(6, vh - sz - 6);
      if (!r || x + sz < r.left - 6 || x > r.right + 6 || y + sz < r.top - 6 || y > r.bottom + 6) return { x, y };
    }
    return null;
  }

  // gatitos que aparecen de golpe, se mueven y desaparecen
  function popIn() {
    const sz = rand(54, 90);
    const spot = freeSpot(sz);
    if (!spot) return;
    const { x, y } = spot;
    const el = makeSticker(randomSprite(0.85), sz);
    floaters.appendChild(el);
    const T = (s, r) => `translate(${x}px, ${y}px) scale(${s}) rotate(${r}deg)`;
    const anim = el.animate([
      { transform: T(0, -30), opacity: 0 },
      { transform: T(1.2, 8), opacity: 1, offset: 0.16 },
      { transform: T(1, -7), offset: 0.28 },
      { transform: T(1, 7), offset: 0.46 },
      { transform: T(1, -5), offset: 0.64 },
      { transform: T(1, 0), opacity: 1, offset: 0.84 },
      { transform: T(0, 30), opacity: 0 }
    ], { duration: rand(2800, 3800), easing: 'ease-in-out', fill: 'forwards' });
    anim.onfinish = () => el.remove();
  }

  // gatitos que se asoman por los costados
  function peek() {
    const vw = innerWidth, vh = innerHeight;
    const sz = rand(60, 88);
    const left = Math.random() < 0.5;
    const y = rand(vh * 0.08, vh * 0.85);
    const hide = left ? -sz - 4 : vw + 4;
    const show = left ? -sz * 0.3 : vw - sz * 0.7;
    const tilt = left ? 1 : -1;
    const el = makeSticker(randomSprite(0.9), sz);
    floaters.appendChild(el);
    const T = (px, r) => `translate(${px}px, ${y}px) rotate(${r}deg)`;
    const anim = el.animate([
      { transform: T(hide, 25 * tilt) },
      { transform: T(show, 0), offset: 0.2 },
      { transform: T(show, -10 * tilt), offset: 0.38 },
      { transform: T(show, 10 * tilt), offset: 0.56 },
      { transform: T(show, -6 * tilt), offset: 0.72 },
      { transform: T(show, 0), offset: 0.8 },
      { transform: T(hide, 25 * tilt) }
    ], { duration: 3600, easing: 'ease-in-out', fill: 'forwards' });
    anim.onfinish = () => el.remove();
  }

  // explosión de gatitos desde un punto
  function burstAt(container, x, y, n, dist = 160, life = 1100) {
    for (let i = 0; i < n; i++) {
      const sz = rand(40, 72);
      const el = makeSticker(randomSprite(0.85), sz);
      container.appendChild(el);
      const ang = (Math.PI * 2 * i) / n + rand(-0.3, 0.3);
      const d = rand(dist * 0.55, dist);
      const rot = rand(-50, 50);
      const x0 = x - sz / 2, y0 = y - sz / 2;
      const anim = el.animate([
        { transform: `translate(${x0}px, ${y0}px) scale(.2) rotate(0deg)`, opacity: 0 },
        { transform: `translate(${x0 + Math.cos(ang) * d * 0.7}px, ${y0 + Math.sin(ang) * d * 0.7}px) scale(1.1) rotate(${rot * 0.6}deg)`, opacity: 1, offset: 0.35 },
        { transform: `translate(${x0 + Math.cos(ang) * d}px, ${y0 + Math.sin(ang) * d + 30}px) scale(.9) rotate(${rot}deg)`, opacity: 0 }
      ], { duration: life, easing: 'cubic-bezier(.2,.8,.3,1)', fill: 'forwards' });
      anim.onfinish = () => el.remove();
    }
  }


  /* ---------- Efecto al hacer clic / tocar (celular y computadora) ---------- */
  function clickFx(x, y) {
    // anillo
    const ring = document.createElement('div');
    ring.className = 'ring';
    fx.appendChild(ring);
    const a = ring.animate([
      { transform: `translate(${x}px, ${y}px) scale(.2)`, opacity: 1 },
      { transform: `translate(${x}px, ${y}px) scale(1.9)`, opacity: 0 }
    ], { duration: 550, easing: 'ease-out', fill: 'forwards' });
    a.onfinish = () => ring.remove();
    // gatitos
    if (!reduceMotion) burstAt(fx, x, y, 6, 120, 900);
  }
  // pointerdown cubre mouse, dedo y lápiz; el capture evita que algún elemento lo bloquee
  document.addEventListener('pointerdown', (e) => {
    clickFx(e.clientX, e.clientY);
  }, true);

  // huellitas que siguen al mouse (solo computadora)
  let lastTrail = 0, trailFlip = false;
  document.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse' || reduceMotion) return;
    const now = performance.now();
    if (now - lastTrail < 70) return;
    lastTrail = now;
    trailFlip = !trailFlip;
    const img = document.createElement('img');
    img.className = 'trail';
    img.src = IMG_PAW;
    img.alt = '';
    fx.appendChild(img);
    const dx = trailFlip ? -8 : 8;
    const an = img.animate([
      { transform: `translate(${e.clientX - 13 + dx}px, ${e.clientY - 13}px) rotate(${trailFlip ? -20 : 20}deg) scale(.6)`, opacity: .9 },
      { transform: `translate(${e.clientX - 13 + dx}px, ${e.clientY - 13 - 14}px) rotate(${trailFlip ? -20 : 20}deg) scale(1)`, opacity: 0 }
    ], { duration: 800, easing: 'ease-out', fill: 'forwards' });
    an.onfinish = () => img.remove();
  }, { passive: true });

  /* ---------- Confeti ---------- */
  const CONFETTI_COLORS = ['#ff8fb8', '#ffc2d9', '#ffffff', '#222222', '#ffd54f', '#e8588f'];
  function confettiPiece() {
    const vw = innerWidth, vh = innerHeight;
    const el = document.createElement('i');
    el.className = 'piece';
    const w = rand(7, 13), h = Math.random() < 0.5 ? w : rand(12, 20);
    el.style.width = w + 'px';
    el.style.height = h + 'px';
    el.style.background = pick(CONFETTI_COLORS);
    el.style.borderRadius = Math.random() < 0.35 ? '50%' : '2px';
    if (el.style.background === 'rgb(255, 255, 255)') el.style.boxShadow = '0 0 0 1px #e8588f';
    confetti.appendChild(el);
    const x = rand(0, vw), drift = rand(-90, 90), rot = rand(360, 1080) * (Math.random() < 0.5 ? -1 : 1);
    const anim = el.animate([
      { transform: `translate(${x}px, -30px) rotate(0deg)`, opacity: 1 },
      { transform: `translate(${x + drift}px, ${vh + 30}px) rotate(${rot}deg)`, opacity: 1 }
    ], { duration: rand(3200, 6500), easing: 'cubic-bezier(.3,.1,.6,1)', fill: 'forwards' });
    anim.onfinish = () => el.remove();
  }
  function confettiBurst(n) { for (let i = 0; i < n; i++) setTimeout(confettiPiece, rand(0, 900)); }

  /* ---------- Cuenta regresiva ---------- */
  const el = { d: $('d'), h: $('h'), m: $('m'), s: $('s'), dl: $('dl'), hl: $('hl'), ml: $('ml'), sl: $('sl') };
  const pad = (n) => String(n).padStart(2, '0');
  const plural = (n, one, many) => (n === 1 ? one : many);

  function setVal(node, value) {
    if (node.textContent === value) return;
    node.textContent = value;
    node.classList.remove('tick');
    void node.offsetWidth;           // reinicia la animación
    node.classList.add('tick');
  }

  const MESES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  $('ndate').textContent = '♡ ' + CONFIG.day + ' de ' + MESES[CONFIG.month - 1] + ' ♡';
  let target = null;
  let timer = null;
  let finished = false;

  function update() {
    if (finished || !target) return;
    const ms = target - Date.now();
    if (ms <= 0) { finish(); return; }
    const t = Math.floor(ms / 1000);
    const d = Math.floor(t / 86400);
    const h = Math.floor((t % 86400) / 3600);
    const m = Math.floor((t % 3600) / 60);
    const s = t % 60;
    setVal(el.d, pad(d));  setVal(el.h, pad(h));
    setVal(el.m, pad(m));  setVal(el.s, pad(s));
    el.dl.textContent = plural(d, 'día', 'días');
    el.hl.textContent = plural(h, 'hora', 'horas');
    el.ml.textContent = plural(m, 'minuto', 'minutos');
    el.sl.textContent = plural(s, 'segundo', 'segundos');
  }

  function finish() {
    if (finished) return;
    finished = true;
    clearInterval(timer);
    if (!note.hidden) {
      note.classList.remove('show');
      note.classList.add('leave');
      setTimeout(() => { note.hidden = true; showCard(); }, 720);
    } else {
      showCard();
    }
  }

  /* ---------- Cartulina ---------- */
  function buildFlags() {
    const g = $('flags');
    if (g.childNodes.length) return;
    const colors = ['#ff8fb8', '#ffffff', '#222222', '#ffd54f', '#e8588f', '#ffc2d9'];
    const n = 11;
    for (let i = 0; i < n; i++) {
      const t = (i + 0.5) / n;
      const x = 400 * t, y = 6 + 100 * t * (1 - t);
      const p = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      p.setAttribute('points', `${x - 15},${y} ${x + 15},${y} ${x},${y + 34}`);
      p.setAttribute('fill', colors[i % colors.length]);
      p.setAttribute('stroke', '#222');
      p.setAttribute('stroke-width', '1.5');
      p.setAttribute('stroke-linejoin', 'round');
      g.appendChild(p);
    }
  }

  let cardShown = false;
  function showCard() {
    if (cardShown) return;
    cardShown = true;
    buildFlags();
    card.hidden = false;
    card.classList.add('show');
    setTimeout(() => {
      confettiBurst(140);
      burstAt(floaters, innerWidth / 2, innerHeight / 2, 12, Math.min(innerWidth, 420) * 0.8, 1500);
    }, 650);
    setInterval(() => { for (let i = 0; i < 3; i++) confettiPiece(); }, 500);
  }

  /* ---------- Escena ---------- */
  let sceneStarted = false;
  function startScene() {
    if (sceneStarted) return;
    sceneStarted = true;

    if (!reduceMotion) {
      for (let i = 0; i < 4; i++) setTimeout(rise, i * 350);
      setTimeout(popIn, 700);
      setInterval(rise, 1500);
      setInterval(popIn, 1700);
      setInterval(peek, 5200);
      setTimeout(peek, 2200);
    }

    // objetivo de la cuenta regresiva
    target = new Date(CONFIG.year, CONFIG.month - 1, CONFIG.day, CONFIG.hour, CONFIG.minute, 0, 0);

    if (target - Date.now() <= 0) {
      finished = true;
      showCard();
    } else {
      note.hidden = false;
      update();
      note.classList.add('show');
      timer = setInterval(update, 250);
      document.addEventListener('visibilitychange', update);
    }
  }

  /* ---------- Abrir el regalo ---------- */
  let opened = false;
  function openGift() {
    if (opened) return;
    opened = true;
    intro.classList.add('opening');

    // gatitos que salen disparados del regalo
    setTimeout(() => {
      const r = gift.getBoundingClientRect();
      burstAt($('burst'), r.left + r.width / 2, r.top + r.height * 0.4, 12, Math.min(innerWidth, 520) * 0.62, 1300);
    }, 480);

    // se revela el fondo de gatitos
    setTimeout(() => {
      startScene();
      intro.classList.add('gone');
    }, 1650);
    setTimeout(() => intro.remove(), 2600);
  }

  gift.addEventListener('click', openGift);

})();
