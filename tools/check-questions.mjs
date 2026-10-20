// Lint data/questions.json:  node tools/check-questions.mjs [path]
import { readFileSync } from 'node:fs';
import { parseAnswer, matchKey } from '../js/scoring.js';

const file = process.argv[2] || new URL('../data/questions.json', import.meta.url);
const bank = JSON.parse(readFileSync(file, 'utf8'));
let problems = 0;
const warn = (msg) => { problems++; console.log('  ⚠ ' + msg); };

for (const [id, p] of Object.entries(bank.prompts)) {
  const answers = p.answers.map(parseAnswer);
  const seen = new Map();
  for (const a of answers) {
    for (const name of [a.a, ...a.aka]) {
      const k = matchKey(name);
      if (seen.has(k) && seen.get(k) !== a.a) warn(`${id}: "${name}" collides with "${seen.get(k)}"`);
      seen.set(k, a.a);
    }
  }
  const zero = answers.filter((a) => a.n === 0).length;
  const top = answers.reduce((m, a) => (a.n > m.n ? a : m), answers[0]);
  console.log(`${id.padEnd(24)} ${String(answers.length).padStart(4)} answers · ${String(zero).padStart(3)} unseen · top: ${top.a} (${top.n})`);
  if (answers.length < 6) console.log(`  ℹ ${id}: only ${answers.length} answers — scores will barely spread (fine for small closed sets)`);
}

const ids = new Set(Object.keys(bank.prompts));
(bank.daily || []).forEach((d, i) => d.forEach((id) => ids.has(id) || warn(`daily #${i + 1}: unknown prompt "${id}"`)));
(bank.packs || []).forEach((p) => p.prompts.forEach((id) => ids.has(id) || warn(`pack ${p.id}: unknown prompt "${id}"`)));

console.log(`\n${ids.size} prompts · ${(bank.daily || []).length} scheduled dives · ${(bank.packs || []).length} packs · ${problems ? problems + ' problem(s)' : 'no problems'}`);
process.exit(problems ? 1 : 0);
