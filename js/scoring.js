// Answer parsing, fuzzy matching and rarity scoring.

export const MAX_PER_PROMPT = 100;

export const TIERS = [
  { id: 'plankton', name: 'Plankton', min: 0,   max: 150,      color: '#b9c6d3', emoji: '🫧', line: 'Plankton. Still reading the Freshman Materials.' },
  { id: 'schooler', name: 'Schooler', min: 151, max: 250,      color: '#5ad1e6', emoji: '🐟', line: 'Schooler. Blending into the Career Fair line.' },
  { id: 'rare',     name: 'Rare',     min: 251, max: 350,      color: '#ff4d6d', emoji: '🪸', line: 'Rare. Industry Nights material.' },
  { id: 'deep',     name: 'Deep cut', min: 351, max: 449,      color: '#a08cff', emoji: '🦑', line: 'Deep cut. EnVision keynote energy.' },
  { id: 'trench',   name: 'One in a SECrillion', min: 450, max: Infinity, color: '#ffb547', emoji: '🦐', line: 'One in a SECrillion. Council-certified absurd.' },
];

// An answer can be ranked by depth level instead of a raw seed ("Tristan Forks = plankton").
// Each seed lands the answer in that level's band when the prompt's top answer is a plankton (30):
// plankton 10 pts · schooler 30 · rare 42 · deep cut 62 · one in a SECrillion 82.
export const LEVELS = { plankton: 30, schooler: 18, rare: 12, 'deep cut': 5, secrillion: 1 };
// Lowest seed that still counts as each level, for turning raw seeds into levels.
const LEVEL_FLOORS = [['plankton', 20], ['schooler', 13], ['rare', 7], ['deep cut', 2]];
const LEVEL_ALIASES = { deep: 'deep cut', deepcut: 'deep cut', 'one in a secrillion': 'secrillion' };
const levelSeed = (word) => {
  const w = word.toLowerCase().replace(/\s+/g, ' ').trim();
  return LEVELS[LEVEL_ALIASES[w] || w];
};
export const levelFor = (seed) => LEVEL_FLOORS.find(([, floor]) => seed >= floor)?.[0] ?? 'secrillion';
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

// "Name | alias | alias = 40", "Name | alias = rare"  or  { a: "Name", aka: ["alias"], n: 40 }
export function parseAnswer(entry) {
  if (typeof entry === 'string') {
    let m = entry.match(/^(.*?)\s*=\s*(\d+)\s*$/);
    let n = m ? Number(m[2]) : null;
    if (!m) {
      // A level word only counts if it's a real level, so "PV=nRT" stays a name.
      const lm = entry.match(/^(.*?)\s*=\s*([a-z][a-z ]*)\s*$/i);
      if (lm && levelSeed(lm[2]) != null) { m = lm; n = levelSeed(lm[2]); }
    }
    const names = (m ? m[1] : entry).split('|').map((s) => s.trim()).filter(Boolean);
    return { a: names[0], aka: names.slice(1), n: n ?? 1, key: normalize(names[0]) };
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

// Optimal string alignment distance (Levenshtein plus adjacent swaps); anything past `max` returns max + 1.
function editDistance(a, b, max) {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let before = null;
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      let v = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) v = Math.min(v, before[j - 2] + 1);
      cur[j] = v;
      rowMin = Math.min(rowMin, v);
    }
    if (rowMin > max) return max + 1;
    before = prev;
    prev = cur;
  }
  return prev[b.length];
}

// How many typos a name of this length can carry and still get a suggestion.
const tolerance = (len) => (len < 4 ? 0 : len < 7 ? 1 : Math.max(2, Math.floor(len / 5)));
const stem = (w) => (w.length > 5 ? w.replace(/(ing|ers|er|es|s)$/, '') : w);
const sameWord = (a, b) => a === b || stem(a) === stem(b) || editDistance(a, b, tolerance(Math.min(a.length, b.length))) <= tolerance(Math.min(a.length, b.length));

// Share of words the two names have in common, in order ("society of hispanic engineers" vs SHPE's full name = 0.8).
function wordOverlap(a, b) {
  const x = a.split(' '), y = b.split(' ');
  if (Math.min(x.length, y.length) < 2) return 0;
  let hits = 0, j = 0;
  for (const w of x) {
    const k = y.findIndex((v, n) => n >= j && sameWord(w, v));
    if (k >= 0) { hits++; j = k + 1; }
  }
  return hits / Math.max(x.length, y.length);
}

// An exact hit on a name or alias returns { i, exact: true }. Otherwise returns the closest answer
// worth suggesting ({ i, exact: false }), or i = -1 when nothing is close.
export function findAnswer(prompt, input) {
  const k = matchKey(input);
  if (!k) return { i: -1, exact: false };
  if (prompt.index.has(k)) return { i: prompt.index.get(k), exact: true };
  let best = -1, bestScore = Infinity;
  const consider = (i, score) => {
    if (score < bestScore || (score === bestScore && prompt.answers[i].n > prompt.answers[best].n)) { best = i; bestScore = score; }
  };
  for (const [key, i] of prompt.index) {
    const tol = tolerance(Math.min(k.length, key.length));
    const d = tol ? editDistance(k, key, tol) : tol + 1;
    if (d <= tol) consider(i, d / key.length);
  }
  if (best < 0) {
    for (const [key, i] of prompt.index) {
      const overlap = wordOverlap(k, key);
      if (overlap > 0.75) consider(i, 1 - overlap);
    }
  }
  if (best < 0 && k.length >= 4) {
    // The start of exactly one answer's name ("ellicott dredge" → Ellicott Dredge Enterprises).
    const words = k.split(' ');
    const hits = new Set();
    for (const [key, i] of prompt.index) {
      const kw = key.split(' ');
      if (kw.length > words.length && words.every((w, n) => sameWord(w, kw[n]))) hits.add(i);
    }
    if (hits.size === 1) best = [...hits][0];
  }
  return { i: best, exact: false };
}

// Index of the answer this input names exactly (by name or alias), or -1.
export function matchAnswer(prompt, input) {
  const m = findAnswer(prompt, input);
  return m.exact ? m.i : -1;
}

// The most popular answer scores 10; never-seen valid answers score 100.
export function pointsFor(counts, i) {
  const c = counts[i];
  if (c <= 0) return MAX_PER_PROMPT;
  const max = Math.max(1, ...counts);
  return Math.round(10 + 88 * (1 - Math.sqrt(c / max)));
}
