import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import TargetCursor from '@/components/reactbits/TargetCursor/TargetCursor';
import { Stamp } from '@/components/ui/Stamp';
import { Icon } from '@/components/ui/Icon';
import { asset } from '@/lib/hooks';
import media from '@/data/media.json';
import { HUMAN } from '@/data/results';

/** what each round shows (RA-Bench L2 subcategories) */
export const ROUND_INFO = [
  { scene: 'Marines on patrol in Fallujah', cat: 'War & armed conflict · urban operations' },
  { scene: 'Guard checkpoint during the LA wildfires', cat: 'Public safety · lockdowns & security lines' },
  { scene: 'Fighter pilot on the runway', cat: 'War & armed conflict · military aircraft' },
  { scene: 'A street after the Palisades fire', cat: 'Weather & disasters · wildfire' },
  { scene: 'NH90 helicopter, touch-and-go', cat: 'War & armed conflict · exercises' },
];

type Pick = 'A' | 'B' | null;

/** both clips of a pair start on the same frame, have the same length, and loop together */
function PairVideo({ src, poster, sync, onReady }: { src: string; poster: string; sync: number; onReady: (v: HTMLVideoElement) => void }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (ref.current) onReady(ref.current);
  }, [onReady, src]);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.currentTime = 0;
    v.play().catch(() => {});
  }, [sync]);
  return <video ref={ref} src={asset(src)} poster={asset(poster)} muted playsInline autoPlay preload="auto" className="absolute inset-0 h-full w-full object-cover" />;
}

export function useGame() {
  const rounds = media.game;
  const [order, setOrder] = useState(() => rounds.map(() => Math.random() < 0.5));
  const [i, setI] = useState(0);
  const [pick, setPick] = useState<Pick>(null);
  const [score, setScore] = useState<boolean[]>([]);
  const done = score.length === rounds.length && pick !== null && i === rounds.length - 1;
  const fakeSide: 'A' | 'B' = order[i] ? 'A' : 'B';
  const choose = (p: 'A' | 'B') => {
    if (pick) return;
    setPick(p);
    setScore((s) => [...s, p === fakeSide]);
  };
  const next = () => {
    if (i < rounds.length - 1) {
      setI(i + 1);
      setPick(null);
    }
  };
  const restart = () => {
    setOrder(rounds.map(() => Math.random() < 0.5));
    setI(0);
    setPick(null);
    setScore([]);
  };
  return { rounds, i, pick, score, done, fakeSide, choose, next, restart, finished: score.length === rounds.length };
}

