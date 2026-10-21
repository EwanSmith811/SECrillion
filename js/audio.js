// Tiny chiptune sound effects — no audio files.
let ctx = null;
let enabled = true;

export const setSound = (on) => { enabled = on; };

function ac() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(freq, dur = 0.08, { type = 'square', vol = 0.04, when = 0, slide = null } = {}) {
  if (!enabled) return;
  try {
    const a = ac();
    const t0 = a.currentTime + when;
    const o = a.createOscillator(), g = a.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t0);
    if (slide) o.frequency.exponentialRampToValueAtTime(slide, t0 + dur);
    g.gain.setValueAtTime(vol, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g).connect(a.destination);
    o.start(t0); o.stop(t0 + dur + 0.02);
  } catch { /* audio unavailable */ }
}

const TIER_NOTES = { plankton: [523], schooler: [523, 659], rare: [523, 659, 784], deep: [523, 659, 784, 988], trench: [523, 659, 784, 988, 1319] };

export const sfx = {
  click: () => tone(660, 0.04, { vol: 0.03 }),
  tick: () => tone(1046, 0.03, { vol: 0.025 }),
  submit: () => tone(440, 0.06, { vol: 0.03 }),
  miss: () => tone(220, 0.25, { type: 'sawtooth', vol: 0.03, slide: 110 }),
  tier: (id) => (TIER_NOTES[id] || [523]).forEach((f, i) => tone(f, 0.09, { vol: 0.035, when: i * 0.07 })),
  descend: () => tone(330, 0.7, { type: 'triangle', vol: 0.06, slide: 70 }),
  done: () => [392, 523, 659, 784, 1046].forEach((f, i) => tone(f, 0.12, { type: 'triangle', vol: 0.05, when: i * 0.09 })),
  // A long rising fanfare, a held chord and a shower of sparkles.
  secrillion: () => {
    [262, 330, 392, 523, 659, 784, 1046, 1319].forEach((f, i) => tone(f, 0.14, { vol: 0.045, when: i * 0.06 }));
    [523, 659, 784, 1046].forEach((f) => tone(f, 0.9, { type: 'triangle', vol: 0.04, when: 0.55 }));
    for (let i = 0; i < 14; i++) tone(1568 + Math.random() * 1400, 0.05, { type: 'sine', vol: 0.02, when: 0.6 + i * 0.07 });
  },
};
