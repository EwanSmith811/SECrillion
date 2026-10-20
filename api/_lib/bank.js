// The server's copy of the answer list, so only real canonical answers get counted.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseAnswer } from '../../js/scoring.js';

let valid;
export function validAnswers() {
  if (!valid) {
    const bank = JSON.parse(readFileSync(join(process.cwd(), 'data', 'questions.json'), 'utf8'));
    valid = new Map(Object.entries(bank.prompts).map(([id, p]) => [id, new Set(p.answers.map((a) => parseAnswer(a).key))]));
  }
  return valid;
}
