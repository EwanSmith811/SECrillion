// Applies db/schema.sql. Every statement is idempotent ("if not exists"), so it is safe to run on every cold start.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export function schemaStatements() {
  return readFileSync(join(process.cwd(), 'db', 'schema.sql'), 'utf8')
    .replace(/--.*$/gm, '')
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function migrate(sql, log = () => {}) {
  for (const stmt of schemaStatements()) {
    await sql.query(stmt);
    log(stmt.split('\n')[0]);
  }
}
