// End-of-dive screen: score, player distribution, dive log, bearing and answer recap.
import { TIERS, tierForTotal, tierForPrompt, MAX_PER_PROMPT } from './scoring.js';
import { spriteURL } from './sprites.js';
import { METERS_PER_POINT } from './scene.js';
import { CONFIG } from './config.js';

const MAX = CONFIG.promptsPerDive * MAX_PER_PROMPT;
const MIN_SCORES = 5; // no ranking until this many real divers have finished

export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
export const meters = (score) => `-${(score * METERS_PER_POINT).toLocaleString()}m`;

// Real scores only — returns null until there are enough to rank against.
export function distribution(scores, total) {
  if (!scores || scores.length < MIN_SCORES) return null;
  const xs = Array.from({ length: MAX / 5 + 1 }, (_, i) => i * 5);
  const h = Math.max(18, 1.06 * std(scores) * scores.length ** -0.2);
  return {
    xs, ys: xs.map((x) => scores.reduce((a, s) => a + Math.exp(-0.5 * ((x - s) / h) ** 2), 0)),
    pct: Math.round((100 * scores.filter((s) => s < total).length) / scores.length),
    n: scores.length,
  };
}
// Where this score lands among everyone who has played the dive (ties share a rank).
// `scores` normally already holds the player's own score; if it didn't land yet, count it in.
export function placement(scores, total) {
  if (!scores) return null;
  const all = scores.includes(total) ? scores : [...scores, total];
  return { rank: 1 + all.filter((s) => s > total).length, of: all.length };
}

function placeLine(place) {
  if (!place) return `<p class="better pending">YOUR RANK SHOWS UP WHEN YOU'RE ONLINE</p>`;
  if (place.of === 1) return `<p class="place">YOU'RE THE FIRST DIVER · <b>#1</b> OF 1</p>`;
  return `<p class="place">YOU PLACED <b>#${place.rank}</b> OF ${place.of.toLocaleString()} DIVERS</p>`;
}

function std(a) {
  const m = a.reduce((x, y) => x + y, 0) / a.length;
  return Math.sqrt(a.reduce((x, y) => x + (y - m) ** 2, 0) / a.length) || 1;
}

function curveSVG(d, total) {
  const W = 525, base = 122, top = 14;
  const sx = (v) => (v / MAX) * W;
  const peak = Math.max(...d.ys) || 1;
  const sy = (v) => base - (v / peak) * (base - top);
  const pts = d.xs.map((x, i) => `${sx(x).toFixed(1)},${sy(d.ys[i]).toFixed(1)}`);
  const you = Math.min(total, MAX);
  const yi = Math.round(you / 5);
  const youY = sy(d.ys[yi] ?? 0);
  const ticks = Array.from({ length: MAX / 100 + 1 }, (_, i) => i * 100)
    .filter((v) => Math.abs(sx(v) - sx(you)) > 22)
    .map((v) => `<text x="${sx(v)}" y="142" text-anchor="${v === 0 ? 'start' : v === MAX ? 'end' : 'middle'}">${v}</text><rect x="${sx(v) - 0.5}" y="${base - 3}" width="1" height="6" class="tick"/>`)
    .join('');
  return `<svg viewBox="0 0 ${W} 150" class="curve" role="img" aria-label="Score distribution with your score marked">
    <rect x="0" y="${base}" width="${W}" height="1" class="axis"/>
    ${ticks}
    <path d="M0,${base} L${pts.join(' L')} L${W},${base} Z" class="area"/>
    <polyline points="${pts.join(' ')}" class="line"/>
    <line x1="${sx(you)}" x2="${sx(you)}" y1="${base}" y2="${youY}" class="you-line"/>
    <circle cx="${sx(you)}" cy="${youY}" r="4" class="you-dot"/>
    <text x="${sx(you)}" y="142" text-anchor="${you < 25 ? 'start' : you > MAX - 25 ? 'end' : 'middle'}" class="you-label">YOU</text>
  </svg>`;
}

function logSVG(results) {
  const W = 525, H = 330, y0 = 34, y1 = 296, left = 64, right = 505;
  const sy = (p) => y0 + (p / MAX_PER_PROMPT) * (y1 - y0);
  const n = results.length;
  const sx = (i) => (n === 1 ? (left + right) / 2 : left + (i * (right - left)) / (n - 1));
  const grid = [0, 25, 50, 75, 100].map((p) =>
    `<line x1="40" x2="${W}" y1="${sy(p)}" y2="${sy(p)}" class="grid"/>${p ? `<text x="0" y="${sy(p) + 3}" class="lbl">-${p}</text>` : ''}`).join('');
  const cols = results.map((r, i) => {
    const t = tierForPrompt(r.points);
    const x = sx(i);
    const label = `<text x="${x}" y="${H - 6}" text-anchor="middle" class="lbl">${i + 1}</text>`;
    if (!r.points) return `${label}<image href="${spriteURL('miss', 2)}" x="${x - 5}" y="${y0 - 5}" width="10" height="10" opacity=".6"/>`;
    const y = sy(r.points);
    return `${label}
      <line x1="${x}" x2="${x}" y1="${y0 - 14}" y2="${y}" stroke="${t.color}" class="drop" style="--len:${y - y0 + 14};animation-delay:${i * 0.12}s"/>
      <image href="${spriteURL(t.id, 2)}" x="${x - 9}" y="${y - 7}" width="18" height="14" class="drop-icon" style="animation-delay:${0.5 + i * 0.12}s"/>`;
  }).join('');
  return `<svg viewBox="0 0 ${W} ${H}" class="log" role="img" aria-label="Depth reached on each prompt">${grid}${cols}</svg>`;
}

