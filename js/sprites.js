// Hand-made pixel sprites. '.' is transparent; other characters index the palette.

const SPRITES = {
  // The SECrillion mascot: a krill in a maroon cap.
  krill: {
    pal: { r: '#ff4f64', d: '#c42a45', y: '#ff8fa0', w: '#ffffff', k: '#1a0f1a', m: '#7a1a2e', n: '#4d0d1b', h: '#ffd9df' },
    rows: [
      '.......mmmm.......',
      '.....mmmmmmmm.....',
      '....mmmmhmmmmm....',
      '..nnnnnnnnnnnnn...',
      '....rrrrrrrrrrr...',
      '...rwkrrrrrrrrrr..',
      'y..rkkrrrrhrrrrrr.',
      '.yrrrrrrrrrrrrrrr.',
      'y..drrrrrrrrrrrrr.',
      '....ddrrrrrrrrrrr.',
      '.....y.ddrrrrrrrr.',
      '....y.y..ddrrrrr..',
      '...y.y..rrrrrrr...',
      '.......rrr..rr....',
      '......rr....r.....',
    ],
  },
  fish: {
    pal: { a: '#0b1423' },
    rows: [
      '...aaa..a',
      '.aaaaaaaa',
      'aaaaaaaa.',
      '.aaaaaaaa',
      '...aaa..a',
    ],
  },
  plankton: {
    pal: { a: '#9fdcea', b: '#ffffff' },
    rows: [
      '..a....',
      '.aba..a',
      '..a....',
      '....a..',
      'a..aba.',
      '....a..',
      '.a.....',
    ],
  },
  schooler: {
    pal: { a: '#5ad1e6', k: '#0b1423' },
    rows: [
      '...aaa..a',
      '.aaaaaaaa',
      'akaaaaaa.',
      '.aaaaaaaa',
      '...aaa..a',
    ],
  },
  rare: {
    pal: { a: '#ff4d6d', b: '#b02a46' },
    rows: [
      'a.a..a.',
      'a.a.a.a',
      '.aa.aa.',
      '..aa.a.',
      '...aa..',
      '...a...',
      '..bbb..',
    ],
  },
  deep: {
    pal: { a: '#a08cff', k: '#1a1238' },
    rows: [
      '..aaa..',
      '.aaaaa.',
      'aaaaaaa',
      'akaaaka',
      '.aaaaa.',
      '.a.a.a.',
      'a.a.a.a',
      '.a.a.a.',
    ],
  },
  trench: {
    pal: { a: '#ff5a4f', y: '#ffb547', k: '#1a0f1a' },
    rows: [
      'yy.......',
      '..aaaa...',
      '.aakaaaa.',
      '..aaaaaaa',
      '....aaaa.',
      '.....y.y.',
      '....y.y..',
    ],
  },
  miss: {
    pal: { a: '#4c5c70' },
    rows: [
      'a...a',
      '.a.a.',
      '..a..',
      '.a.a.',
      'a...a',
    ],
  },
  puffer: {
    pal: { a: '#f2c14e', b: '#c8902a', w: '#ffffff', k: '#1a0f1a', s: '#fff1c2' },
    rows: [
      '...b..b.b..',
      '..aaaaaaa..',
      '.aaaaaaaaab',
      'bawkaaaaaa.',
      '.akkaasaaab',
      '.aasssssaa.',
      '..aaaaaaab.',
      '...b..b....',
    ],
  },
};

export const SKINS = {
  classic: { name: 'Classic',      pal: {} },
  maroon:  { name: 'Aggie Maroon', pal: { r: '#a3243b', d: '#6b1426', y: '#e07a8c', m: '#f2f2f2', n: '#c9c9c9', h: '#ffffff' } },
  gold:    { name: 'Ring Gold',    pal: { r: '#f2c14e', d: '#c8902a', y: '#ffe08a', h: '#fff4cf' } },
  ghost:   { name: 'Silver Taps',  pal: { r: '#dfe7ef', d: '#9aa8b8', y: '#ffffff', m: '#3b4658', n: '#262f3d' } },
  abyss:   { name: 'Bioluminescent', pal: { r: '#5ad1e6', d: '#2b8aa3', y: '#b5f0fa', m: '#111a2b', n: '#05080f', h: '#e6fbff' } },
};

export function spriteSize(name) {
  const rows = SPRITES[name].rows;
  return { w: Math.max(...rows.map((r) => r.length)), h: rows.length };
}

export function drawSprite(ctx, name, x, y, s, { flip = false, tint = null, pal = null } = {}) {
  const sp = SPRITES[name];
  const { w } = spriteSize(name);
  sp.rows.forEach((row, j) => {
    for (let i = 0; i < row.length; i++) {
      const ch = row[i];
      if (ch === '.') continue;
      ctx.fillStyle = tint || (pal && pal[ch]) || sp.pal[ch];
      ctx.fillRect(x + (flip ? w - 1 - i : i) * s, y + j * s, s, s);
    }
  });
}

const urlCache = new Map();
export function spriteURL(name, s = 3, opts = {}) {
  const key = name + s + JSON.stringify(opts);
  if (!urlCache.has(key)) {
    const { w, h } = spriteSize(name);
    const c = document.createElement('canvas');
    c.width = w * s; c.height = h * s;
    drawSprite(c.getContext('2d'), name, 0, 0, s, opts);
    urlCache.set(key, c.toDataURL());
  }
  return urlCache.get(key);
}

export function renderKrill(canvas, skin = 'classic', s = 3) {
  const { w, h } = spriteSize('krill');
  canvas.width = w * s; canvas.height = h * s;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawSprite(ctx, 'krill', 0, 0, s, { pal: { ...SPRITES.krill.pal, ...(SKINS[skin] || SKINS.classic).pal } });
}

export const krillURL = (skin, s = 3) =>
  spriteURL('krill', s, { pal: { ...SPRITES.krill.pal, ...(SKINS[skin] || SKINS.classic).pal } });
