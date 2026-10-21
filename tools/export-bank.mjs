// Write docs/QUESTION_BANK.md: every prompt with its answers grouped by depth level.
//   node tools/export-bank.mjs            (career-fair prompts are left out; --all keeps them)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { preparePrompt, TIERS } from '../js/scoring.js';

const all = process.argv.includes('--all');
const bank = JSON.parse(readFileSync(new URL('../data/questions.json', import.meta.url), 'utf8'));
const inPacks = (id) => (bank.packs || []).filter((p) => p.prompts.includes(id)).map((p) => p.name);
const daily = (id) => (bank.daily || []).map((d, i) => (d.includes(id) ? i + 1 : null)).filter(Boolean);

const ids = Object.keys(bank.prompts).filter((id) => all || !id.startsWith('career-fair'));
// SEC pool prompts first (the ones daily dives use), then the themed-pack-only ones.
const pool = new Set(bank.pool || []);
ids.sort((a, b) => (pool.has(b) - pool.has(a)));

const out = [
  '# SECrillion question bank',
  '',
  `Generated from \`data/questions.json\` by \`node tools/export-bank.mjs\`. ${all ? '' : 'Career-fair prompts are left out. '}Points per tier: ${TIERS.map((t) => `${t.name} ${t.points}`).join(' · ')}.`,
  '',
  `${ids.length} prompts.`,
  '',
];

for (const id of ids) {
  const p = preparePrompt(id, bank.prompts[id]);
  const where = [
    pool.has(id) ? 'Daily / Unlimited pool' : null,
    daily(id).length ? `Scheduled dives ${daily(id).join(', ')}` : null,
    inPacks(id).length ? `Packs: ${inPacks(id).join(', ')}` : null,
  ].filter(Boolean).join(' · ');
  out.push(`## ${p.prompt}`, '', `\`${id}\` · ${p.answers.length} answers${where ? ` · ${where}` : ''}`, '');
  for (const t of TIERS) {
    const answers = p.answers.filter((a) => a.tier === t.id);
    if (!answers.length) continue;
    const list = answers.map((a) => (a.aka.length ? `${a.a} (${a.aka.join(', ')})` : a.a)).join('; ');
    out.push(`**${t.name} (${t.points}) · ${answers.length}:** ${list}`, '');
  }
}

mkdirSync(new URL('../docs/', import.meta.url), { recursive: true });
writeFileSync(new URL('../docs/QUESTION_BANK.md', import.meta.url), out.join('\n'));
console.log(`docs/QUESTION_BANK.md: ${ids.length} prompts`);
