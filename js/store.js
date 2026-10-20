// Where answers and scores are pooled. Swap backends in config.js.

export function createStore(config) {
  const b = config.backend || {};
  if (b.type === 'api') return apiStore(b);
  return localStore();
}

function localStore() {
  return {
    live: false,
    async liveCounts() { return {}; },
    async recordAnswer() {},
    async recordScore() {},
    async scores() { return null; },
  };
}

// Talks to the Vercel functions in /api, which sit in front of Neon Postgres.
// Any failure (e.g. a plain static server with no /api) falls back to seed counts.
function apiStore({ base = '/api' }) {
  const get = async (path) => {
    const r = await fetch(base + path);
    if (!r.ok) throw new Error(`API ${r.status}`);
    return r.json();
  };
  const post = (path, body) =>
    fetch(base + path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), keepalive: true })
      .catch((e) => console.warn('[store]', e));

  return {
    live: true,
    // → { promptId: { normalizedAnswer: count } }
    liveCounts: (ids) => get(`/counts?ids=${encodeURIComponent(ids.join(','))}`),
    recordAnswer: (dive_key, prompt_id, answer) => post('/answer', { dive_key, prompt_id, answer }),
    recordScore: (dive_key, score, name) => post('/score', { dive_key, score, name: name || null }),
    // → [{ score, name }]
    scores: (dive_key) => get(`/scores?dive=${encodeURIComponent(dive_key)}`),
  };
}
