// Merge a career fair's employer list into a prompt in data/questions.json.
//
//   node tools/import-fair.mjs <source>... [--prompt career-fair-f26]
//
// A source can be:
//   - a HireAggies event nickname, e.g. sec_f26_cdf (works while the event is upcoming/public)
//   - a .txt file with one company per line (copy the names out of HireAggies)
//   - a .json file saved from HireAggies' /registrations API response
//
// Companies already in the prompt keep their seed and aliases. New ones get a seed from
// FAME below (well-known = common answer = shallow) or 1 if unknown, and are printed so
// someone can adjust how niche they really are.
import { readFileSync, writeFileSync } from 'node:fs';
import { parseAnswer, matchKey, levelFor } from '../js/scoring.js';

const FILE = new URL('../data/questions.json', import.meta.url);
const API = 'https://tamu-csm.symplicity.com/api/v3/external-events';

// Seed by name recognition among engineering students. Keys are matchKey()'d.
const FAME = Object.fromEntries(Object.entries({
  ExxonMobil: 30, Chevron: 28, 'Texas Instruments': 30, NASA: 30, SpaceX: 30, Boeing: 26, 'Lockheed Martin': 26,
  Shell: 22, Google: 24, Microsoft: 24, Amazon: 24, Apple: 24, Tesla: 24, Intel: 18, Nvidia: 18, Verizon: 25,
  Dow: 22, 'Dow Chemical': 22, RTX: 20, Raytheon: 20, 'Northrop Grumman': 18, 'General Motors': 16, Ford: 16, Toyota: 16,
  'Phillips 66': 14, ConocoPhillips: 14, BP: 14, Halliburton: 14, SLB: 12, Schlumberger: 12, 'Baker Hughes': 10,
  L3Harris: 15, Textron: 12, Bell: 12, 'Marathon Petroleum': 12, Valero: 12, Kiewit: 12, Bechtel: 10, Fluor: 10,
  TxDOT: 10, 'Texas Department of Transportation': 10, Honeywell: 10, Siemens: 10, 'General Electric': 10, Caterpillar: 10,
  Dell: 14, IBM: 12, Accenture: 10, Deloitte: 10, Oracle: 10, Cisco: 10, Qualcomm: 8, AMD: 10, Samsung: 12,
  'U.S. Navy': 15, Navy: 15, 'U.S. Army': 12, 'U.S. Air Force': 12, Nucor: 8, ABB: 8, 'Kimley-Horn': 8, Entergy: 8,
}).map(([k, v]) => [matchKey(k), v]));

const args = process.argv.slice(2);
const pi = args.indexOf('--prompt');
const promptId = pi >= 0 ? args.splice(pi, 2)[1] : 'career-fair-f26';

// "American Electric Power (AEP)" → { a: "American Electric Power", aka: ["AEP"] }
function clean(raw) {
  let name = String(raw).replace(/`/g, "'").replace(/\s*\((gold|silver|bronze|platinum)[^)]*partner\)\s*/i, ' ').replace(/\s+/g, ' ').trim();
  const aka = [];
  const paren = name.match(/^(.*?)\s*\(([^)]+)\)$/);
  if (paren) { name = paren[1].trim(); aka.push(paren[2].trim()); }
  const bare = name.replace(/,?\s+(inc\.?|llc|corp\.?|corporation|company|co\.)$/i, '').trim();
  if (bare !== name) { aka.push(name); name = bare; }
  return { a: name, aka };
}

async function namesFrom(src) {
  if (src.endsWith('.txt')) return readFileSync(src, 'utf8').split('\n').map((s) => s.trim()).filter(Boolean);
  if (src.endsWith('.json')) return JSON.parse(readFileSync(src, 'utf8')).models.map((m) => m.name);
  const ev = await fetch(`${API}/${src}?publicpage=true`, { headers: { Accept: 'application/json' } });
  if (!ev.ok) throw new Error(`${src}: HireAggies returned ${ev.status} (past events need a login — use a .txt list instead)`);
  const { event_id } = await ev.json();
  const names = [];
  for (let page = 1; ; page++) {
    const r = await fetch(`${API}/${event_id}/registrations?page=${page}&perPage=250`, { headers: { Accept: 'application/json' } });
    const { models = [], total = 0 } = await r.json();
    names.push(...models.map((m) => m.name));
    if (!models.length || names.length >= total) break;
  }
  return names;
}

const text = readFileSync(FILE, 'utf8');
const bank = JSON.parse(text);
const existing = (bank.prompts[promptId]?.answers || []).map(parseAnswer);
const byKey = new Map();
for (const a of existing) for (const n of [a.a, ...a.aka]) byKey.set(matchKey(n), a);

const added = [];
for (const src of args) {
  for (const raw of await namesFrom(src)) {
    const c = clean(raw);
    if ([c.a, ...c.aka].some((n) => byKey.has(matchKey(n)))) continue;
    const entry = { a: c.a, aka: c.aka, n: FAME[matchKey(c.a)] ?? c.aka.map((x) => FAME[matchKey(x)]).find((x) => x != null) ?? 1 };
    existing.push(entry);
    for (const n of [c.a, ...c.aka]) byKey.set(matchKey(n), entry);
    added.push(entry);
  }
}

existing.sort((x, y) => y.n - x.n || x.a.localeCompare(y.a));
const line = (a) => `        ${JSON.stringify([a.a, ...a.aka].join(' | ') + ` = ${levelFor(a.n)}`)}`;
const block = `    ${JSON.stringify(promptId)}: {
      "prompt": ${JSON.stringify(bank.prompts[promptId]?.prompt || 'Name a company at the Fall 2026 SEC Career Fair')},
      "answers": [
${existing.map(line).join(',\n')}
      ]
    },
`;
const start = text.indexOf(`    ${JSON.stringify(promptId)}: {`);
const out = start >= 0
  ? text.slice(0, start) + block + text.slice(text.indexOf('\n    },\n', start) + 8)
  : text.replace('  "prompts": {\n', `  "prompts": {\n${block}\n`);
JSON.parse(out); // never write broken JSON
writeFileSync(FILE, out);

console.log(`${promptId}: ${existing.length} companies (${added.length} new)`);
for (const a of added) console.log(`  + ${a.a}${a.aka.length ? ` (${a.aka.join(', ')})` : ''} = ${levelFor(a.n)}`);
