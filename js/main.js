import { CONFIG } from './config.js';
import { Scene, METERS_PER_POINT } from './scene.js';
import { renderKrill, krillURL, spriteURL, SKINS } from './sprites.js';
import { findAnswer, matchAnswer, pointsFor, tierForPrompt } from './scoring.js';
import { createStore } from './store.js';
import { loadBank, diveNumberFor, dateForDive, dailyIds, pick } from './bank.js';
import { renderResults, distribution, shareText, esc, meters } from './results.js';
import { sfx, setSound } from './audio.js';

const $ = (s, root = document) => root.querySelector(s);
const SECS = CONFIG.secondsPerPrompt;

// ---------- persistence (per browser) ----------
const load = (k, fallback) => { try { return JSON.parse(localStorage.getItem('secr:' + k)) ?? fallback; } catch { return fallback; } };
const save = (k, v) => { try { localStorage.setItem('secr:' + k, JSON.stringify(v)); } catch { /* private mode */ } };

const prefs = load('prefs', { sound: true, reduced: false, relaxed: false, skin: 'classic', name: '' });
const history = load('history', {});   // numbered daily dives, keyed dive-N
const plays = load('plays', []);       // every finished dive: { date, total, kind, number }

const store = createStore(CONFIG);
const scene = new Scene($('#scene'));
let bank, dive = null, timer = null;
const today = diveNumberFor();

const withTimeout = (p, ms, fallback) =>
  Promise.race([p, new Promise((r) => setTimeout(() => r(fallback), ms))]).catch(() => fallback);
const pad = (n) => String(n).padStart(2, '0');
const fmtDate = (d) => d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

// ---------- screens ----------
function show(mode) {
  document.body.dataset.mode = mode;
  document.querySelectorAll('.screen').forEach((s) => s.classList.toggle('active', s.id === `screen-${mode}`));
  scene.setMode(mode);
}

// A saved log only counts if it was played on the dive's current questions,
// so a schedule change shows the new questions instead of an old result.
function saved(n) {
  const h = history[`dive-${n}`];
  if (!h || !bank) return h;
  const now = dailyIds(bank, n).map((id) => bank.prompts[id].prompt).join('|');
  return h.results.map((r) => r.prompt).join('|') === now ? h : null;
}

function refreshTitle() {
  $('#diveNo').textContent = `DIVE #${today}`;
  $('#beginBtn .label').textContent = saved(today) ? "VIEW TODAY'S LOG" : 'BEGIN DESCENT';
}

function applyPrefs() {
  setSound(prefs.sound);
  $('#soundBtn').classList.toggle('muted', !prefs.sound);
  $('#soundBtn').setAttribute('aria-label', prefs.sound ? 'Mute sound' : 'Unmute sound');
  document.body.classList.toggle('reduced', prefs.reduced);
  scene.reduced = prefs.reduced;
  renderKrill($('#krill'), prefs.skin);
  save('prefs', prefs);
}

// ---------- dive specs ----------
function dailySpec(n) {
  return {
    kind: n === today ? 'daily' : 'archive', number: n, key: `dive-${n}`, ids: dailyIds(bank, n),
    headline: `DIVE #${n} COMPLETE`, audience: n === today ? "TODAY'S PLAYERS" : `DIVE #${n} PLAYERS`,
  };
}
const unlimitedSpec = () => ({
  kind: 'unlimited', key: 'unlimited', ids: pick(bank.pool, CONFIG.promptsPerDive, Math.random() * 1e9 | 0),
  headline: 'UNLIMITED DIVE COMPLETE', audience: 'UNLIMITED DIVERS',
});
const packSpec = (p) => ({
  kind: 'pack', key: `pack-${p.id}`, ids: pick(p.prompts.filter((id) => bank.prompts[id]), CONFIG.promptsPerDive, Math.random() * 1e9 | 0, bank.ids),
  headline: `${p.name.toUpperCase()} COMPLETE`, audience: `${p.name.toUpperCase()} DIVERS`,
});
const partySpec = (code, name) => ({
  kind: 'party', key: `party-${code}`, ids: pick(bank.pool, CONFIG.promptsPerDive, `party-${code}`), name,
  headline: `PARTY ${code} COMPLETE`, audience: 'YOUR PARTY',
});

