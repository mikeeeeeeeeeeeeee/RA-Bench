import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { CONDITIONING, HUMAN, HUMANPROOF, LASTMILE, QUALITY, SOURCES } from '@/data/results';
import { asset, useInView, useSpring } from '@/lib/hooks';
import media from '@/data/media.json';
import { Icon } from '@/components/ui/Icon';
import { timecode } from '@/components/ui/Frame';

const ease = [0.16, 1, 0.3, 1] as const;

/* ------------------------------------------------------------------ Finding 2: conditioning */

function SmallLines({ title, unit, series, meanSeries, sel, color, on, w = 300 }: { title: string; unit: string; series: { name: string; v: number[] }[]; meanSeries: number[]; sel: number; color: string; on: boolean; w?: number }) {
  const h = 210, l = 34, r = w - 14, t = 22, b = h - 30;
  const X = (i: number) => l + (i / 2) * (r - l);
  const Y = (v: number) => b - (v / 100) * (b - t);
  const path = (v: number[]) => v.map((y, i) => `${i ? 'L' : 'M'}${X(i)},${Y(y)}`).join(' ');
  return (
    <div>
      <div className="kicker mb-1">{title}</div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full overflow-visible">
        <rect x={X(sel) - 26} y={t - 8} width={52} height={b - t + 16} fill="color-mix(in oklab, var(--ink) 5%, transparent)" rx={3} />
        {[0, 50, 100].map((v) => (
          <g key={v}>
            <line x1={l} x2={r} y1={Y(v)} y2={Y(v)} stroke={v === 50 ? 'var(--fake)' : 'var(--rule-2)'} strokeDasharray={v === 50 ? '3 4' : undefined} />
            <text x={l - 8} y={Y(v) + 3} textAnchor="end" className="fill-[var(--ink-3)] font-mono text-[9.5px]">{v}</text>
          </g>
        ))}
        {series.map((s, k) => (
          <motion.path key={s.name} d={path(s.v)} fill="none" stroke="var(--ink-4)" strokeWidth={1} initial={{ pathLength: 0, opacity: 0 }} animate={on ? { pathLength: 1, opacity: 0.55 } : {}} transition={{ duration: 1.1, delay: 0.2 + k * 0.05, ease }} />
        ))}
        <motion.path d={path(meanSeries)} fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" initial={{ pathLength: 0 }} animate={on ? { pathLength: 1 } : {}} transition={{ duration: 1.3, delay: 0.5, ease }} />
        {meanSeries.map((v, i) => (
          <g key={i}>
            <motion.circle cx={X(i)} cy={Y(v)} r={i === sel ? 7 : 4.5} fill={i === sel ? color : 'var(--paper)'} stroke={color} strokeWidth={2} initial={{ scale: 0 }} animate={on ? { scale: 1 } : {}} transition={{ delay: 0.8 + i * 0.15 }} />
            <text x={X(i)} y={Y(v) - 13} textAnchor="middle" className="tnum font-mono" style={{ fontSize: i === sel ? 13 : 10.5, fill: i === sel ? color : 'var(--ink-3)', fontWeight: i === sel ? 600 : 400 }}>{v.toFixed(1)}</text>
          </g>
        ))}
        {CONDITIONING.short.map((s, i) => (
          <text key={s} x={X(i)} y={h - 8} textAnchor="middle" className="font-mono" style={{ fontSize: 9.5, fill: i === sel ? 'var(--ink)' : 'var(--ink-3)' }}>{s}</text>
        ))}
      </svg>
      <div className="font-mono text-[10px] text-ink-3">{unit}</div>
    </div>
  );
}

