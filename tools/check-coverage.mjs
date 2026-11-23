// Verify every published reference-catalog entry is accepted by its question.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { preparePrompt, matchAnswer, matchKey, scoreAnswer, MAX_GEMS } from '../js/scoring.js';

const bank = JSON.parse(readFileSync(new URL('../data/questions.json', import.meta.url), 'utf8'));
const coverage = JSON.parse(readFileSync(new URL('../data/question-coverage.json', import.meta.url), 'utf8'));
let sourceEntries = 0;

for (const [id, record] of Object.entries(coverage.prompts)) {
  assert.ok(bank.prompts[id], `Unknown catalog question: ${id}`);
  assert.ok(record.scope && record.sources.length, `${id}: missing scope/sources`);
  const p = preparePrompt(id, bank.prompts[id]);
  const names = p.answers.map((a) => a.a);
  assert.deepEqual(record.acceptedAnswers, names, `${id}: published catalog differs from game answers`);
  assert.equal(new Set(names).size, names.length, `${id}: duplicate canonical answer`);
  let previous = 0;
  for (let i = 0; i < p.answers.length; i++) {
    const answer = p.answers[i];
    assert.equal(answer.tier, answer.level, `${id}: an explicit tier was changed by preparation`);
    const points = scoreAnswer(p, i);
    assert.ok(points >= previous, `${id}: answers are not ordered by rarity`);
    previous = points;
    for (const name of [answer.a, ...answer.aka]) {
      assert.ok(matchKey(name), `${id}: empty/unmatchable alias`);
      assert.equal(matchAnswer(p, name), i, `${id}: alias matches the wrong answer: ${name}`);
    }
  }
  assert.ok(p.answers.filter((a) => a.tier === 'trench').length <= MAX_GEMS, `${id}: too many gems`);
  for (const entry of record.sourceAnswers) {
    const expected = names.indexOf(entry.answer);
    assert.ok(expected >= 0, `${id}: missing catalog answer ${entry.answer}`);
    assert.equal(matchAnswer(p, entry.sourceAnswer), expected, `${id}: source entry rejected/mismatched: ${entry.sourceAnswer}`);
    assert.ok(entry.url, `${id}: missing source for ${entry.sourceAnswer}`);
    sourceEntries++;
  }
  for (const name of record.legacyAnswersRetained) {
    assert.ok(names.includes(name), `${id}: missing retained legacy answer ${name}`);
  }
}

console.log(`Coverage: ${Object.keys(coverage.prompts).length} reference catalogs, ${sourceEntries} sourced entries; all answers, aliases and rarity tiers verified.`);