// ---------- the dive ----------
async function startDive(spec) {
  sfx.descend();
  const prompts = spec.ids.map((id) => bank.prompts[id]).filter(Boolean);
  dive = { spec, prompts, i: 0, results: [], total: 0, counts: {}, phase: 'loading' };
  show('dive');
  scene.diveTo(0);
  $('#hudDepth').textContent = '0m';
  $('#promptText').textContent = 'Descending…';
  $('#feedback').hidden = true;
  renderPips();
  const live = await withTimeout(store.liveCounts(spec.ids), 2500, {});
  for (const p of prompts) dive.counts[p.id] = p.answers.map((a) => a.n + (live[p.id]?.[a.key] || 0));
  showPrompt();
}

function renderPips() {
  $('#pips').innerHTML = dive.prompts.map((_, i) => {
    const r = dive.results[i];
    const cls = r ? 'done' : i === dive.i ? 'now' : '';
    return `<span class="pip ${cls}">${r ? `<img src="${spriteURL(tierForPrompt(r.points).id, 2)}" alt="">` : i + 1}</span>`;
  }).join('');
}

function showPrompt() {
  const p = dive.prompts[dive.i];
  dive.phase = 'answering';
  $('#promptLabel').textContent = `PROMPT ${pad(dive.i + 1)}`;
  $('#hudCount').textContent = `${dive.i + 1} / ${dive.prompts.length}`;
  $('#promptText').textContent = p.prompt;
  $('#feedback').hidden = true;
  $('#tryAgain').hidden = true;
  $('#answerForm').hidden = false;
  $('#skipBtn').hidden = false;
  const input = $('#answerInput');
  input.value = '';
  input.disabled = false;
  input.focus();
  renderPips();
  startTimer();
}

function startTimer() {
  stopTimer();
  const wrap = $('#timer'), bar = $('#timerBar'), num = $('#timerNum');
  wrap.hidden = prefs.relaxed;
  if (prefs.relaxed) return;
  const end = performance.now() + SECS * 1000;
  let shown = SECS;
  num.textContent = SECS;
  bar.style.width = '100%';
  bar.classList.remove('low');
  timer = setInterval(() => {
    const left = Math.max(0, (end - performance.now()) / 1000);
    bar.style.width = `${(left / SECS) * 100}%`;
    bar.classList.toggle('low', left <= 5);
    const s = Math.ceil(left);
    if (s !== shown) { shown = s; num.textContent = s; if (s > 0 && s <= 5) sfx.tick(); }
    if (left <= 0) resolve(null, 'timeout');
  }, 50);
}
const stopTimer = () => { clearInterval(timer); timer = null; };

// Close to a listed answer: put it in the box so Enter confirms it, or they can keep typing.
function suggest(v, answer) {
  const msg = $('#tryAgain');
  msg.innerHTML = `“${esc(v)}” isn't on the list. Did you mean <b>${esc(answer)}</b>? Press Enter to dive with it.`;
  msg.classList.add('suggest');
  msg.hidden = false;
  const input = $('#answerInput');
  input.value = answer;
  input.focus();
  input.select();
}

// Not on the list: say so and let them try again while the clock keeps running.
function reject(v) {
  sfx.miss();
  const msg = $('#tryAgain');
  msg.textContent = `“${v}” isn't on the list. Try again.`;
  msg.classList.remove('suggest');
  msg.hidden = false;
  const input = $('#answerInput');
  input.value = '';
  input.classList.remove('shake'); void input.offsetWidth; input.classList.add('shake');
  input.focus();
}

function topAnswers(p, counts, k = 3) {
  return counts.map((c, i) => [c, i]).sort((a, b) => b[0] - a[0]).slice(0, k).map(([, i]) => p.answers[i].a);
}

