// The pixel-art world: sky, sun, clouds, boat, ocean, fish and the depth ruler.
import { drawSprite } from './sprites.js';

export const PX_PER_POINT = 6;     // world pixels the camera sinks per point scored
export const METERS_PER_POINT = 10;

const OCEAN = [
  [0, [45, 95, 142]], [120, [35, 80, 124]], [280, [23, 52, 86]],
  [650, [14, 29, 51]], [1600, [10, 20, 36]], [4600, [5, 8, 15]],
];
const OCEAN_SPAN = 4600;
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
    this.cam = 0; this.camTarget = 0;
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
    this.fish = Array.from({ length: 18 }, () => ({ x: rand(0, this.W), d: rand(60, 4200), v: rand(8, 26) * (Math.random() < 0.5 ? -1 : 1), s: Math.random() < 0.3 ? 3 : 2 }));
    this.motes = Array.from({ length: 160 }, () => ({ x: rand(0, this.W), d: rand(10, 4600), v: rand(2, 7), a: rand(0.15, 0.5) }));
  }

  setMode(mode) {
    this.mode = mode;
    if (mode !== 'dive') this.camTarget = 0;
    this.dimTarget = mode === 'results' ? 0.8 : 0;
  }

  // With `ms`, the camera eases to the new depth over that long, so it keeps pace with the krill's dive.
  diveTo(points, ms = 0) {
    this.camTarget = this.surface - this.H * 0.26 + points * PX_PER_POINT;
    this.tween = ms > 0 ? { from: this.cam, to: this.camTarget, t0: performance.now(), ms } : null;
  }

  frame = (now) => {
    const dt = Math.min(0.05, (now - this.last) / 1000);
    this.last = now;
    this.t += dt * (this.reduced ? 0.3 : 1);
    if (this.tween && this.tween.to === this.camTarget) {
      const k = Math.min(1, (now - this.tween.t0) / this.tween.ms);
      this.cam = this.tween.from + (this.tween.to - this.tween.from) * (k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2);
      if (k >= 1) this.tween = null;
    } else this.cam += (this.camTarget - this.cam) * Math.min(1, dt * 1.8);
    this.dim += (this.dimTarget - this.dim) * Math.min(1, dt * 2.5);
    this.draw(dt);
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

      for (const m of this.motes) {
        m.d -= m.v * dt;
        if (m.d < 10) m.d = 4600;
        const y = sy + m.d;
        if (y < sy + 12 || y > H) continue;
        ctx.fillStyle = `rgba(180,215,240,${m.a})`;
        ctx.fillRect(Math.round(m.x), Math.round(y), 2, 2);
      }

      for (const f of this.fish) {
        f.x += f.v * dt * (this.reduced ? 0.3 : 1);
        if (f.x > W + 40) f.x = -40;
        if (f.x < -40) f.x = W + 40;
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
      if (major) ctx.fillText(d === 0 ? '0m' : `-${Math.round((d / PX_PER_POINT) * METERS_PER_POINT).toLocaleString()}m`, x - 14, y + 3);
    }
  }
}
