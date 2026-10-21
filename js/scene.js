// The pixel-art world: sky, sun, clouds, boat, ocean, fish and the depth ruler.
import { drawSprite, spriteSize } from './sprites.js';

export const PX_PER_POINT = 6;     // ruler scale (world pixels per point) where no answer has set it
export const METERS_PER_POINT = 10;

// How far the camera falls for one answer, as a share of the screen height. It grows much faster
// than the points: a plankton (10) barely nudges the water, a One in a SECrillion (100) plunges ~1.8 screens.
const plungeScreens = (points) => 1.8 * (Math.max(0, points) / 100) ** 1.8;

// The water darkens gradually over the whole dive, from surface blue to near-black at a perfect score.
const OCEAN = [
  [0, [45, 95, 142]], [300, [39, 86, 131]], [900, [33, 74, 116]], [1800, [27, 62, 101]],
  [3200, [21, 49, 83]], [5200, [15, 37, 65]], [8000, [10, 26, 47]], [11500, [6, 16, 31]], [16000, [3, 8, 17]],
];
const OCEAN_SPAN = 16000;

// How fast the background lives: barely drifting while you're idle, picking up only while diving.
const IDLE_PACE = 0.12;
const DIVE_PACE = 1.6;
const DIVE_SPEED = 500; // camera px/s that counts as full diving speed

// Background sea life: each kind lives in a depth band (px below the surface) and drifts across.
const CRITTERS = {
  school: { band: [80, 2400], count: 3, speed: [30, 55], scale: 2 },
  turtle: { band: [150, 2600], count: 1, speed: [14, 22], scale: 3 },
  jelly:  { band: [500, 9000], count: 5, speed: [4, 10], scale: 3 },
  squid:  { band: [2200, 10000], count: 2, speed: [14, 26], scale: 3 },
  whale:  { band: [2800, 11000], count: 1, speed: [10, 16], scale: 5 },
  angler: { band: [6500, 30000], count: 3, speed: [5, 11], scale: 3 },
};
const rgb = ([r, g, b]) => `rgb(${r},${g},${b})`;
const rand = (a, b) => a + Math.random() * (b - a);

function cloudCanvas(w, h, q = 8) {
  const ells = [{ cx: w / 2, cy: h * 0.72, rx: w / 2, ry: h * 0.26 }];
  const bumps = 2 + Math.floor(Math.random() * 3);
  for (let i = 0; i < bumps; i++) {
    ells.push({ cx: rand(w * 0.22, w * 0.78), cy: rand(h * 0.42, h * 0.6), rx: rand(w * 0.12, w * 0.24), ry: rand(h * 0.26, h * 0.42) });
  }
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const ctx = c.getContext('2d');
  for (let y = 0; y < h; y += q) {
    for (let x = 0; x < w; x += q) {
      const px = x + q / 2, py = y + q / 2;
      if (!ells.some((e) => ((px - e.cx) / e.rx) ** 2 + ((py - e.cy) / e.ry) ** 2 <= 1)) continue;
      ctx.fillStyle = py > h * 0.8 ? '#d6e2ea' : py > h * 0.7 ? '#e9f0f4' : '#f7fafb';
      ctx.fillRect(x, y, q, q);
    }
  }
  return c;
}

function sunCanvas(r = 64, q = 10) {
  const c = document.createElement('canvas');
  c.width = c.height = r * 2;
  const ctx = c.getContext('2d');
  for (let y = 0; y < r * 2; y += q) {
    for (let x = 0; x < r * 2; x += q) {
      const d = Math.hypot(x + q / 2 - r, y + q / 2 - r);
      if (d > r) continue;
      ctx.fillStyle = d > r - q * 1.2 ? '#f6e3a6' : '#f1d27f';
      ctx.fillRect(x, y, q, q);
    }
  }
  return c;
}

