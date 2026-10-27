import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { PROMPTS, SKYRA, SOURCES, TRADITIONAL, TRAD_MEAN, ZERO_SHOT } from '@/data/results';
import { asset, useInView } from '@/lib/hooks';

const ease = [0.16, 1, 0.3, 1] as const;
const mean = (a: number[]) => a.reduce((x, y) => x + y, 0) / a.length;

/* ------------------------------------------------------------------ traditional detectors */

/** Table 2: each detector's public-reference AUC falls to its RA-Bench value; pick a generator to see it alone */
export function DetectorDrop({ compact = false }: { compact?: boolean }) {
  const [ref, on] = useInView<HTMLDivElement>();
  const [src, setSrc] = useState<number | null>(null);
  const W = compact ? 360 : 760;
  const L = compact ? 78 : 150, R = compact ? 330 : 690;
  const rowH = compact ? 38 : 44;
  const H = 52 + TRADITIONAL.length * rowH + rowH + 30;
  const x = (v: number) => L + ((v - 20) / 80) * (R - L);
  const rows = [...TRADITIONAL.map((d) => ({ name: d.name, ref: d.ref, auc: d.auc })), { name: '7-det. mean', ref: TRAD_MEAN.ref, auc: TRAD_MEAN.auc }];
  return (
    <div ref={ref}>
      <div className="mb-4 flex flex-wrap gap-1.5">
        <Chip on={src === null} onClick={() => setSrc(null)}>Mean of 9 generators</Chip>
        {SOURCES.map((s, i) => (
          <Chip key={s.key} on={src === i} onClick={() => setSrc(i)} tone={s.family}>
            {compact ? s.short : s.name}
          </Chip>
        ))}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible">
        {/* axis */}
        {[20, 40, 60, 80, 100].map((t) => (
          <g key={t}>
            <line x1={x(t)} x2={x(t)} y1={34} y2={H - 26} stroke="var(--rule-2)" />
            <text x={x(t)} y={H - 8} textAnchor="middle" className="fill-[var(--ink-3)] font-mono text-[10px]">{t}</text>
          </g>
        ))}
        <line x1={x(50)} x2={x(50)} y1={26} y2={H - 26} stroke="var(--fake)" strokeDasharray="3 4" strokeWidth={1.2} />
        <text x={x(50) + 6} y={30} className="fill-[var(--fake)] font-mono text-[10px] tracking-wider">50% = CHANCE</text>
        <text x={R} y={14} textAnchor="end" className="fill-[var(--ink-3)] font-mono text-[10px] tracking-wider">PAIRED AUC (%)</text>
        {rows.map((d, i) => {
          const y = 56 + i * rowH + (i === rows.length - 1 ? 10 : 0);
          const now = src === null ? mean(d.auc) : d.auc[src];
          const isMean = i === rows.length - 1;
          return (
            <g key={d.name}>
              {isMean && <line x1={0} x2={R + 40} y1={y - rowH / 2 - 1} y2={y - rowH / 2 - 1} stroke="var(--ink)" strokeWidth={0.8} />}
              <text x={0} y={y + 4} className={`fill-[var(--ink)] ${isMean ? 'font-semibold' : ''} text-[${compact ? 11 : 13}px]`} style={{ fontSize: compact ? 11 : 13 }}>{d.name}</text>
              {/* per-source dots */}
              {d.auc.map((v, k) => (
                <motion.circle key={k} cy={y} r={src === k ? 0 : 2.6} fill={SOURCES[k].family === 'closed' ? 'var(--fake)' : 'var(--ink-3)'} initial={{ cx: x(d.ref), opacity: 0 }} animate={on ? { cx: x(v), opacity: src === null ? 0.45 : 0.18 } : {}} transition={{ duration: 1.1, delay: 0.6 + i * 0.06, ease }} />
              ))}
              {/* the drop */}
              <motion.line y1={y} y2={y} x1={x(d.ref)} stroke="var(--ink)" strokeWidth={1.4} initial={{ x2: x(d.ref) }} animate={on ? { x2: x(now) } : {}} transition={{ duration: 1.2, delay: 0.35 + i * 0.07, ease }} />
              <circle cx={x(d.ref)} cy={y} r={6} fill="var(--paper)" stroke="var(--ink)" strokeWidth={1.5} />
              <motion.circle cy={y} r={7} fill={now < 50 ? 'var(--fake)' : 'var(--ink)'} initial={{ cx: x(d.ref) }} animate={on ? { cx: x(now) } : {}} transition={{ duration: 1.2, delay: 0.35 + i * 0.07, ease }} />
              <motion.text y={y - 12} textAnchor="middle" className="tnum font-mono" style={{ fontSize: 10.5, fill: now < 50 ? 'var(--fake)' : 'var(--ink)' }} initial={{ x: x(d.ref), opacity: 0 }} animate={on ? { x: x(now), opacity: 1 } : {}} transition={{ duration: 1.2, delay: 0.35 + i * 0.07, ease }}>
                {now.toFixed(1)}
              </motion.text>
              <text x={x(d.ref)} y={y - 12} textAnchor="middle" className="tnum fill-[var(--ink-3)] font-mono" style={{ fontSize: 10 }}>{d.ref}</text>
              {!compact && (
                <text x={R + 40} y={y + 4} textAnchor="end" className="tnum font-mono" style={{ fontSize: 11, fill: 'var(--ink-2)' }}>
                  {(now - d.ref).toFixed(1)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[10.5px] tracking-[0.08em] text-ink-3 uppercase">
        <span className="flex items-center gap-1.5"><svg width="12" height="12"><circle cx="6" cy="6" r="4.5" fill="none" stroke="var(--ink)" strokeWidth="1.5" /></svg>public reference</span>
        <span className="flex items-center gap-1.5"><svg width="12" height="12"><circle cx="6" cy="6" r="5" fill="var(--ink)" /></svg>on RA-Bench</span>
        <span className="flex items-center gap-1.5"><svg width="12" height="12"><circle cx="6" cy="6" r="3" fill="var(--ink-3)" /></svg>open / <svg width="12" height="12"><circle cx="6" cy="6" r="3" fill="var(--fake)" /></svg>closed generators</span>
      </div>
    </div>
  );
}

export function Chip({ on, onClick, children, tone }: { on: boolean; onClick: () => void; children: React.ReactNode; tone?: 'open' | 'closed' }) {
  return (
    <button onClick={onClick} className={`h-8 rounded-full border px-3 font-mono text-[11px] tracking-[0.04em] transition-all ${on ? 'border-ink bg-ink text-paper' : 'border-rule text-ink-2 hover:border-ink'}`}>
      {tone && <span className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full align-middle ${tone === 'closed' ? 'bg-fake' : 'bg-ink-3'}`} />}
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ zero-shot prompt roulette */

/** Figure 15: every zero-shot model as a point (real recall, fake recall); switching the prompt moves them */
export function PromptRoulette({ compact = false }: { compact?: boolean }) {
  const [ref, on] = useInView<HTMLDivElement>({ margin: '0px 0px -25% 0px' });
  const [p, setP] = useState(0);
  const [touched, setTouched] = useState(false);
  const [hot, setHot] = useState<string | null>('Qwen3.5-0.8B');
  // play through the three prompts once when the figure arrives, then hand over to the visitor
  useEffect(() => {
    if (!on || touched) return;
    let k = 0;
    const t = window.setInterval(() => {
      k += 1;
      if (k > 3) return window.clearInterval(t);
      setP(k % 3);
    }, 1700);
    return () => window.clearInterval(t);
  }, [on, touched]);
  const S = compact ? 320 : 460, pad = 40;
  const X = (r: number) => pad + (r / 100) * (S - pad * 1.5);
  const Y = (f: number) => S - pad - (f / 100) * (S - pad * 1.5);
  const color = (g: string, name: string) => (name === hot ? 'var(--fake)' : name.startsWith('Gemini') ? 'var(--teal)' : g === 'dense' ? 'var(--ink-3)' : 'var(--ink)');
  const labelled = ['Gemini-3.1-Pro', 'GPT-5.5'];
  return (
    <div ref={ref} className={compact ? '' : 'grid items-start gap-8 lg:grid-cols-[auto_1fr]'}>
      <div>
        <div className="mb-3 flex gap-1.5">
          {PROMPTS.map((name, i) => (
            <Chip key={name} on={p === i} onClick={() => { setTouched(true); setP(i); }}>
              {name} prompt
            </Chip>
          ))}
        </div>
        <svg viewBox={`0 0 ${S} ${S}`} style={{ width: S, maxWidth: '100%' }} className="overflow-visible">
          <rect x={X(0)} y={Y(100)} width={X(100) - X(0)} height={Y(0) - Y(100)} fill="var(--card)" stroke="var(--rule)" />
          {/* better than chance: the triangle above the diagonal */}
          <path d={`M${X(0)},${Y(100)} L${X(100)},${Y(100)} L${X(100)},${Y(0)} Z`} fill="color-mix(in oklab, var(--teal) 7%, transparent)" />
          <line x1={X(0)} y1={Y(100)} x2={X(100)} y2={Y(0)} stroke="var(--fake)" strokeDasharray="4 4" />
          <text transform={`translate(${X(50) + 8},${Y(50) - 8}) rotate(45)`} className="fill-[var(--fake)] font-mono text-[9.5px] tracking-wider">BAcc 50% · CHANCE</text>
          <text x={X(99)} y={Y(97)} textAnchor="end" className="fill-[var(--teal)] font-mono text-[9.5px] tracking-wider">PERFECT ↗</text>
          <text x={X(1.5)} y={Y(96)} className="fill-[var(--ink-3)] font-mono text-[9.5px] tracking-wider">CALLS ALL FAKE</text>
          <text x={X(98.5)} y={Y(3)} textAnchor="end" className="fill-[var(--ink-3)] font-mono text-[9.5px] tracking-wider">CALLS ALL REAL</text>
          {[0, 50, 100].map((t) => (
            <g key={t}>
              <text x={X(t)} y={S - pad + 16} textAnchor="middle" className="fill-[var(--ink-3)] font-mono text-[10px]">{t}</text>
              <text x={pad - 10} y={Y(t) + 3} textAnchor="end" className="fill-[var(--ink-3)] font-mono text-[10px]">{t}</text>
            </g>
          ))}
          <text x={X(50)} y={S - 4} textAnchor="middle" className="fill-[var(--ink-2)] font-mono text-[10px] tracking-wider">REAL RECALL (%) →</text>
          <text transform={`translate(10,${Y(50)}) rotate(-90)`} textAnchor="middle" className="fill-[var(--ink-2)] font-mono text-[10px] tracking-wider">FAKE RECALL (%) →</text>
          {/* trails: where each model sits under the three prompts */}
          {ZERO_SHOT.map((m) => (
            <polyline key={m.name} points={m.fakeR.map((f, k) => `${X(m.realR[k])},${Y(f)}`).join(' ')} fill="none" stroke={m.name === hot ? 'var(--fake)' : 'var(--ink-4)'} strokeOpacity={m.name === hot ? 0.8 : 0.18} strokeWidth={m.name === hot ? 1.5 : 1} strokeDasharray={m.name === hot ? '0' : '2 3'} />
          ))}
          {ZERO_SHOT.map((m) => (
            <g key={m.name} onMouseEnter={() => setHot(m.name)} className="cursor-pointer">
              <motion.circle r={m.name === hot ? 9 : 6.5} fill={color(m.group, m.name)} stroke="var(--paper)" strokeWidth={2} initial={false} animate={{ cx: X(m.realR[p]), cy: Y(m.fakeR[p]) }} transition={{ type: 'spring', stiffness: 90, damping: 15 }} />
              {(labelled.includes(m.name) || m.name === hot) && (
                <motion.text initial={false} animate={{ x: X(m.realR[p]) + (m.realR[p] > 70 ? -12 : 12), y: Y(m.fakeR[p]) + 4 }} transition={{ type: 'spring', stiffness: 90, damping: 15 }} textAnchor={m.realR[p] > 70 ? 'end' : 'start'} className="font-mono" style={{ fontSize: 10.5, fill: m.name === hot ? 'var(--fake)' : 'var(--ink-2)', fontWeight: m.name === hot ? 600 : 400 }}>
                  {m.name}
                </motion.text>
              )}
            </g>
          ))}
        </svg>
      </div>
      {!compact && (
        <div className="space-y-5 pt-12">
          <Callout n="19.7 → 97.8 → 100" unit="% fake recall" title="Qwen3.5-0.8B">Same frames, same task. Only the wording of the prompt changed.</Callout>
          <Callout n="85.2 → 5.5" unit="% fake recall" title="Qwen3.5-4B">Moves the opposite way between Binary and Diagnostic.</Callout>
          <Callout n="≥ 51.8" unit="% under every prompt" title="Gemini-3.1-Pro" tone="teal">The most stable and the strongest — and still only about 63% balanced accuracy.</Callout>
          <Callout n="2.9 – 4.4" unit="% fake recall" title="GPT-5.5">Stable too, because it calls more than 99% of videos real.</Callout>
          <p className="text-[12.5px] text-ink-3">Hover a point to follow one model across prompts.</p>
        </div>
      )}
    </div>
  );
}

function Callout({ n, unit, title, children, tone }: { n: string; unit: string; title: string; children: React.ReactNode; tone?: 'teal' }) {
  return (
    <div className="border-l-2 pl-4" style={{ borderColor: tone === 'teal' ? 'var(--teal)' : 'var(--rule)' }}>
      <div className="kicker">{title}</div>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="font-display tnum text-[28px] leading-none" style={{ color: tone === 'teal' ? 'var(--teal)' : undefined }}>{n}</span>
        <span className="font-mono text-[11px] text-ink-3">{unit}</span>
      </div>
      <p className="mt-1.5 text-[13.5px] text-ink-2">{children}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ fine-tuned: the timestamp shortcut */

/** Table 4 / §4.1.3: the same 16 frames with timestamps or with frame indices */
export function TimestampTrap({ compact = false }: { compact?: boolean }) {
  const [mode, setMode] = useState<'official' | 'index'>('official');
  const [model, setModel] = useState<'sft' | 'rl'>('sft');
  const [ref, on] = useInView<HTMLDivElement>();
  const d = SKYRA[model][mode];
  const bars = useMemo(() => [{ name: 'Wan2.2 fixed 5 s*', short: 'Fixed 5 s*', v: d.fixed.fakeR, ctrl: true, family: 'open' as const }, ...SOURCES.map((s, i) => ({ name: s.name, short: s.short, v: d.fakeR[i], ctrl: false, family: s.family }))], [d]);
  const strip = useRef<HTMLDivElement>(null);
  const cells = compact ? 8 : 16;
  return (
    <div ref={ref}>
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex h-10 rounded-full border border-ink p-1">
          {(['official', 'index'] as const).map((m) => (
            <button key={m} onClick={() => setMode(m)} className={`relative z-[1] rounded-full px-4 font-mono text-[11px] tracking-[0.1em] uppercase transition-colors ${mode === m ? 'text-paper' : 'text-ink-2'}`}>
              {mode === m && <motion.span layoutId="ts-pill" className="absolute inset-0 -z-[1] rounded-full bg-ink" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />}
              {m === 'official' ? 'Timestamps' : 'Frame indices'}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5">
          <Chip on={model === 'sft'} onClick={() => setModel('sft')}>Skyra-SFT</Chip>
          <Chip on={model === 'rl'} onClick={() => setModel('rl')}>Skyra-RL</Chip>
        </div>
      </div>

      {/* what the model is shown */}
      <div ref={strip} className="mt-5 grid gap-1" style={{ gridTemplateColumns: `repeat(${cells}, minmax(0,1fr))` }}>
        {Array.from({ length: cells }).map((_, i) => {
          const k = compact ? i * 2 + 1 : i;
          return (
            <div key={i}>
              <div className="aspect-video rounded-[1px] bg-screen bg-cover" style={{ backgroundImage: `url(${asset('media/strip16.webp')})`, backgroundSize: '1600% 100%', backgroundPosition: `${(k / 15) * 100}% 0` }} />
              <div className="relative mt-1 h-4 overflow-hidden text-center font-mono text-[9.5px] text-ink-2">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span key={mode} className={`absolute inset-0 ${mode === 'official' && k === 15 ? 'font-semibold text-fake' : ''}`} initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} transition={{ duration: 0.35, delay: i * 0.025 }}>
                    {mode === 'official' ? `${((k * 5) / 15).toFixed(2)}s` : `#${k + 1}`}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-1 text-right font-mono text-[10px] text-ink-3">Illustration: the same 16 frames of a 5.00 s clip, tagged with timestamps or with frame indices</div>

      <div className="mt-6 grid items-end gap-6 lg:grid-cols-[1fr_auto]">
        <div className="flex h-[190px] items-end gap-[6px]">
          {bars.map((b) => (
            <div key={b.name} className="flex h-full flex-1 flex-col items-center justify-end">
              <motion.span className="tnum font-mono text-[10px]" style={{ color: b.ctrl ? 'var(--fake)' : 'var(--ink-2)' }} animate={{ opacity: on ? 1 : 0 }}>
                {b.v.toFixed(0)}
              </motion.span>
              <motion.div className="mt-1 w-full rounded-t-[2px]" style={{ background: b.ctrl ? 'var(--fake)' : b.family === 'closed' ? 'var(--ink)' : 'var(--ink-3)' }} initial={{ height: 0 }} animate={{ height: on ? `${b.v * 1.5}px` : 0 }} transition={{ type: 'spring', stiffness: 110, damping: 18 }} />
              <span className={`mt-1.5 h-8 text-center font-mono text-[9px] leading-tight ${b.ctrl ? 'text-fake' : 'text-ink-3'}`}>{b.short}</span>
            </div>
          ))}
        </div>
        <div className="min-w-[220px] border-l border-rule pl-6">
          <div className="kicker">Fake recall gap, clips ending at exactly 5.00 s</div>
          <div className="font-display tnum mt-2 text-[56px] leading-none tracking-tight text-fake">
            <AnimatePresence mode="wait">
              <motion.span key={mode + model} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="inline-block">
                {SKYRA[model].gap5s[mode]}
              </motion.span>
            </AnimatePresence>
            <span className="ml-1 text-[22px] text-ink-3">pts</span>
          </div>
          <div className="mt-3 text-[13px] text-ink-2">
            Mean BAcc <b className="tnum text-ink">{SKYRA[model][mode].mean}%</b>
          </div>
        </div>
      </div>
      <p className="mt-2 font-mono text-[10.5px] text-ink-3">Bars: fake recall (%) per generator. * Wan2.2 with duration fixed at 5 s — a control outside the benchmark averages.</p>
    </div>
  );
}

/** BusterX++ in one line: it calls almost everything real */
export function BusterBias() {
  const [ref, on] = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className="flex flex-wrap items-center gap-6">
      <div className="flex h-14 items-end gap-1">
        {SKYRA.busterx.fakeR.map((v, i) => (
          <motion.span key={i} className="w-3 rounded-t-[1px] bg-fake" initial={{ height: 0 }} animate={{ height: on ? v * 1.6 + 2 : 0 }} transition={{ duration: 0.8, delay: i * 0.05, ease }} />
        ))}
        <span className="mx-1 h-14 w-px bg-rule" />
        <motion.span className="w-3 rounded-t-[1px] bg-real" initial={{ height: 0 }} animate={{ height: on ? 56 * 0.937 : 0 }} transition={{ duration: 0.9, delay: 0.5, ease }} />
      </div>
      <p className="max-w-sm text-[13.5px] text-ink-2">
        <b className="text-ink">BusterX++</b> flags only 4.1–9.1% of generated clips on any generator, while keeping 93.7% of real ones: a strong preference for “Real”, not detection.
      </p>
    </div>
  );
}