function resolve(raw, reason) {
  if (!dive || dive.phase !== 'answering') return;
  stopTimer();
  dive.phase = 'feedback';
  const p = dive.prompts[dive.i];
  const counts = dive.counts[p.id];
  const r = { id: p.id, prompt: p.prompt, input: raw || '', answer: null, points: 0, reason };
  if (raw) {
    const i = matchAnswer(p, raw);
    if (i >= 0) {
      r.answer = p.answers[i].a;
      r.points = pointsFor(counts, i);
      r.reason = 'ok';
      store.recordAnswer(dive.spec.key, p.id, p.answers[i].key);
      counts[i]++;
    } else r.reason = 'unknown';
  }
  r.top = topAnswers(p, counts);
  dive.results.push(r);
  dive.total += r.points;
  showFeedback(r);
  scene.diveTo(dive.total);
  $('#hudDepth').textContent = meters(dive.total);
  $('#krill').classList.remove('dip'); void $('#krill').offsetWidth; $('#krill').classList.add('dip');
  renderPips();
}

function showFeedback(r) {
  const t = tierForPrompt(r.points);
  const fb = $('#feedback');
  $('#answerForm').hidden = true;
  $('#tryAgain').hidden = true;
  $('#skipBtn').hidden = true;
  $('#timer').hidden = true;
  const head = r.points ? `${t.name.toUpperCase()} <b>+${r.points}</b>` : r.reason === 'timeout' ? "TIME'S UP" : r.reason === 'skip' ? 'SKIPPED' : 'NOT ON THE CHART';
  const detail = r.points
    ? `<b>${esc(r.answer)}</b> — on the list.`
    : r.reason === 'unknown' ? `We couldn't find “${esc(r.input)}” on the chart.` : 'No answer, no depth.';
  fb.innerHTML = `
    <div class="fb-head" style="color:${t.color}"><img src="${spriteURL(t.id, 3)}" alt=""> ${head}</div>
    <div class="fb-detail">${detail}</div>
    <div class="fb-top">Most common: ${r.top.map(esc).join(' · ')}</div>
    <button class="btn btn-next" id="nextBtn">${dive.i + 1 < dive.prompts.length ? 'NEXT ▼' : 'SURFACE THE LOG ▲'}</button>`;
  fb.hidden = false;
  r.points ? sfx.tier(t.id) : sfx.miss();
  $('#nextBtn').onclick = next;
  $('#nextBtn').focus();
}

function next() {
  if (!dive || dive.phase !== 'feedback') return;
  sfx.click();
  dive.i++;
  if (dive.i < dive.prompts.length) showPrompt();
  else finish();
}

async function finish() {
  const { spec } = dive;
  dive.phase = 'done';
  const run = {
    ...spec, ids: undefined, total: dive.total, date: new Date().toISOString(),
    results: dive.results.map(({ prompt, input, answer, points, reason, top }) => ({ prompt, input, answer, points, reason, top })),
  };
  if (spec.number) { history[spec.key] = run; save('history', history); }
  plays.push({ date: run.date, total: run.total, kind: spec.kind, number: spec.number });
  save('plays', plays);
  await withTimeout(store.recordScore(spec.key, run.total, spec.name), 2000);
  dive = null;
  showResults(run, true);
}

async function showResults(run, fresh = false) {
  show('results');
  const el = $('#screen-results');
  el.innerHTML = '<p class="loading">SURFACING…</p>';
  el.scrollTop = 0;
  const rows = await withTimeout(store.scores(run.key), 3000, null);
  const dist = distribution(rows?.map((r) => r.score), run.total);
  let board = null;
  if (run.kind === 'party' && rows) {
    board = rows.filter((r) => r.name).sort((a, b) => b.score - a.score).slice(0, 25)
      .map((r) => ({ ...r, me: r.name === run.name && r.score === run.total }));
  }
  renderResults(el, { run, dist, board, live: store.live });
  if (fresh) sfx.done();
  el.querySelector('[data-act="share"]').onclick = async (e) => {
    const text = shareText(run);
    try {
      if (navigator.share && matchMedia('(pointer: coarse)').matches) await navigator.share({ text });
      else { await navigator.clipboard.writeText(text); e.target.textContent = 'COPIED TO CLIPBOARD'; }
    } catch { /* cancelled */ }
  };
  el.querySelector('[data-act="surface"]').onclick = surface;
  el.querySelector('[data-act="archive"]').onclick = openArchive;
  el.querySelector('[data-act="unlimited"]').onclick = () => startDive(unlimitedSpec());
}