// Boat drawn as grid rectangles [x, y, w, h] in boat-pixel units.
const BOAT = {
  hull: [[0, 17, 5, 2], [5, 18, 30, 1], [33, 16, 7, 3], [0, 19, 40, 1], [1, 20, 38, 1], [1, 21, 36, 1], [2, 22, 34, 1], [4, 23, 30, 1]],
  cabin: [[13, 12, 14, 6]],
  mast: [[19, 0, 2, 12]],
  windows: [[15, 14, 2, 2], [20, 14, 2, 2], [24, 14, 2, 2]],
  flag: [[14, 1, 5, 1], [11, 2, 8, 1], [10, 3, 9, 1], [12, 4, 7, 1], [15, 5, 4, 1]],
  flagShade: [[10, 3, 3, 1], [12, 4, 2, 1]],
};

export class Scene {
  constructor(canvas) {
    this.c = canvas;
    this.ctx = canvas.getContext('2d');
    this.cam = 0; this.camTarget = 0; this.vel = 0; this.pace = IDLE_PACE;
    this.marks = [{ d: 0, m: 0 }];   // depth below the surface (px) → meters, one mark per answer
    this.dim = 0; this.dimTarget = 0;
    this.t = 0;
    this.reduced = false;
    this.resize();
    addEventListener('resize', () => this.resize());
    this.last = performance.now();
    requestAnimationFrame(this.frame);
  }

  resize() {
    const dpr = Math.min(2, devicePixelRatio || 1);
    this.W = innerWidth; this.H = innerHeight;
    this.c.width = this.W * dpr; this.c.height = this.H * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.ctx.imageSmoothingEnabled = false;
    this.surface = Math.round(this.H * 0.63);
    this.sun = sunCanvas();
    this.clouds = Array.from({ length: Math.max(4, Math.round(this.W / 240)) }, () => {
      const w = Math.round(rand(150, 440) / 8) * 8, h = Math.round((w * rand(0.28, 0.4)) / 8) * 8;
      return { img: cloudCanvas(w, h), x: rand(-w, this.W), y: rand(-10, this.surface * 0.62), v: rand(3, 9), a: rand(0.8, 1) };
    });
    // Fish and drifting motes wrap around the camera, so there's always water life scrolling past.
    this.fish = Array.from({ length: 10 }, () => ({ x: rand(0, this.W), d: rand(60, this.H * 1.5), v: rand(8, 26) * (Math.random() < 0.5 ? -1 : 1), s: Math.random() < 0.3 ? 3 : 2 }));
    this.motes = Array.from({ length: Math.round(this.W * this.H / 4500) }, () => ({ x: rand(0, this.W), d: rand(10, this.H * 1.5), v: rand(2, 7), a: rand(0.15, 0.5), tw: rand(0, 6.28) }));
    this.critters = [];
    for (const [kind, k] of Object.entries(CRITTERS)) for (let i = 0; i < k.count; i++) this.critters.push(this.spawn({ kind }, true));
  }

  setMode(mode) {
    this.mode = mode;
    if (mode !== 'dive') { this.camTarget = 0; this.marks = [{ d: 0, m: 0 }]; }
    this.dimTarget = mode === 'results' ? 0.8 : 0;
  }

  // Start of a dive: the surface sits near the top of the screen.
  startDive() {
    this.marks = [{ d: 0, m: 0 }];
    this.camTarget = this.surface - this.H * 0.26;
    this.tween = null;
  }

  // One answer: the water scrolls down by an amount that grows steeply with its points,
  // easing over `ms` so it keeps pace with the krill's dive.
  plunge(points, ms = 0) {
    const last = this.marks[this.marks.length - 1];
    const d = last.d + Math.round(this.H * plungeScreens(points));
    this.marks.push({ d, m: last.m + points * METERS_PER_POINT });
    this.camTarget = this.surface - this.H * 0.26 + d;
    this.tween = ms > 0 ? { from: this.cam, to: this.camTarget, t0: performance.now(), ms } : null;
  }

  // Place a critter in its depth band, preferably near what the camera can see, entering from a side.
  spawn(c, anywhere = false) {
    const k = CRITTERS[c.kind];
    const top = this.cam - this.surface, near = [top - this.H * 0.5, top + this.H * 1.5];
    const lo = Math.max(k.band[0], near[0]), hi = Math.min(k.band[1], near[1]);
    c.d = lo < hi ? rand(lo, hi) : rand(k.band[0], k.band[1]);
    c.vx = rand(...k.speed) * (Math.random() < 0.5 ? -1 : 1);
    const w = spriteSize(c.kind === 'school' ? 'fish' : c.kind).w * k.scale + 120;
    c.x = anywhere ? rand(0, this.W) : c.vx > 0 ? -w : this.W + w;
    c.phase = rand(0, 6.28);
    return c;
  }

