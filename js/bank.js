// Question bank loading and dive selection.
import { CONFIG } from './config.js';
import { preparePrompt } from './scoring.js';

const DAY = 864e5;

export async function loadBank() {
  const raw = await fetch(CONFIG.questionsUrl, { cache: 'no-cache' }).then((r) => r.json());
  const prompts = {};
  for (const [id, p] of Object.entries(raw.prompts)) prompts[id] = preparePrompt(id, p);
  const check = (ids, where) => ids.forEach((id) => { if (!prompts[id]) console.warn(`[questions] unknown prompt "${id}" in ${where}`); });
  (raw.daily || []).forEach((ids, i) => check(ids, `daily #${i + 1}`));
  (raw.packs || []).forEach((p) => check(p.prompts, `pack ${p.id}`));
  const ids = Object.keys(prompts);
  if (raw.pool) check(raw.pool, 'pool');
  // Daily dives, Unlimited and parties draw only from the pool; other prompts live in themed packs.
  const pool = (raw.pool || ids).filter((id) => prompts[id]);
  const apart = (raw.apart || []).map((g) => g.filter((id) => prompts[id]));
  return { prompts, ids, pool, apart, daily: raw.daily || [], packs: raw.packs || [] };
}

const midnight = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const launch = () => new Date(CONFIG.launchDate + 'T00:00:00');

export const diveNumberFor = (date = new Date()) =>
  Math.max(1, Math.round((midnight(date) - launch()) / DAY) + 1);
export const dateForDive = (n) => new Date(launch().getTime() + (n - 1) * DAY);

function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  return h >>> 0;
}
export function rng(seed) {
  let a = typeof seed === 'number' ? seed : hash(String(seed));
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Pick `count` ids from `pool` (seeded), topping up from `fallback` if the pool is short.
// `apart` lists groups of prompts too alike to share a dive (e.g. two career fairs); only one of each group is used.
export function pick(pool, count, seed, fallback = [], apart = []) {
  const r = rng(seed);
  const shuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  };
  const clashes = (id, chosen) => apart.some((g) => g.includes(id) && chosen.some((c) => c !== id && g.includes(c)));
  const chosen = [];
  for (const id of [...shuffle(pool), ...shuffle(fallback)]) {
    if (chosen.length >= count) break;
    if (!chosen.includes(id) && !clashes(id, chosen)) chosen.push(id);
  }
  return chosen;
}

// A prompt used in any of the last COOLDOWN daily dives sits out (with anything it's kept apart from),
// so the same questions don't come back day after day. Scheduled dives are used as written.
const COOLDOWN = 3;
const dailyCache = new WeakMap();

export function dailyIds(bank, n) {
  let cache = dailyCache.get(bank);
  if (!cache) dailyCache.set(bank, (cache = new Map()));
  if (!cache.has(n)) cache.set(n, chooseDaily(bank, n));
  return cache.get(n);
}

function chooseDaily(bank, n) {
  const scheduled = bank.daily[n - 1];
  if (scheduled) return pick(scheduled, CONFIG.promptsPerDive, `daily-${n}`, bank.pool, bank.apart).sort((a, b) => scheduled.indexOf(a) - scheduled.indexOf(b));
  const recent = new Set();
  for (let k = Math.max(1, n - COOLDOWN); k < n; k++) {
    for (const id of dailyIds(bank, k)) {
      recent.add(id);
      for (const group of bank.apart) if (group.includes(id)) group.forEach((other) => recent.add(other));
    }
  }
  const fresh = bank.pool.filter((id) => !recent.has(id));
  // If the pool is ever too small to fill a dive, recently used prompts top it up.
  return pick(fresh, CONFIG.promptsPerDive, `daily-${n}`, bank.pool.filter((id) => recent.has(id)), bank.apart);
}
