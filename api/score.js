// POST /api/score { dive_key, score, name? }
import { db, allow, fail, DIVE_KEY } from './_lib/db.js';

export default async function handler(req, res) {
  if (!allow(req, res, 'POST')) return;
  const { dive_key, score, name } = req.body || {};
  if (!DIVE_KEY.test(String(dive_key))) return fail(res, 400, 'bad dive_key');
  if (!Number.isInteger(score) || score < 0 || score > 700) return fail(res, 400, 'bad score');
  const clean = typeof name === 'string' ? name.replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, 20) || null : null;
  try {
    await (await db())`insert into scores (dive_key, score, name) values (${dive_key}, ${score}, ${clean})`;
    res.status(204).end();
  } catch (e) {
    console.error(e);
    fail(res, 500, 'database error');
  }
}