  drawCritters(sy, dt) {
    const { ctx, W, H } = this;
    const pace = this.reduced ? 0.3 : 1;
    for (const c of this.critters) {
      const k = CRITTERS[c.kind];
      c.x += c.vx * dt * pace;
      c.phase += dt * pace;
      const { w, h } = spriteSize(c.kind === 'school' ? 'fish' : c.kind);
      const pw = w * k.scale, ph = h * k.scale;
      const top = this.cam - this.surface;
      // Off the side, or left far behind by the camera: respawn somewhere the camera is heading.
      if (c.x < -pw - 160 || c.x > W + pw + 160 || c.d < top - H * 2 || c.d > top + H * 3) { this.spawn(c); continue; }
      let y = sy + c.d;
      if (y < sy + 30 || y > H + ph + 40 || y < -ph - 40) continue;
      const flip = c.vx > 0;
      if (c.kind === 'school') {
        // Seven small fish swimming in a loose formation.
        for (let i = 0; i < 7; i++) {
          const ox = (i % 4) * 18 * (flip ? -1 : 1) + (i > 3 ? 9 : 0), oy = Math.floor(i / 4) * 10 + Math.sin(c.phase * 3 + i) * 2;
          drawSprite(ctx, 'fish', Math.round(c.x + ox), Math.round(y + oy), k.scale, { flip, tint: 'rgba(150,195,225,0.45)' });
        }
      } else if (c.kind === 'jelly') {
        // Drifts up and down and pulses as it swims.
        y += Math.sin(c.phase * 0.8) * 14;
        const squash = 1 + Math.sin(c.phase * 3) * 0.12;
        ctx.save();
        ctx.globalAlpha = 0.5;
        ctx.translate(Math.round(c.x), Math.round(y));
        ctx.scale(1 / squash, squash);
        drawSprite(ctx, 'jelly', 0, 0, k.scale);
        ctx.restore();
      } else if (c.kind === 'whale') {
        ctx.globalAlpha = 0.55;
        drawSprite(ctx, 'whale', Math.round(c.x), Math.round(y + Math.sin(c.phase * 0.5) * 6), k.scale, { flip });
        ctx.globalAlpha = 1;
      } else if (c.kind === 'angler') {
        const lx = Math.round(c.x + (flip ? pw - 6 * k.scale : 6 * k.scale)), ly = Math.round(y);
        const glow = ctx.createRadialGradient(lx, ly, 1, lx, ly, 26);
        const a = 0.55 + Math.sin(c.phase * 4) * 0.2;
        glow.addColorStop(0, `rgba(190,255,230,${a})`); glow.addColorStop(1, 'rgba(190,255,230,0)');
        ctx.fillStyle = glow;
        ctx.fillRect(lx - 26, ly - 26, 52, 52);
        drawSprite(ctx, 'angler', Math.round(c.x), Math.round(y), k.scale, { flip });
        ctx.fillStyle = '#e8fff6';
        ctx.fillRect(lx - 2, ly - 2, 4, 4);
      } else {
        drawSprite(ctx, c.kind, Math.round(c.x), Math.round(y + Math.sin(c.phase) * 3), k.scale, { flip });
      }
    }
  }