function bearingTable(tier) {
  return TIERS.map((t) => `<li class="${t.id === tier.id ? 'on' : ''}">
      <img src="${spriteURL(t.id, 2)}" alt="">
      <span class="range" style="color:${t.color}">${t.max === Infinity ? `${t.min}+` : `${t.min}–${t.max}`}</span>
      <span class="desc">${esc(t.line)}</span>
    </li>`).join('');
}

function catchList(results) {
  return results.map((r, i) => {
    const t = tierForPrompt(r.points);
    const said = r.answer
      ? `<b>${esc(r.answer)}</b>${r.input && r.input.toLowerCase() !== r.answer.toLowerCase() ? ` <i>(“${esc(r.input)}”)</i>` : ''}`
      : r.reason === 'timeout' ? 'Ran out of air' : r.reason === 'skip' ? 'Skipped' : `“${esc(r.input)}” wasn't on the chart`;
    return `<li data-i="${i}">
      <span class="num">${String(i + 1).padStart(2, '0')}</span>
      <div class="body" role="button" tabindex="0" aria-expanded="false">
        <div class="q">${esc(r.prompt)}</div>
        <div class="a">${said}</div>
        <div class="top">Most common: ${r.top.map(esc).join(' · ')}</div>
      </div>
      <span class="pts" style="color:${t.color}">${r.points ? `+${r.points}` : '0'}</span>
      <div class="chart" hidden></div>
    </li>`;
  }).join('');
}

// Tapping a catch opens every answer on that prompt, filterable by depth and searchable, like Krillion's chart.
const CHART_PAGE = 100;

function chartHTML(prompt) {
  const tiers = TIERS.filter((t) => prompt.answers.some((a) => a.tier === t.id));
  const chips = [`<button class="chip on" data-tier="all">All ${prompt.answers.length.toLocaleString()}</button>`]
    .concat(tiers.slice().reverse().map((t) => `<button class="chip" data-tier="${t.id}" style="--c:${t.color}">${esc(t.name)} ${prompt.answers.filter((a) => a.tier === t.id).length.toLocaleString()}</button>`));
  return `<div class="chips">${chips.join('')}</div>
    <input class="chart-search" type="search" placeholder="Search all answers…" aria-label="Search all answers" autocomplete="off" spellcheck="false">
    <ul class="chart-list"></ul>
    <p class="chart-foot"><span class="shown"></span><span class="more"></span></p>`;
}

function wireChart(box, prompt, r, getLive) {
  const rank = (t) => TIERS.findIndex((x) => x.id === t);
  const rows = prompt.answers
    .map((a) => ({ a, t: TIERS[rank(a.tier)], hay: [a.a, ...a.aka].join(' ').toLowerCase() }))
    .sort((x, y) => (y.a.a === r.answer) - (x.a.a === r.answer) || y.t.points - x.t.points || x.a.a.localeCompare(y.a.a));
  const list = box.querySelector('.chart-list');
  const search = box.querySelector('.chart-search');
  let tier = 'all', matches = [], shown = 0, live = {};
  const rowHTML = ({ a, t }) => {
    const you = r.answer && a.a === r.answer;
    const n = live[a.key] || 0;
    return `<li class="${you ? 'you' : ''}">
      <img src="${spriteURL(t.id, 2)}" alt="">
      <span class="nm">${esc(a.a)}${you ? ' <i>YOU</i>' : ''}${n ? `<small>${n.toLocaleString()} other ${n === 1 ? 'diver' : 'divers'} chose this</small>` : ''}</span>
      <span class="p" style="color:${t.color}">+${t.points}</span>
    </li>`;
  };
  const more = () => {
    list.insertAdjacentHTML('beforeend', matches.slice(shown, shown + CHART_PAGE).map(rowHTML).join(''));
    shown = Math.min(matches.length, shown + CHART_PAGE);
    box.querySelector('.shown').textContent = `${shown.toLocaleString()} of ${matches.length.toLocaleString()} answers`;
    box.querySelector('.more').textContent = shown < matches.length ? 'Scroll for more' : '';
  };
  const refresh = () => {
    const q = search.value.trim().toLowerCase();
    matches = rows.filter((x) => (tier === 'all' || x.a.tier === tier) && (!q || x.hay.includes(q)));
    shown = 0; list.innerHTML = ''; list.scrollTop = 0;
    if (!matches.length) { box.querySelector('.shown').textContent = 'No answers match'; box.querySelector('.more').textContent = ''; } else more();
  };
  box.querySelectorAll('.chip').forEach((c) => { c.onclick = () => { tier = c.dataset.tier; box.querySelectorAll('.chip').forEach((x) => x.classList.toggle('on', x === c)); refresh(); }; });
  search.oninput = refresh;
  list.onscroll = () => { if (shown < matches.length && list.scrollTop + list.clientHeight >= list.scrollHeight - 40) more(); };
  refresh();
  // Live tallies arrive a moment later and just add "N other divers chose this" under each answer.
  Promise.resolve(getLive()).then((l) => { if (l && Object.keys(l).length) { live = l; const top = list.scrollTop; list.innerHTML = ''; shown = 0; more(); list.scrollTop = top; } }).catch(() => {});
}

