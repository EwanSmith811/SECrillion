// Answer effects: the krill's dive and the One in a SECrillion celebration.
import { krillURL, spriteURL } from './sprites.js';

const layer = () => document.getElementById('fx');

// The krill dives further and for longer the rarer the answer:
// a plankton answer is a quick dip, a One in a SECrillion is a long plunge with a flip.
export function diveKrill(krill, points, { reduced = false, flip = false } = {}) {
  const k = Math.max(0, Math.min(1, points / 100));
  const room = Math.max(40, innerHeight - krill.getBoundingClientRect().bottom - 24);
  const depth = Math.min(room, 14 + 230 * k);
  const ms = (600 + 2600 * k) * (reduced ? 0.5 : 1);
  const tilt = 10 + 22 * k;
  krill.getAnimations().filter((a) => a.id === 'dive').forEach((a) => a.cancel());
  const frames = flip && !reduced
    ? [
        { transform: 'translateY(0) rotate(0deg) scale(1)' },
        { transform: `translateY(${depth * 0.5}px) rotate(360deg) scale(1.5)`, offset: 0.3 },
        { transform: `translateY(${depth}px) rotate(720deg) scale(1.2)`, offset: 0.6 },
        { transform: `translateY(${depth * 0.8}px) rotate(720deg) scale(1)`, offset: 0.8 },
        { transform: 'translateY(0) rotate(720deg) scale(1)' },
      ]
    : [
        { transform: 'translateY(0) rotate(0deg)' },
        { transform: `translateY(${depth}px) rotate(${tilt}deg)`, offset: 0.45 },
        { transform: `translateY(${depth * 0.85}px) rotate(${tilt / 2}deg)`, offset: 0.7 },
        { transform: 'translateY(0) rotate(0deg)' },
      ];
  krill.animate(frames, { duration: ms, easing: 'cubic-bezier(.3,0,.3,1)' }).id = 'dive';
  return ms;
}

const COLORS = ['#ffb547', '#ffd27a', '#ff5c84', '#5ad1e6', '#ffffff', '#a08cff'];

export function celebrate({ skin = 'classic', reduced = false } = {}) {
  const fx = layer();
  if (!fx) return;

  const banner = document.createElement('div');
  banner.className = 'secrillion-banner';
  banner.innerHTML = `
    <img src="${krillURL(skin, 5)}" alt="">
    <div class="sb-kicker">YOU FOUND A</div>
    <div class="sb-title" data-text="ONE IN A SECRILLION">ONE IN A SECRILLION</div>
    <div class="sb-sub">Nobody dives this deep.</div>`;
  fx.appendChild(banner);
  setTimeout(() => banner.classList.add('out'), reduced ? 2200 : 2600);
  setTimeout(() => banner.remove(), 3400);
  if (reduced) return;

  const flash = document.createElement('div');
  flash.className = 'sb-flash';
  fx.appendChild(flash);
  flash.addEventListener('animationend', () => flash.remove());

  document.body.classList.remove('quake');
  void document.body.offsetWidth;
  document.body.classList.add('quake');
  setTimeout(() => document.body.classList.remove('quake'), 700);

  // Pixel confetti and tiny krill bursting from the middle of the screen.
  const cx = innerWidth / 2, cy = innerHeight * 0.42;
  const tiny = [krillURL(skin, 2), spriteURL('trench', 3), spriteURL('trench', 2)];
  for (let i = 0; i < 90; i++) {
    const isKrill = i % 9 === 0;
    const el = document.createElement(isKrill ? 'img' : 'span');
    el.className = isKrill ? 'sb-krill' : 'sb-bit';
    if (isKrill) el.src = tiny[i % tiny.length];
    else {
      const size = 4 + Math.round(Math.random() * 3) * 2;
      el.style.width = el.style.height = `${size}px`;
      el.style.background = COLORS[i % COLORS.length];
    }
    el.style.left = `${cx}px`;
    el.style.top = `${cy}px`;
    fx.appendChild(el);
    const angle = Math.random() * Math.PI * 2;
    const speed = 160 + Math.random() * Math.min(innerWidth, 900) * 0.45;
    const dx = Math.cos(angle) * speed, dy = Math.sin(angle) * speed * 0.7;
    const fall = 220 + Math.random() * 260;
    const spin = (Math.random() - 0.5) * 900;
    const dur = 1600 + Math.random() * 1200;
    el.animate([
      { transform: 'translate(-50%,-50%) scale(0.4) rotate(0deg)', opacity: 1 },
      { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(1) rotate(${spin / 2}deg)`, opacity: 1, offset: 0.35 },
      { transform: `translate(calc(-50% + ${dx * 1.25}px), calc(-50% + ${dy + fall}px)) scale(0.9) rotate(${spin}deg)`, opacity: 0 },
    ], { duration: dur, easing: 'cubic-bezier(.15,.7,.4,1)', delay: Math.random() * 180 }).onfinish = () => el.remove();
  }
}