  // Shafts of sunlight slanting down from the surface, fading with depth.
  drawRays(sy) {
    const { ctx, W, H, t } = this;
    if (sy < -H) return;
    const fade = Math.min(1, Math.max(0, 1 + sy / H));
    for (let i = 0; i < 6; i++) {
      const x = ((i + 0.5) / 6) * W + Math.sin(t * 0.25 + i * 1.7) * 40;
      const top = Math.max(0, sy + 8), len = H * 1.1;
      const g = ctx.createLinearGradient(0, top, 0, sy + len);
      g.addColorStop(0, `rgba(190,225,245,${0.07 * fade})`); g.addColorStop(1, 'rgba(190,225,245,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(x - 18, top); ctx.lineTo(x + 18, top);
      ctx.lineTo(x + 18 + len * 0.35, sy + len); ctx.lineTo(x - 18 + len * 0.15, sy + len);
      ctx.closePath(); ctx.fill();
    }
  }

  // Meters at a depth below the surface, following the answers' marks (linear beyond them).
  metersAt(d) {
    const marks = this.marks;
    for (let i = 1; i < marks.length; i++) {
      const a = marks[i - 1], b = marks[i];
      if (d <= b.d) return b.d === a.d ? b.m : a.m + ((d - a.d) / (b.d - a.d)) * (b.m - a.m);
    }
    const last = marks[marks.length - 1];
    return last.m + ((d - last.d) / PX_PER_POINT) * METERS_PER_POINT;
  }

  frame = (now) => {
    const dt = Math.min(0.05, (now - this.last) / 1000);
    this.last = now;
    const before = this.cam;
    if (this.tween && this.tween.to === this.camTarget) {
      const k = Math.min(1, (now - this.tween.t0) / this.tween.ms);
      this.cam = this.tween.from + (this.tween.to - this.tween.from) * (k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2);
      if (k >= 1) this.tween = null;
    } else this.cam += (this.camTarget - this.cam) * Math.min(1, dt * 1.8);
    this.vel = dt > 0 ? (this.cam - before) / dt : 0;
    this.dim += (this.dimTarget - this.dim) * Math.min(1, dt * 2.5);
    // Everything animated (waves, clouds, motes, fish, sea life) runs on paced time.
    const target = IDLE_PACE + (DIVE_PACE - IDLE_PACE) * Math.min(1, Math.abs(this.vel) / DIVE_SPEED);
    this.pace += (target - this.pace) * Math.min(1, dt * 3);
    const paced = dt * this.pace * (this.reduced ? 0.3 : 1);
    this.t += paced;
    this.draw(paced);
    requestAnimationFrame(this.frame);
  };

  draw(dt) {
    const { ctx, W, H, t } = this;
    const cam = Math.round(this.cam);
    const sy = this.surface - cam;

    if (sy > 0) {
      const g = ctx.createLinearGradient(0, -cam, 0, sy);
      g.addColorStop(0, '#86b9dc'); g.addColorStop(0.55, '#bad5e6'); g.addColorStop(1, '#e8f0f3');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, Math.min(H, sy + 20));

      const sx = W * 0.84, scy = 44 - cam;
      const glow = ctx.createRadialGradient(sx, scy, 10, sx, scy, 300);
      glow.addColorStop(0, 'rgba(255,232,160,0.6)'); glow.addColorStop(1, 'rgba(255,232,160,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(sx - 300, scy - 300, 600, 600);
      ctx.drawImage(this.sun, Math.round(sx - 64), Math.round(scy - 64));

      for (const c of this.clouds) {
        c.x += c.v * dt * (this.reduced ? 0.2 : 1);
        if (c.x > W + 20) c.x = -c.img.width - 20;
        ctx.globalAlpha = c.a;
        ctx.drawImage(c.img, Math.round(c.x / 4) * 4, Math.round(c.y - cam));
      }
      ctx.globalAlpha = 1;

      this.drawBoat(Math.round(W * 0.3), sy);
    }

    if (sy < H) {
      const g = ctx.createLinearGradient(0, sy, 0, sy + OCEAN_SPAN);
      for (const [d, c] of OCEAN) g.addColorStop(d / OCEAN_SPAN, rgb(c));
      ctx.fillStyle = g;
      ctx.fillRect(0, Math.max(0, sy + 8), W, H);

      if (sy > -20) {
        const col = 6;
        for (let x = 0; x < W; x += col) {
          const wave = Math.sin(x / 110 + t * 0.9) * 3 + Math.sin(x / 47 - t * 1.3) * 1.5;
          const wy = sy + Math.round(wave / 3) * 3;
          ctx.fillStyle = rgb(OCEAN[0][1]);
          ctx.fillRect(x, wy, col, sy + 9 - wy);
          ctx.fillStyle = 'rgba(160,205,228,0.75)';
          ctx.fillRect(x, wy, col, 2);
        }
      }

      // Keep each mote/fish within one screen-and-a-bit of the camera (wrapping), so the ocean never runs out.
      const wrap = (d, span) => -sy + ((((d + sy) % span) + span) % span) - (span - H) / 2;
      // While the camera is moving fast, motes streak like bubbles rushing past.
      const streak = this.reduced ? 0 : Math.min(70, Math.abs(this.vel) * 0.035);
      this.drawRays(sy);
      for (const m of this.motes) {
        m.d = wrap(m.d - m.v * dt, H + 40);
        const y = sy + m.d;
        if (y < sy + 12 || y > H) continue;
        // Deep down, the drifting motes become twinkling bioluminescence.
        const glow = Math.min(1, Math.max(0, (m.d - 5000) / 4000));
        const a = (streak > 2 ? m.a * 0.8 : m.a) * (1 - glow) + glow * (0.35 + 0.35 * Math.sin(this.t * 2.5 + m.tw));
        ctx.fillStyle = glow > 0.05 ? `rgba(${180 - 70 * glow},${215 + 40 * glow},${240 - 20 * glow},${a})` : `rgba(180,215,240,${a})`;
        ctx.fillRect(Math.round(m.x), Math.round(y), 2, 2 + Math.round(streak));
      }
      this.drawCritters(sy, dt);

      for (const f of this.fish) {
        f.x += f.v * dt * (this.reduced ? 0.3 : 1);
        if (f.x > W + 40) f.x = -40;
        if (f.x < -40) f.x = W + 40;
        f.d = wrap(f.d, H + 120);
        const y = sy + f.d;
        if (y < sy + 20 || y > H + 20) continue;
        drawSprite(ctx, 'fish', Math.round(f.x), Math.round(y), f.s, { flip: f.v > 0, tint: 'rgba(5,10,22,0.72)' });
      }

      this.drawRuler(sy);
    }

    if (this.dim > 0.005) {
      ctx.fillStyle = `rgba(9,14,26,${this.dim})`;
      ctx.fillRect(0, 0, W, H);
    }
  }

  drawBoat(cx, sy) {
    const { ctx, t } = this;
    const P = this.W < 600 ? 3 : 4;
    const bob = Math.round(Math.sin(t * 1.6) * 1.5);
    const x0 = cx - 20 * P, y0 = sy - 21 * P + bob;
    const fill = (rects, color) => {
      ctx.fillStyle = color;
      for (const [x, y, w, h] of rects) ctx.fillRect(x0 + x * P, y0 + y * P, w * P, h * P);
    };
    fill(BOAT.mast, '#121826');
    fill(BOAT.flag, '#7a1424');      // Aggie maroon flag
    fill(BOAT.flagShade, '#500000');
    fill(BOAT.cabin, '#121826');
    fill(BOAT.windows, '#6f93b3');
    fill(BOAT.hull, '#121826');
  }

  drawRuler(sy) {
    const { ctx, W, H } = this;
    const x = W - 20;
    const top = Math.max(0, sy);
    ctx.fillStyle = 'rgba(140,175,205,0.28)';
    ctx.fillRect(x, top, 1, H - top);
    ctx.font = '10px "IBM Plex Mono", monospace';
    ctx.textAlign = 'right';
    const step = 60;
    const first = Math.max(0, Math.ceil(-sy / step)) * step;
    for (let d = first; sy + d < H; d += step) {
      const y = Math.round(sy + d);
      const major = d % (step * 5) === 0;
      ctx.fillStyle = major ? 'rgba(160,190,215,0.45)' : 'rgba(140,175,205,0.28)';
      ctx.fillRect(x - (major ? 10 : 5), y, major ? 10 : 5, 1);
      if (major) ctx.fillText(d === 0 ? '0m' : `-${(Math.round(this.metersAt(d) / 10) * 10).toLocaleString()}m`, x - 14, y + 3);
    }
  }
}