function surface() {
  stopTimer();
  dive = null;
  sfx.click();
  show('title');
  refreshTitle();
}

// ---------- modals ----------
const modal = $('#modal');
function openModal(title, html, mount) {
  $('.modal-title', modal).textContent = title;
  const body = $('.modal-body', modal);
  body.innerHTML = html;
  mount?.(body);
  if (!modal.open) modal.showModal();
}
modal.addEventListener('click', (e) => { if (e.target === modal) modal.close(); });
$('.modal-close', modal).onclick = () => modal.close();

function openArchive() {
  const items = [];
  for (let n = today - 1; n >= 1; n--) {
    const h = saved(n);
    items.push(`<button class="list-item" data-n="${n}">
      <span>DIVE #${n}</span><span class="dim">${fmtDate(dateForDive(n))}</span>
      <span class="right">${h ? `${h.total} · ${meters(h.total)}` : 'PLAY ▼'}</span></button>`);
  }
  openModal('ARCHIVE', items.length ? `<div class="list">${items.join('')}</div>` : `<p>No past dives yet — Dive #${today} is the first one. Come back tomorrow.</p>`, (body) => {
    body.querySelectorAll('[data-n]').forEach((b) => (b.onclick = () => {
      modal.close();
      const n = Number(b.dataset.n), h = saved(n);
      h ? showResults(h) : startDive(dailySpec(n));
    }));
  });
}

function openPacks() {
  openModal('THEMED PACKS', `<div class="list">${bank.packs.map((p, i) => `
    <button class="list-item tall" data-i="${i}">
      <span>${esc(p.name.toUpperCase())}</span>
      <span class="dim">${esc(p.blurb || '')}</span>
      <span class="right">PLAY ▼</span>
    </button>`).join('')}</div>`, (body) => {
    body.querySelectorAll('[data-i]').forEach((b) => (b.onclick = () => { modal.close(); startDive(packSpec(bank.packs[b.dataset.i])); }));
  });
}

function openParty(prefill = '') {
  openModal('PUFFER PARTY', `
    <p>Everyone with the same code gets the same 7 prompts. ${store.live ? 'Scores land on a shared party board.' : 'Compare scores by sharing your result.'}</p>
    <label class="field"><span>YOUR NAME</span><input id="pName" maxlength="20" value="${esc(prefs.name)}" placeholder="Reveille"></label>
    <label class="field"><span>PARTY CODE</span><input id="pCode" maxlength="6" value="${esc(prefill)}" placeholder="ABC123" style="text-transform:uppercase"></label>
    <div class="row">
      <button class="btn btn-sm2" id="pJoin">JOIN ▼</button>
      <button class="btn btn-sm2" id="pHost">HOST NEW</button>
    </div>
    <p class="dim" id="pLink"></p>`, (body) => {
    const go = (code) => {
      prefs.name = $('#pName', body).value.trim().slice(0, 20);
      save('prefs', prefs);
      modal.close();
      startDive(partySpec(code, prefs.name));
    };
    $('#pJoin', body).onclick = () => {
      const code = $('#pCode', body).value.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
      if (code.length >= 4) go(code); else $('#pCode', body).focus();
    };
    $('#pHost', body).onclick = () => {
      const code = Array.from({ length: 6 }, () => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[Math.random() * 32 | 0]).join('');
      $('#pCode', body).value = code;
      const link = `${location.origin}${location.pathname}?party=${code}`;
      navigator.clipboard?.writeText(link).catch(() => {});
      $('#pLink', body).innerHTML = `Invite link copied: <code>${esc(link)}</code><br>Press JOIN when you're ready to dive.`;
    };
  });
}