function wireCatch(el, run, bank, liveCounts) {
  const byText = new Map(Object.values(bank?.prompts || {}).map((p) => [p.prompt, p]));
  el.querySelectorAll('.catch > li').forEach((li) => {
    const r = run.results[Number(li.dataset.i)];
    const prompt = byText.get(r.prompt);
    const head = li.querySelector('.body');
    if (!prompt) { head.removeAttribute('role'); head.removeAttribute('tabindex'); head.removeAttribute('aria-expanded'); return; }
    li.classList.add('tappable');
    const box = li.querySelector('.chart');
    const toggle = () => {
      const open = li.classList.toggle('open');
      head.setAttribute('aria-expanded', String(open));
      box.hidden = !open;
      if (open && !box.dataset.ready) {
        box.dataset.ready = '1';
        box.innerHTML = chartHTML(prompt);
        wireChart(box, prompt, r, () => liveCounts?.(prompt.id).then((all) => all?.[prompt.id] || {}));
      }
    };
    head.onclick = toggle;
    li.querySelector('.pts').onclick = toggle;
    head.onkeydown = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } };
  });
}

export function renderResults(el, { run, dist, place, live, bank, liveCounts }) {
  const tier = tierForTotal(run.total);
  el.innerHTML = `
  <div class="res">
    <header class="res-head">
      <span class="mini-logo">${esc(CONFIG.name.toUpperCase())}</span>
      <span class="res-status">${esc(run.headline)}</span>
    </header>
    <div class="res-score">
      <span class="big" data-count="${run.total}">0</span>
      <span class="meters">${meters(run.total)}</span>
    </div>
    ${placeLine(place)}
    ${dist ? `<div class="dist">
      <div class="ghost-logo" aria-hidden="true">${esc(CONFIG.name.toUpperCase())}</div>
      ${curveSVG(dist, run.total)}
    </div>
    <p class="better">BETTER THAN ${dist.pct}% OF ${esc(run.audience)}</p>`
    : place ? `<p class="better pending">THE DEPTH CHART APPEARS ONCE ${MIN_SCORES} DIVERS HAVE FINISHED</p>` : ''}

    <section>
      <h3>DIVE LOG <span>DEEPER = RARER</span></h3>
      ${logSVG(run.results)}
    </section>

    <section>
      <h3>THE BEARING</h3>
      <ul class="bearing">${bearingTable(tier)}</ul>
    </section>

    <section>
      <h3>THE CATCH <span>${live ? 'LIVE COUNTS' : 'SEED COUNTS'} · TAP FOR EVERY ANSWER</span></h3>
      <ol class="catch">${catchList(run.results)}</ol>
    </section>

    <div class="res-actions">
      <button class="btn btn-wide" data-act="share">SHARE RESULT</button>
      <div class="dock-row">
        <button class="btn-sm" data-act="surface">▲ SURFACE</button>
        <button class="btn-sm" data-act="archive">ARCHIVE ◌</button>
        <button class="btn-sm" data-act="unlimited">UNLIMITED ∞</button>
      </div>
    </div>
  </div>`;

  wireCatch(el, run, bank, liveCounts);

  const big = el.querySelector('.big');
  const t0 = performance.now();
  const step = (now) => {
    const k = Math.min(1, (now - t0) / 900);
    big.textContent = Math.round(run.total * (1 - (1 - k) ** 3));
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

export function shareText(run) {
  const icons = run.results.map((r) => tierForPrompt(r.points).emoji).join('');
  const where = run.number ? `#${run.number}` : run.kind;
  return `${CONFIG.name} ${where} · ${run.total} (${meters(run.total)})\n${icons}\n${location.origin}${location.pathname}`;
}
