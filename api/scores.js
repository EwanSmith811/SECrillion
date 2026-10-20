// GET /api/scores?dive=dive-3 → [{ score, name }]
import { db, allow, fail, DIVE_KEY } from './_lib/db.js';

export default async function handler(req, res) {
  if (!allow(req, res, 'GET')) return;
  const dive = String(req.query.dive || '');
  if (!DIVE_KEY.test(dive)) return fail(res, 400, 'bad dive');
  try {
    const rows = await (await db())`select score, name from scores where dive_key = ${dive} order by created_at desc limit 10000`;
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json(rows);
  } catch (e) {
    console.error(e);
    fail(res, 500, 'database error');
  }
}