function openSettings() {
  const toggle = (id, label, on, hint) => `<label class="toggle"><input type="checkbox" id="${id}" ${on ? 'checked' : ''}><span class="box"></span><span>${label}<small>${hint}</small></span></label>`;
  openModal('SETTINGS', `
    ${toggle('sSound', 'SOUND EFFECTS', prefs.sound, 'Chiptune blips and chimes.')}
    ${toggle('sReduced', 'REDUCED MOTION', prefs.reduced, 'Calmer waves, no glitching or scanline flicker.')}
    ${toggle('sRelaxed', 'RELAXED MODE', prefs.relaxed, `No ${SECS}-second timer.`)}
    <hr><button class="link-btn" id="sReset">Reset local stats and history</button>`, (body) => {
    $('#sSound', body).onchange = (e) => { prefs.sound = e.target.checked; applyPrefs(); };
    $('#sReduced', body).onchange = (e) => { prefs.reduced = e.target.checked; applyPrefs(); };
    $('#sRelaxed', body).onchange = (e) => { prefs.relaxed = e.target.checked; applyPrefs(); };
    $('#sReset', body).onclick = () => {
      if (!confirm('Erase your scores and history on this device?')) return;
      Object.keys(history).forEach((k) => delete history[k]);
      plays.length = 0;
      save('history', history); save('plays', plays);
      refreshTitle(); modal.close();
    };
  });
}

function openSkins() {
  openModal('WARDROBE', `<div class="skins">${Object.entries(SKINS).map(([id, s]) => `
    <button class="skin ${id === prefs.skin ? 'on' : ''}" data-skin="${id}">
      <img src="${krillURL(id, 4)}" alt=""><span>${esc(s.name.toUpperCase())}</span>
    </button>`).join('')}</div>`, (body) => {
    body.querySelectorAll('[data-skin]').forEach((b) => (b.onclick = () => {
      prefs.skin = b.dataset.skin;
      applyPrefs();
      body.querySelectorAll('.skin').forEach((x) => x.classList.toggle('on', x === b));
      sfx.click();
    }));
  });
}

function stats() {
  const totals = plays.map((p) => p.total);
  let streak = 0;
  for (let n = today; history[`dive-${n}`] || (n === today && streak === 0 && history[`dive-${n - 1}`]); n--) {
    if (history[`dive-${n}`]) streak++;
  }
  return {
    played: plays.length,
    best: totals.length ? Math.max(...totals) : 0,
    avg: totals.length ? Math.round(totals.reduce((a, b) => a + b, 0) / totals.length) : 0,
    streak,
  };
}

const HOWTO = `
  <ol class="rules">
    <li>Each dive is <b>${CONFIG.promptsPerDive} prompts</b>, like “Name an Aggie tradition.”</li>
    <li>You get <b>${SECS} seconds</b> per prompt. Type any answer that fits and press Enter.</li>
    <li><b>Rarer answers sink deeper.</b> The answer everyone gives scores 10. A valid answer nobody else thought of scores up to 100.</li>
    <li>If an answer isn't on the list, you'll be told and can try again until time runs out. Small typos are forgiven.</li>
    <li>Max depth is ${CONFIG.promptsPerDive * 100} (${meters(CONFIG.promptsPerDive * 100)}). A new dive drops every midnight.</li>
  </ol>`;

function openMenu() {
  const s = stats();
  const d = $('#drawer');
  $('.drawer-stats', d).innerHTML = [['PLAYED', s.played], ['AVG', s.avg], ['BEST', s.best], ['STREAK', s.streak]]
    .map(([k, v]) => `<div><b>${v}</b><span>${k}</span></div>`).join('');
  $('[data-go="abandon"]', d).hidden = !dive;
  d.showModal();
}

const PRIVACY = `<p>${esc(CONFIG.name)} has no accounts. Your scores, history and settings stay in this browser's local storage.</p>
  <p>${store.live ? 'To work out how rare each answer is, we keep an anonymous tally of which listed answers people give, plus each final score (with the party name you choose, if you join a Puffer Party). What you type is never stored as-is.' : 'In this build nothing you type leaves your device.'}</p>`;

