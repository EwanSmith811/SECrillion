// SECrillion configuration — edit this file to run your own dive.
export const CONFIG = {
  name: 'SECrillion',
  org: "Student Engineers' Council · Texas A&M",
  orgShort: 'SEC',
  orgUrl: 'https://home.sec.tamu.edu/',
  founded: 1939,

  // Dive #1 is played on this (local) date; every day after is the next dive number.
  launchDate: '2026-10-18',

  promptsPerDive: 7,
  secondsPerPrompt: 25,

  repeatGapDays: 5,
  repeatGapFromDive: 11,

  questionsUrl: 'data/questions.json',

  // 'api'   → answers and scores are pooled in Neon Postgres through the Vercel functions in /api.
  //           If /api is unreachable the game quietly falls back to seed counts.
  // 'local' → rarity comes only from the seed counts in questions.json; no server at all.
  backend: { type: 'api', base: '/api' },
};