export function SpotTheFake() {
  const g = useGame();
  const stage = useRef<HTMLDivElement>(null);
  const r = g.rounds[g.i];
  const vids = useRef<HTMLVideoElement[]>([]);
  const [sync, setSync] = useState(0);
  const [summary, setSummary] = useState(false);
  const reg = useCallback((v: HTMLVideoElement) => {
    if (!vids.current.includes(v)) vids.current.push(v);
  }, []);
  // restart both clips whenever either reaches the end, so they stay frame-aligned
  useEffect(() => {
    vids.current = [];
    const t = window.setInterval(() => {
      const vs = vids.current.filter((v) => v.isConnected);
      if (vs.some((v) => v.ended || v.currentTime >= r.dur - 0.08)) setSync((s) => s + 1);
    }, 60);
    return () => window.clearInterval(t);
  }, [r.dur, g.i]);

  const sides: { id: 'A' | 'B'; fake: boolean }[] = [
    { id: 'A', fake: g.fakeSide === 'A' },
    { id: 'B', fake: g.fakeSide === 'B' },
  ];
  const right = g.pick ? g.pick === g.fakeSide : null;
  const total = g.score.filter(Boolean).length;
  const genHuman = useMemo(() => HUMAN.bySource.find((s) => s.key === r.genKey), [r.genKey]);

  return (
    <div className="relative">
      <TargetCursor container={stage} targetSelector=".tc-target" cursorColor="var(--ink)" cursorColorOnTarget="#ffffff" hideDefaultCursor spinDuration={3} />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="kicker">
            Pair {g.i + 1} / {g.rounds.length}
          </div>
          <div className="font-display mt-2 text-[26px] leading-tight">{ROUND_INFO[g.i].scene}</div>
          <div className="mt-1 text-[13px] text-ink-3">{ROUND_INFO[g.i].cat}</div>
        </div>
        <div className="flex items-center gap-1.5">
          {g.rounds.map((_, k) => {
            const s = g.score[k];
            return (
              <span key={k} className={`grid h-7 w-7 place-items-center rounded-full border font-mono text-[11px] transition-all duration-500 ${k === g.i ? 'scale-110 border-ink' : 'border-rule'} ${s === true ? 'border-real bg-real text-white' : s === false ? 'border-fake bg-fake text-white' : 'text-ink-3'}`}>
                {s === true ? <Icon name="check" size={13} stroke={2.2} /> : s === false ? <Icon name="close" size={12} stroke={2.2} /> : k + 1}
              </span>
            );
          })}
        </div>
      </div>

      <div ref={stage} className="mt-6 grid gap-4 md:grid-cols-2">
        {sides.map((s) => {
          const reveal = g.pick !== null;
          const chosen = g.pick === s.id;
          return (
            <button
              key={`${g.i}-${s.id}`}
              data-cursor-label={reveal ? '' : `${s.id} is generated?`}
              onClick={() => g.choose(s.id)}
              disabled={reveal}
              className={`tc-target viewfinder group relative aspect-video overflow-hidden rounded-[3px] bg-screen text-white transition-[box-shadow,transform] duration-500 ${reveal ? '' : 'hover:-translate-y-0.5'} ${chosen ? (right ? 'ring-4 ring-real' : 'ring-4 ring-fake') : ''}`}
            >
              <PairVideo src={s.fake ? r.fake : r.real} poster={s.fake ? r.fakePoster : r.realPoster} sync={sync} onReady={reg} />
              <span className="vf-c tl" /><span className="vf-c tr" /><span className="vf-c bl" /><span className="vf-c br" />
              <span className="absolute top-5 left-8 z-[4] font-display text-[44px] leading-none italic drop-shadow-[0_2px_8px_rgba(0,0,0,.6)]">{s.id}</span>
              {!reveal && (
                <span className="absolute right-8 bottom-5 z-[4] rounded-[2px] bg-black/55 px-2 py-1 font-mono text-[10px] tracking-[0.14em] uppercase opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                  Click if generated
                </span>
              )}
              {reveal && (
                <>
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`absolute inset-0 z-[2] ${s.fake ? 'bg-[color-mix(in_oklab,var(--fake)_22%,transparent)]' : 'bg-[color-mix(in_oklab,var(--real)_18%,transparent)]'}`} />
                  <Stamp kind={s.fake ? 'fake' : 'real'} label={s.fake ? `Generated · ${r.gen}` : 'Real'} rot={s.id === 'A' ? -7 : 6} size={1.05} />
                </>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-5 min-h-[92px]">
        <AnimatePresence mode="wait">
          {g.pick === null ? (
            <motion.p key="ask" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="text-[15px] text-ink-2">
              Both clips start from the <b className="font-semibold text-ink">same real frame</b> and run for {r.dur.toFixed(1)} s. One continues as it really happened. <b className="font-semibold text-ink">Which one is generated?</b>
            </motion.p>
          ) : (
            <motion.div key="res" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-wrap items-center justify-between gap-4">
              <div className="max-w-2xl">
                <div className={`font-display text-[24px] ${right ? 'text-real' : 'text-fake'}`}>{right ? 'You caught it.' : 'Fooled — and you are not alone.'}</div>
                <p className="mt-1 text-[14.5px] text-ink-2">
                  This {r.gen} clip was judged <b className="text-ink">Real by all five</b> of our reviewers, who saw it on its own. Across RA-Bench, reviewers flagged only {genHuman?.gen}% of {r.gen} videos as generated.
                </p>
              </div>
              {g.i < g.rounds.length - 1 ? (
                <button onClick={g.next} className="btn btn-dark">
                  Next pair <Icon name="arrow" size={13} />
                </button>
              ) : (
                <button onClick={() => setSummary(true)} className="btn btn-dark">
                  See your score <Icon name="arrow" size={13} />
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {summary && g.finished && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-20 grid place-items-center rounded-[4px] bg-[var(--glass)] backdrop-blur-xl">
            <motion.div initial={{ y: 24, scale: 0.96 }} animate={{ y: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 220, damping: 22 }} className="w-[min(560px,92%)] border border-rule bg-card p-8 shadow-[var(--shadow)]">
              <div className="kicker">Your result</div>
              <div className="mt-3 flex items-baseline gap-3">
                <span className="font-display text-[88px] leading-none tracking-tight">{total}</span>
                <span className="font-display text-[34px] text-ink-3">/ {g.rounds.length}</span>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-rule pt-5 text-[13.5px]">
                <div>
                  <div className="font-display text-[30px] leading-none text-fake">0 / 5</div>
                  <div className="mt-1.5 text-ink-3">our reviewers, seeing each clip alone, called every one of these real</div>
                </div>
                <div>
                  <div className="font-display text-[30px] leading-none">{HUMAN.closedAvg}%</div>
                  <div className="mt-1.5 text-ink-3">of closed-source videos that reviewers flagged as generated, across RA-Bench</div>
                </div>
              </div>
              <p className="mt-5 text-[13.5px] leading-relaxed text-ink-3">Side by side is the easy version. In the wild there is no real twin to compare against — and that is where detectors have to work.</p>
              <div className="mt-6 flex gap-2.5">
                <button onClick={() => { setSummary(false); g.restart(); }} className="btn btn-dark">
                  <Icon name="replay" size={14} /> Play again
                </button>
                <a href="#benchmark" onClick={() => setSummary(false)} className="btn btn-line">
                  How RA-Bench is built
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