const ABOUT = `<p><b>${esc(CONFIG.name)}</b> is the daily dive from the ${esc(CONFIG.org)}.</p>
  <p>Since ${CONFIG.founded}, SEC has been the voice of engineering students at Texas A&amp;M. It works with the College of Engineering, raises engineering awareness, and helps students grow professionally.</p>
  <ul class="rules">
    <li><b>Development:</b> Career Fair, Corporate Relations, Engineering Development, Finance, ProTrip</li>
    <li><b>External:</b> Engineering Activities, EnVision Conference, Philanthropy, Special Events</li>
    <li><b>Internal:</b> Legislation, Student Relations, Society and Graduate Relations</li>
    <li><b>Operations:</b> Systems Administration, Internal Relations, Membership, Marketing</li>
  </ul>
  <p><a href="${esc(CONFIG.orgUrl)}" target="_blank" rel="noopener">Visit the Student Engineers' Council ↗</a></p>
  <p class="dim">Inspired by <a href="https://krillion.io" target="_blank" rel="noopener">Krillion</a>. Gig 'em, and dive deep.</p>`;

// ---------- wiring ----------
function bind() {
  $('#beginBtn').onclick = () => {
    const h = saved(today);
    h ? showResults(h) : startDive(dailySpec(today));
  };
  $('#archiveBtn').onclick = openArchive;
  $('#packsBtn').onclick = openPacks;
  $('#unlimitedBtn').onclick = () => startDive(unlimitedSpec());
  $('#partyBtn').onclick = () => openParty();
  $('#privacyLink').onclick = (e) => { e.preventDefault(); openModal('PRIVACY', PRIVACY); };
  $('#settingsBtn').onclick = openSettings;
  $('#skinBtn').onclick = openSkins;
  $('#soundBtn').onclick = () => { prefs.sound = !prefs.sound; applyPrefs(); sfx.click(); };
  $('#menuBtn').onclick = openMenu;

  $('#answerForm').onsubmit = (e) => {
    e.preventDefault();
    const input = $('#answerInput');
    const v = input.value.trim();
    if (!v || dive?.phase !== 'answering') { input.focus(); return; }
    const p = dive.prompts[dive.i];
    const m = findAnswer(p, v);
    if (m.i < 0) return reject(v);
    if (!m.exact) return suggest(v, p.answers[m.i].a);
    sfx.submit();
    resolve(v, 'ok');
  };
  $('#skipBtn').onclick = () => resolve(null, 'skip');
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && dive?.phase === 'feedback' && document.activeElement?.id !== 'nextBtn' && !modal.open) { e.preventDefault(); next(); }
  });

  const drawer = $('#drawer');
  drawer.addEventListener('click', (e) => {
    if (e.target === drawer) return drawer.close();
    const go = e.target.closest('[data-go]')?.dataset.go;
    if (!go) return;
    drawer.close();
    if (go === 'abandon') { if (confirm('Abandon this dive? It won\'t be scored.')) surface(); return; }
    if (dive && !confirm('Leave your current dive? It won\'t be scored.')) return;
    if (dive) { stopTimer(); dive = null; }
    ({
      daily: () => { const h = saved(today); h ? showResults(h) : startDive(dailySpec(today)); },
      unlimited: () => startDive(unlimitedSpec()),
      party: () => { surface(); openParty(); },
      packs: () => { surface(); openPacks(); },
      archive: () => { surface(); openArchive(); },
      howto: () => openModal('HOW TO PLAY', HOWTO),
      about: () => openModal('ABOUT', ABOUT),
      privacy: () => openModal('PRIVACY', PRIVACY),
    })[go]?.();
  });
}

async function init() {
  $('#howtoBody').innerHTML = HOWTO;
  $('#partyBtn img').src = spriteURL('puffer', 3);
  applyPrefs();
  bind();
  show('title');
  refreshTitle();
  try {
    bank = await loadBank();
  } catch (e) {
    console.error(e);
    $('#beginBtn .label').textContent = 'COULD NOT LOAD QUESTIONS';
    $('#beginBtn').disabled = true;
    return;
  }
  refreshTitle();
  const party = new URLSearchParams(location.search).get('party');
  if (party) openParty(party.toUpperCase().slice(0, 6));
}

init();