export function Conditioning({ compact = false }: { compact?: boolean }) {
  const [ref, on] = useInView<HTMLDivElement>();
  const [sel, setSel] = useState(1);
  const steps = [
    { title: 'Prompt only', tag: 'T2V', frames: [] as string[] },
    { title: 'First frame', tag: 'I2V · RA-Bench', frames: ['media/cond-first.webp'] },
    { title: 'First + last frame', tag: 'I2V', frames: ['media/cond-first.webp', 'media/cond-last.webp'] },
  ];
  return (
    <div ref={ref} className={compact ? 'space-y-6' : 'grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)]'}>
      <div className="space-y-2.5">
        <div className="kicker mb-2">What the generator receives</div>
        {steps.map((s, i) => (
          <button key={s.title} onClick={() => setSel(i)} className={`flex w-full items-center gap-4 border p-3 text-left transition-all duration-300 ${sel === i ? 'border-ink bg-card shadow-[var(--shadow)]' : 'border-rule hover:border-ink-3'}`}>
            <div className="flex h-[54px] w-[150px] shrink-0 items-center gap-1">
              <span className="grid h-[54px] w-[44px] shrink-0 place-items-center rounded-[2px] border border-dashed border-ink-3 font-mono text-[8.5px] leading-tight text-ink-3">TEXT<br />PROMPT</span>
              {s.frames.map((f, k) => (
                <span key={k} className="relative h-[54px] w-[52px] shrink-0 overflow-hidden rounded-[2px] bg-screen">
                  <img src={asset(f)} alt="" className="h-full w-full object-cover" />
                  <span className="absolute bottom-0.5 left-1 font-mono text-[8px] text-white">{k === 0 ? 'f₀' : 'f_end'}</span>
                </span>
              ))}
            </div>
            <div>
              <div className="text-[15px] font-medium">{s.title}</div>
              <div className="font-mono text-[10.5px] tracking-[0.08em] text-ink-3 uppercase">{s.tag}</div>
            </div>
            <span className={`ml-auto h-2.5 w-2.5 rounded-full transition-colors ${sel === i ? 'bg-fake' : 'bg-rule'}`} />
          </button>
        ))}
        <p className="pt-2 text-[13px] leading-relaxed text-ink-3">Wan2.2, the same 1,830 anchor-derived prompts, seed 0. More real pixels in, same caption.</p>
      </div>
      <div className={compact ? 'space-y-6' : 'grid gap-8 sm:grid-cols-2'}>
        <SmallLines title="Fine-tuned MLLMs · fake recall" unit="5 settings (faint) and their mean (bold), %" series={CONDITIONING.finetuned.map((d) => ({ name: d.name, v: d.fakeR }))} meanSeries={CONDITIONING.ftMean} sel={sel} color="var(--fake)" on={on} />
        <SmallLines title="Traditional detectors · AUC" unit="7 detectors (faint) and their mean (bold), %" series={CONDITIONING.traditional.map((d) => ({ name: d.name, v: d.auc }))} meanSeries={CONDITIONING.tradMean} sel={sel} color="var(--ink)" on={on} />
        <div className="sm:col-span-2 border-t border-rule pt-4 text-[14px] text-ink-2">
          <AnimatePresence mode="wait">
            <motion.p key={sel} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {sel === 0 && 'From text alone, fine-tuned detectors flag 70.5% of clips — while the traditional mean sits far below chance at 33.4 AUC.'}
              {sel === 1 && 'Give the generator one real frame: fine-tuned fake recall falls to 42.7%, traditional AUC rises to 50.9. The two families move in opposite directions.'}
              {sel === 2 && 'Add the real last frame too: fake recall falls again, to 28.3%. Traditional detectors split — three rise, four fall, from −25.6 to +6.0 points.'}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export function QualityFacts() {
  const items = [
    { n: QUALITY.geminiDiag.fidelity, unit: 'pts', label: 'Gemini Diagnostic fake recall per interquartile rise in condition fidelity', sign: true },
    { n: QUALITY.motion.diagnostic, unit: 'pts', label: 'more Gemini fake evidence on dynamic clips; the traditional mean moves +0.1', sign: true },
    { n: QUALITY.seedMaxDelta, unit: 'AUC', label: 'largest source-level change across seeds 0, 42 and 123', prefix: '≤ ' },
  ];
  return (
    <div className="grid gap-px border border-rule bg-rule sm:grid-cols-3">
      {items.map((it) => (
        <div key={it.label} className="bg-paper p-5">
          <div className="font-display tnum text-[38px] leading-none tracking-tight">
            {it.prefix ?? (it.sign && it.n > 0 ? '+' : '')}
            {it.n}
            <span className="ml-1 font-mono text-[12px] text-ink-3">{it.unit}</span>
          </div>
          <p className="mt-2 text-[13px] leading-snug text-ink-2">{it.label}</p>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ Finding 3a: humans */

export function HumanBars({ compact = false }: { compact?: boolean }) {
  const [ref, on] = useInView<HTMLDivElement>();
  const rows = [...HUMAN.bySource].sort((a, b) => b.gen - a.gen);
  const [hot, setHot] = useState<string | null>(null);
  return (
    <div ref={ref}>
      <div className="mb-2 flex justify-between font-mono text-[10px] tracking-[0.1em] text-ink-3 uppercase">
        <span>Generator</span>
        <span>Judged “generated” by reviewers</span>
      </div>
      <div className="space-y-[7px]">
        {rows.map((r, i) => {
          const s = SOURCES.find((x) => x.key === r.key)!;
          return (
            <div key={r.key} onMouseEnter={() => setHot(r.key)} onMouseLeave={() => setHot(null)} className="grid grid-cols-[92px_1fr_44px] items-center gap-3 sm:grid-cols-[130px_1fr_52px]">
              <span className="truncate text-[13px] text-ink-2">{s.name}</span>
              <div className="relative h-[22px] bg-paper-2">
                {hot === r.key ? (
                  <div className="absolute inset-0 flex text-[9.5px] font-mono text-white">
                    <span className="grid place-items-center bg-real" style={{ width: `${r.real}%` }}>Real {r.real}</span>
                    <span className="bg-chance" style={{ width: `${r.unc}%` }} />
                    <span className="grid place-items-center bg-fake" style={{ width: `${r.gen}%` }}>Gen. {r.gen}</span>
                  </div>
                ) : (
                  <motion.div className="h-full" style={{ background: s.family === 'closed' ? 'var(--fake)' : 'var(--ink-3)' }} initial={{ width: 0 }} animate={on ? { width: `${r.gen}%` } : {}} transition={{ duration: 1, delay: 0.1 + i * 0.06, ease }} />
                )}
                <span className="absolute top-[-4px] bottom-[-4px] left-1/2 w-px bg-ink" />
              </div>
              <span className="tnum text-right font-mono text-[12.5px]">{r.gen}%</span>
            </div>
          );
        })}
      </div>
      <div className="mt-3 grid grid-cols-[92px_1fr_44px] items-center gap-3 border-t border-rule pt-3 sm:grid-cols-[130px_1fr_52px]">
        <span className="text-[13px] text-real">Real videos</span>
        <div className="relative h-[22px] bg-paper-2">
          <motion.div className="h-full bg-real" initial={{ width: 0 }} animate={on ? { width: `${HUMAN.realVideos.gen}%` } : {}} transition={{ duration: 1, delay: 0.7, ease }} />
          <span className="absolute top-[-4px] bottom-[-4px] left-1/2 w-px bg-ink" />
        </div>
        <span className="tnum text-right font-mono text-[12.5px] text-real">{HUMAN.realVideos.gen}%</span>
      </div>
      {!compact && <p className="mt-3 text-[12.5px] text-ink-3">{HUMAN.reviewers} reviewers, three judgments per video, sources hidden. Hover a bar for the Real / Uncertain / Generated split. Even real crisis footage was called generated 22.8% of the time.</p>}
    </div>
  );
}

/** Table 8: detectors on the 633 human-deceptive clips, from their source-matched reference */
export function HumanProofMeters() {
  const [ref, on] = useInView<HTMLDivElement>();
  const X = (v: number) => `${((v - 30) / 50) * 100}%`;
  return (
    <div ref={ref}>
      <div className="relative mb-2 h-4 font-mono text-[10px] text-ink-3">
        {[30, 40, 50, 60, 70, 80].map((t) => (
          <span key={t} className="absolute -translate-x-1/2" style={{ left: X(t) }}>{t}</span>
        ))}
      </div>
      <div className="space-y-3">
        {HUMANPROOF.map((d, i) => (
          <div key={d.name}>
            <div className="mb-1 flex justify-between text-[12.5px]">
              <span className="text-ink-2">{d.name}</span>
              <span className="tnum font-mono text-[11px] text-ink-3">
                {d.ref} → <b className="text-ink">{d.hp}</b> {d.metric}
              </span>
            </div>
            <div className="relative h-[10px] rounded-full bg-paper-2">
              <span className="absolute top-[-5px] bottom-[-5px] w-px bg-fake" style={{ left: X(50) }} />
              <span className="absolute top-1/2 h-[10px] w-[10px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] border-ink-3 bg-paper" style={{ left: X(d.ref) }} />
              <motion.span className="absolute top-1/2 h-[14px] w-[14px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink" initial={{ left: X(d.ref) }} animate={on ? { left: X(d.hp) } : {}} transition={{ duration: 1.1, delay: 0.3 + i * 0.08, ease }} />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-[12.5px] text-ink-3">Hollow: the same detector on RA-Bench, weighted to HumanProof's mix of generators. Filled: on the 633 clips. Red line: chance.</p>
    </div>
  );
}

/* ------------------------------------------------------------------ Finding 3b: the last mile */

type LM = { src: string; poster: string; w: number; h: number; fps: number; dur: number };

export function LastMile({ compact = false }: { compact?: boolean }) {
  const [ref, on] = useInView<HTMLDivElement>({ margin: '0px 0px -20% 0px' });
  const [i, setI] = useState(0);
  const [cls, setCls] = useState<'gen' | 'real'>('gen');
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);
  const vid = useRef<HTMLVideoElement>(null);
  const c = LASTMILE.conditions[i];
  const m = (media.lastmile as Record<string, LM>)[`${c.id}-${cls}`];
  const fake = useSpring(on ? LASTMILE.ftFakeR[i] : LASTMILE.ftFakeR[0], 70, 16);
  const auc = useSpring(on ? LASTMILE.tradAUC[i] : LASTMILE.tradAUC[0], 70, 16);
  // auto-walk the chain once when it scrolls into view; the visitor can replay or click any step
  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setI((k) => {
        if (k >= LASTMILE.conditions.length - 1) {
          setPlaying(false);
          return k;
        }
        return k + 1;
      });
    }, 2600);
    return () => window.clearInterval(id);
  }, [playing]);
  const started = useRef(false);
  useEffect(() => {
    if (on && !started.current) {
      started.current = true;
      const tm = window.setTimeout(() => setPlaying(true), 900);
      return () => window.clearTimeout(tm);
    }
  }, [on]);
  useEffect(() => {
    const v = vid.current;
    if (!v) return;
    v.currentTime = 0;
    v.play().catch(() => {});
  }, [m.src]);
  const notes = [
    'The standardized clip. Fine-tuned detectors flag 46.0% of generated videos.',
    'One platform-style re-encode (VP9 then H.264): fake recall drops to 29.9%.',
    'Halve the resolution, then transcode: the largest single loss — 7.9%.',
    'Drop to 8 fps, then transcode: 19.8%. Timestamp-based Skyra loses 11.7–12.9 BAcc points.',
    'Only a news badge in the corner, then transcode: 14.0%, and real recall climbs from 79.1% to 88.5%.',
    'All of it together: 1.4%. Every fine-tuned configuration flags at most 2.4% of generated videos.',
  ];
  return (
    <div ref={ref}>
      {/* the chain */}
      <div className="relative">
        <div className="absolute top-[13px] right-[8%] left-[8%] h-[2px] bg-rule" />
        <motion.div className="absolute top-[13px] left-[8%] h-[2px] origin-left bg-fake" animate={{ width: `${(i / (LASTMILE.conditions.length - 1)) * 84}%` }} transition={{ duration: 0.8, ease }} />
        <div className="relative grid grid-cols-6">
          {LASTMILE.conditions.map((s, k) => (
            <button key={s.id} onClick={() => { setPlaying(false); setI(k); }} className="group flex flex-col items-center text-center">
              <span className={`grid h-7 w-7 place-items-center rounded-full border-2 font-mono text-[10px] transition-all duration-500 ${k <= i ? 'border-fake bg-fake text-white' : 'border-rule bg-paper text-ink-3 group-hover:border-ink'} ${k === i ? 'scale-125 shadow-[0_0_0_6px_color-mix(in_oklab,var(--fake)_18%,transparent)]' : ''}`}>{k === 0 ? '●' : k === 5 ? '∑' : `T${k}`}</span>
              <span className={`mt-3 leading-tight ${compact ? 'text-[10.5px]' : 'text-[12px]'} ${k === i ? 'font-semibold text-ink' : 'text-ink-3'}`}>{compact ? ['Original', 'Transcode', 'Smaller', '8 fps', 'Badge', 'Full'][k] : s.short}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={`mt-8 grid gap-8 ${compact ? '' : 'lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]'}`}>
        <div>
          <div className="viewfinder relative aspect-video overflow-hidden rounded-[3px] bg-screen text-white">
            <video ref={vid} key={m.src} src={asset(m.src)} poster={asset(m.poster)} muted playsInline autoPlay loop onTimeUpdate={(e) => setT((e.target as HTMLVideoElement).currentTime)} className="absolute inset-0 h-full w-full object-cover" style={{ imageRendering: m.w < 1000 ? 'pixelated' : 'auto' }} />
            <span className="vf-c tl" /><span className="vf-c tr" /><span className="vf-c bl" /><span className="vf-c br" />
            <div className="pointer-events-none absolute inset-x-0 top-0 z-[4] flex justify-between px-8 pt-5 font-mono text-[10.5px] tracking-[0.14em] uppercase">
              <span className="rounded-[2px] bg-black/55 px-2 py-1 backdrop-blur-sm">{c.label}</span>
              <span className="tnum rounded-[2px] bg-black/45 px-2 py-1 backdrop-blur-sm">{m.w}×{m.h} · {m.fps} fps</span>
            </div>
            <div className="pointer-events-none absolute bottom-5 left-8 z-[4] font-mono text-[10.5px] tracking-[0.14em] uppercase">
              <span className="tnum rounded-[2px] bg-black/45 px-2 py-1">{timecode(t)}</span>
            </div>
            <AnimatePresence>
              <motion.div key={c.id + cls} className="pointer-events-none absolute inset-0 z-[3] bg-white mix-blend-overlay" initial={{ opacity: 0.55 }} animate={{ opacity: 0 }} transition={{ duration: 0.6 }} />
            </AnimatePresence>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {(['gen', 'real'] as const).map((k) => (
              <button key={k} onClick={() => setCls(k)} className={`h-8 rounded-full border px-3 font-mono text-[11px] tracking-[0.06em] transition-all ${cls === k ? (k === 'gen' ? 'border-fake bg-fake text-white' : 'border-real bg-real text-white') : 'border-rule text-ink-2 hover:border-ink'}`}>
                {k === 'gen' ? 'Generated · Seedance 2.0' : 'Real anchor'}
              </button>
            ))}
            <button onClick={() => { setI(0); setPlaying(true); }} className="ml-auto flex h-8 items-center gap-1.5 rounded-full border border-rule px-3 font-mono text-[11px] text-ink-2 hover:border-ink">
              <Icon name="replay" size={13} /> Replay the chain
            </button>
          </div>
          <p className="mt-2 text-[11.5px] text-ink-3">The released RA-Bench-LastMile files, shown at their own resolution and frame rate. The synthetic badge's logo is blurred on this page.</p>
        </div>

        <div>
          <div className="kicker">Fine-tuned detectors · fake recall</div>
          <div className="font-display tnum mt-2 text-[clamp(4rem,7vw,6.2rem)] leading-[0.9] tracking-[-0.03em] text-fake">
            {fake.toFixed(1)}
            <span className="text-[0.4em] text-ink-3">%</span>
          </div>
          <div className="relative mt-3 h-2 bg-paper-2">
            <div className="absolute inset-y-0 left-0 bg-fake-soft" style={{ width: `${LASTMILE.ftFakeR[0]}%` }} />
            <div className="absolute inset-y-0 left-0 bg-fake" style={{ width: `${fake}%` }} />
          </div>
          <div className="mt-1 flex justify-between font-mono text-[10px] text-ink-3">
            <span>0</span>
            <span>Original 46.0</span>
            <span>100</span>
          </div>
          <div className="mt-6 flex items-baseline justify-between border-t border-rule pt-4">
            <span className="text-[13px] text-ink-2">7 traditional detectors · mean AUC</span>
            <span className="font-display tnum text-[30px] leading-none">{auc.toFixed(1)}</span>
          </div>
          <div className="mt-4 min-h-[66px] text-[14px] leading-relaxed text-ink-2">
            <AnimatePresence mode="wait">
              <motion.p key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}>
                {notes[i]}
              </motion.p>
            </AnimatePresence>
          </div>
          <p className="mt-2 font-mono text-[10.5px] leading-relaxed text-ink-3">{c.ops}. Applied identically to every generated clip and its real anchor; 150 anchors × 9 generators.</p>
        </div>
      </div>
    </div>
  );
}
