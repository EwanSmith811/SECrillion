import { neon } from '@neondatabase/serverless';
import { migrate } from './migrate.js';

let client, ready;
// Vercel's Neon integration provides DATABASE_URL. The schema is applied once per
// function instance, so a fresh database sets itself up on the first request.
export async function db() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
  client ||= neon(process.env.DATABASE_URL);
  ready ||= migrate(client).catch((e) => { ready = null; throw e; });
  await ready;
  return client;
}

export const DIVE_KEY = /^(dive-\d{1,5}|unlimited|pack-[a-z0-9-]{1,30})$/;

export function fail(res, status, error) {
  res.status(status).json({ error });
}

export function allow(req, res, method) {
  if (req.method === method) return true;
  res.setHeader('Allow', method);
  fail(res, 405, 'method not allowed');
  return false;
}
