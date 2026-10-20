// GET /api/counts?ids=a,b,c → { promptId: { answer: n } }
import { db, allow, fail } from './_lib/db.js';

export default async function handler(req, res) {
  if (!allow(req, res, 'GET')) return;
  const ids = String(req.query.ids || '').split(',').map((s) => s.trim()).filter(Boolean).slice(0, 20);
  if (!ids.length) return fail(res, 400, 'ids required');
  try {
    const rows = await (await db())`select prompt_id, answer, n from answer_counts where prompt_id = any(${ids})`;
    const out = {};
    for (const r of rows) (out[r.prompt_id] ||= {})[r.answer] = r.n;
    res.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=300');
    res.status(200).json(out);
  } catch (e) {
    console.error(e);
    fail(res, 500, 'database error');
  }
}
