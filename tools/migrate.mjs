// Apply db/schema.sql to Neon:  npm run migrate   (reads DATABASE_URL from .env.local)
// The API also applies it automatically on first request, so this is only needed to set up ahead of time.
import { neon } from '@neondatabase/serverless';
import { migrate } from '../api/_lib/migrate.js';

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set. Run `vercel env pull .env.local` (or paste it into .env.local) first.');
  process.exit(1);
}
await migrate(neon(process.env.DATABASE_URL), (s) => console.log('✓', s));
console.log('Schema is up to date.');
