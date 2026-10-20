// Answer parsing, fuzzy matching and rarity scoring.

export const MAX_PER_PROMPT = 100;

export const TIERS = [
  { id: 'plankton', name: 'Plankton', min: 0,   max: 150,      color: '#b9c6d3', emoji: '🫧', line: 'Plankton. Still reading the Freshman Materials.' },
  { id: 'schooler', name: 'Schooler', min: 151, max: 250,      color: '#5ad1e6', emoji: '🐟', line: 'Schooler. Blending into the Career Fair line.' },
  { id: 'rare',     name: 'Rare',     min: 251, max: 350,      color: '#ff4d6d', emoji: '🪸', line: 'Rare. Industry Nights material.' },
  { id: 'deep',     name: 'Deep cut', min: 351, max: 449,      color: '#a08cff', emoji: '🦑', line: 'Deep cut. EnVision keynote energy.' },
  { id: 'trench',   name: 'Trench',   min: 450, max: Infinity, color: '#ffb547', emoji: '🦐', line: 'One in a SECrillion. Council-certified absurd.' },
];
export const MISS = { id: 'miss', name: 'Miss', color: '#4c5c70', emoji: '⬛' };

export const tierForTotal = (score) => TIERS.find((t) => score <= t.max) || TIERS[TIERS.length - 1];
// A single prompt is scored 0–100; map it onto the same bands as a 7-prompt total.
export const tierForPrompt = (points) => (points <= 0 ? MISS : tierForTotal(points * 7));

export function normalize(s) {
  return String(s)
    .normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/['’`]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9+#]+/g, ' ')
    .trim()
    .replace(/^(the|a|an) /, '');
}

// Normalized form used for matching: also forgives a trailing plural "s".
export function matchKey(s) {
  const n = normalize(s);
  return n.length > 3 && n.endsWith('s') && !n.endsWith('ss') ? n.slice(0, -1) : n;
}

// "Name | alias | alias = 40"  or  { a: "Name", aka: ["alias"], n: 40 }
export function parseAnswer(entry) {
  if (typeof entry === 'string') {
    const m = entry.match(/^(.*?)\s*=\s*(\d+)\s*$/);
    const names = (m ? m[1] : entry).split('|').map((s) => s.trim()).filter(Boolean);
    return { a: names[0], aka: names.slice(1), n: m ? Number(m[2]) : 1, key: normalize(names[0]) };
  }
  return { a: entry.a, aka: entry.aka || [], n: entry.n ?? 1, key: normalize(entry.a) };
}

export function preparePrompt(id, raw) {
  const answers = raw.answers.map(parseAnswer);
  const index = new Map();
  answers.forEach((ans, i) => {
    for (const name of [ans.a, ...ans.aka]) {
      const k = matchKey(name);
      if (index.has(k) && index.get(k) !== i) console.warn(`[questions] "${name}" is listed twice in ${id}`);
      else index.set(k, i);
    }
  });
  return { id, prompt: raw.prompt, answers, index };
}

function lev(a, b) {
  if (Math.abs(a.length - b.length) > 2) return 99;
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[b.length];
}

// Returns the index of the matched answer, or -1.
export function matchAnswer(prompt, input) {
  const k = matchKey(input);
  if (!k) return -1;
  if (prompt.index.has(k)) return prompt.index.get(k);
  const tol = k.length >= 8 ? 2 : k.length >= 5 ? 1 : 0;
  if (!tol) return -1;
  let best = -1, bestD = tol + 1;
  for (const [key, i] of prompt.index) {
    const d = lev(k, key);
    if (d < bestD) { bestD = d; best = i; }
  }
  return best;
}

// The most popular answer scores 10; never-seen valid answers score 100.
export function pointsFor(counts, i) {
  const c = counts[i];
  if (c <= 0) return MAX_PER_PROMPT;
  const max = Math.max(1, ...counts);
  return Math.round(10 + 88 * (1 - Math.sqrt(c / max)));
}
