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
  return { prompts, ids: Object.keys(prompts), daily: raw.daily || [], packs: raw.packs || [] };
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
export function pick(pool, count, seed, fallback = []) {
  const r = rng(seed);
  const shuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  };
  const chosen = shuffle(pool).slice(0, count);
  for (const id of shuffle(fallback)) {
    if (chosen.length >= count) break;
    if (!chosen.includes(id)) chosen.push(id);
  }
  return chosen;
}

export function dailyIds(bank, n) {
  const scheduled = bank.daily[n - 1];
  if (scheduled) return pick(scheduled, CONFIG.promptsPerDive, `daily-${n}`, bank.ids).sort((a, b) => scheduled.indexOf(a) - scheduled.indexOf(b));
  return pick(bank.ids, CONFIG.promptsPerDive, `daily-${n}`);
}
