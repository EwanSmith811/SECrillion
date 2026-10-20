// POST /api/answer { dive_key, prompt_id, answer } — counts one accepted answer.
import { db, allow, fail, DIVE_KEY } from './_lib/db.js';
import { validAnswers } from './_lib/bank.js';

export default async function handler(req, res) {
  if (!allow(req, res, 'POST')) return;
  const { dive_key, prompt_id, answer } = req.body || {};
  if (!DIVE_KEY.test(String(dive_key))) return fail(res, 400, 'bad dive_key');
  if (!validAnswers().get(prompt_id)?.has(answer)) return fail(res, 400, 'not on the list');
  try {
    await (await db())`insert into answer_counts (prompt_id, answer, n) values (${prompt_id}, ${answer}, 1)
               on conflict (prompt_id, answer) do update set n = answer_counts.n + 1`;
    res.status(204).end();
  } catch (e) {
    console.error(e);
    fail(res, 500, 'database error');
  }
}
