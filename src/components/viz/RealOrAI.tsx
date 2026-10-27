import { AnimatePresence, motion, useMotionValue, useTransform, animate } from 'motion/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Stamp } from '@/components/ui/Stamp';
import { Icon } from '@/components/ui/Icon';
import { asset } from '@/lib/hooks';
import data from '@/data/realorai.json';
import { HUMAN } from '@/data/results';

/**
 * "Real or AI?" — one clip at a time. A round is 10 clips: 6 from three frontier generators (2 each) and
 * 4 real RA-Bench anchors, freshly shuffled every game. Answer by dragging the card (left = real,
 * right = AI), with the buttons, or with ← / →. The reveal names the model and types out the one-sentence
 * prompt the clip was made from. Below sits every frontier clip, blurred until the round is over.
 */

export type Clip = (typeof data.clips)[number] & { model?: string; modelName?: string; maker?: string; prompt?: string; dims?: string[]; credit?: string; license?: string; url?: string };
const CLIPS = data.clips as Clip[];
export const AI_CLIPS = CLIPS.filter((c) => c.kind === 'ai');
const REAL_CLIPS = CLIPS.filter((c) => c.kind === 'real');
export const MODELS = [
  { key: 'minimax-h3', name: 'MiniMax-H3', maker: 'MiniMax' },
  { key: 'seedance-2.5', name: 'Seedance 2.5', maker: 'ByteDance' },
  { key: 'wan-3.0', name: 'Wan 3.0', maker: 'Alibaba' },
];
const AI_PER_MODEL = 2;
const REAL_PER_ROUND = 4;

const shuffle = <T,>(a: T[]) => {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
};
function draw(): Clip[] {
  const ai = MODELS.flatMap((m) => shuffle(AI_CLIPS.filter((c) => c.model === m.key)).slice(0, AI_PER_MODEL));
  return shuffle([...ai, ...shuffle(REAL_CLIPS).slice(0, REAL_PER_ROUND)]);
}

type Pick = 'real' | 'ai';
type Answer = { clip: Clip; pick: Pick; correct: boolean };

function useTyped(text: string, on: boolean, ms = 1300) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!on) return setN(0);
    const step = Math.max(1, Math.ceil(text.length / (ms / 24)));
    let k = 0;
    const t = window.setInterval(() => {
      k = Math.min(text.length, k + step);
      setN(k);
      if (k >= text.length) window.clearInterval(t);
    }, 24);
    return () => window.clearInterval(t);
  }, [text, on, ms]);
  return text.slice(0, n);
}

function Reveal({ a, compact }: { a: Answer; compact: boolean }) {
  const c = a.clip;
  const typed = useTyped(c.prompt ?? '', c.kind === 'ai');
  return (
    <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.35 }}>
      <div className="flex flex-wrap items-center gap-2">
        <span className={`rounded-full px-2.5 py-1 font-mono text-[10.5px] tracking-[0.12em] text-white uppercase ${c.kind === 'ai' ? 'bg-fake' : 'bg-real'}`}>{c.kind === 'ai' ? 'AI-generated' : 'Real footage'}</span>
        {c.kind === 'ai' ? (
          <span className="font-mono text-[11.5px] tracking-[0.06em] text-ink-2">
            <b className="font-semibold text-ink">{c.modelName}</b> · {c.maker}
          </span>
        ) : (
          <a href={c.url} target="_blank" rel="noreferrer" className="link-u font-mono text-[11.5px] tracking-[0.06em] text-ink-2">
            {c.credit} · {c.license}
          </a>
        )}
        <span className={`ml-auto font-mono text-[11px] tracking-[0.08em] uppercase ${a.correct ? 'text-real' : 'text-fake'}`}>
          {a.correct ? '✓ You got it' : `✗ You said ${a.pick === 'ai' ? 'AI' : 'real'}`}
        </span>
      </div>
      {c.kind === 'ai' ? (
        <>
          <div className="mt-3 kicker">Made from this sentence, and nothing else</div>
          <p className={`font-display mt-1.5 leading-snug text-ink italic ${compact ? 'text-[18px]' : 'text-[21px]'}`}>
            “{typed}
            <span className="ml-0.5 inline-block h-[0.9em] w-[2px] translate-y-[0.1em] animate-pulse bg-fake align-baseline" />”
          </p>
          <div className="mt-2 font-mono text-[10.5px] tracking-[0.06em] text-ink-3">VBench-2.0 prompt · tests {c.dims?.join(', ').toLowerCase()}</div>
        </>
      ) : (
        <>
          <p className={`font-display mt-3 leading-snug text-ink ${compact ? 'text-[19px]' : 'text-[22px]'}`}>{c.title}</p>
          <div className="mt-2 font-mono text-[10.5px] tracking-[0.06em] text-ink-3">A real anchor from RA-Bench, re-encoded like every clip here</div>
        </>
      )}
    </motion.div>
  );
}


function Card({ clip, index, total, answer, onAnswer, compact }: { clip: Clip; index: number; total: number; answer?: Answer; onAnswer: (p: Pick) => void; compact: boolean }) {
  const x = useMotionValue(0);
  const rot = useTransform(x, [-260, 260], [-9, 9]);
  const leftTag = useTransform(x, [-140, -20], [1, 0]);
  const rightTag = useTransform(x, [20, 140], [0, 1]);
  const answered = !!answer;
  useEffect(() => {
    if (answered) animate(x, 0, { type: 'spring', stiffness: 260, damping: 24 });
  }, [answered, x]);
  const away = answer?.pick === 'real' ? -1 : 1;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: 18 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, x: 360 * away, rotate: 10 * away, transition: { duration: 0.42, ease: [0.32, 0, 0.67, 0] } }}
      transition={{ type: 'spring', stiffness: 220, damping: 24 }}
      style={{ x, rotate: rot }}
      drag={answered ? false : 'x'}
      dragSnapToOrigin
      dragElastic={0.6}
      onDragEnd={(_, info) => {
        if (info.offset.x < -110 || info.velocity.x < -700) onAnswer('real');
        else if (info.offset.x > 110 || info.velocity.x > 700) onAnswer('ai');
      }}
      className={`viewfinder relative aspect-video overflow-hidden rounded-[4px] bg-screen text-white shadow-[var(--shadow)] select-none ${answered ? '' : 'cursor-grab active:cursor-grabbing'}`}
    >
      <video src={asset(clip.src)} poster={asset(clip.poster)} muted playsInline autoPlay loop preload="auto" className="pointer-events-none absolute inset-0 h-full w-full object-cover" />
      <span className="vf-c tl" /><span className="vf-c tr" /><span className="vf-c bl" /><span className="vf-c br" />
      <div className={`pointer-events-none absolute inset-x-0 top-0 z-[4] flex justify-between font-mono uppercase ${compact ? 'px-5 pt-4 text-[9px] tracking-[0.1em]' : 'px-8 pt-5 text-[10.5px] tracking-[0.14em]'}`}>
        <span className="rounded-[2px] bg-black/55 px-2 py-1 backdrop-blur-sm">Clip {index + 1} / {total}</span>
        {!compact && <span className="rounded-[2px] bg-black/45 px-2 py-1 backdrop-blur-sm">5 s · muted</span>}
      </div>
      {!answered && (
        <>
          <motion.span style={{ opacity: leftTag }} className="pointer-events-none absolute top-1/2 left-6 z-[5] -translate-y-1/2 rounded-[4px] border-[3px] border-[var(--real)] bg-[var(--real)]/15 px-3 py-1 font-mono text-[22px] font-semibold tracking-[0.16em] text-white uppercase">Real</motion.span>
          <motion.span style={{ opacity: rightTag }} className="pointer-events-none absolute top-1/2 right-6 z-[5] -translate-y-1/2 rounded-[4px] border-[3px] border-[var(--fake)] bg-[var(--fake)]/15 px-3 py-1 font-mono text-[22px] font-semibold tracking-[0.16em] text-white uppercase">AI</motion.span>
        </>
      )}
      {answered && (
        <>
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`pointer-events-none absolute inset-0 z-[2] ${clip.kind === 'ai' ? 'bg-[color-mix(in_oklab,var(--fake)_20%,transparent)]' : 'bg-[color-mix(in_oklab,var(--real)_18%,transparent)]'}`} />
          <Stamp kind={clip.kind === 'ai' ? 'fake' : 'real'} label={clip.kind === 'ai' ? `AI · ${clip.modelName}` : 'Real'} rot={away < 0 ? -7 : 6} size={compact ? 0.85 : 1.15} />
        </>
      )}
    </motion.div>
  );
}

export function RealOrAI({ compact = false, onDone }: { compact?: boolean; onDone?: () => void }) {
  const [deck, setDeck] = useState<Clip[]>(draw);
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [done, setDone] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const inView = useRef(false);
  const clip = deck[i];
  const answered = answers.length > i;
  const last = i === deck.length - 1;

  const answer = useCallback(
    (pick: Pick) => {
      if (answers.length > i || done) return;
      setAnswers((a) => [...a, { clip: deck[i], pick, correct: (pick === 'ai') === (deck[i].kind === 'ai') }]);
    },
    [answers.length, i, done, deck]
  );
  const next = useCallback(() => {
    if (answers.length <= i) return;
    if (last) {
      setDone(true);
      onDone?.();
    } else setI((k) => k + 1);
  }, [answers.length, i, last, onDone]);
  const restart = () => {
    setDeck(draw());
    setI(0);
    setAnswers([]);
    setDone(false);
  };

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => (inView.current = e.intersectionRatio > 0.35), { threshold: [0, 0.35, 0.6] });
    if (box.current) io.observe(box.current);
    const key = (e: KeyboardEvent) => {
      if (!inView.current || e.metaKey || e.ctrlKey || (e.target as HTMLElement)?.closest('input,textarea')) return;
      if (e.key === 'ArrowLeft') { e.preventDefault(); answer('real'); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); answer('ai'); }
      else if (e.key === 'Enter' || e.key === ' ') {
        if (answers.length > i) { e.preventDefault(); next(); }
      }
    };
    addEventListener('keydown', key);
    return () => {
      io.disconnect();
      removeEventListener('keydown', key);
    };
  }, [answer, next, answers.length, i]);

  const score = answers.filter((a) => a.correct).length;
  const aiCalledReal = answers.filter((a) => a.clip.kind === 'ai' && a.pick === 'real').length;
  const realCalledAi = answers.filter((a) => a.clip.kind === 'real' && a.pick === 'ai').length;
  const nAi = deck.filter((c) => c.kind === 'ai').length;
  const seed = HUMAN.bySource.find((s) => s.key === 'seedance2')!.gen;

  return (
    <div ref={box}>
      {/* progress */}
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-1.5">
          {deck.map((c, k) => {
            const a = answers[k];
            return (
              <span key={c.id + k} title={a ? (a.correct ? 'right' : 'wrong') : ''} className={`grid place-items-center rounded-full border font-mono transition-all duration-500 ${compact ? 'h-6 w-6 text-[9.5px]' : 'h-7 w-7 text-[10.5px]'} ${k === i && !done ? 'scale-110 border-ink' : 'border-rule'} ${a ? (a.correct ? 'border-real bg-real text-white' : 'border-fake bg-fake text-white') : 'text-ink-3'}`}>
                {a ? (a.correct ? <Icon name="check" size={compact ? 11 : 12} stroke={2.4} /> : <Icon name="close" size={compact ? 10 : 11} stroke={2.4} />) : k + 1}
              </span>
            );
          })}
        </div>
        {!compact && (
          <span className="tnum font-mono text-[12px] text-ink-3">
            <b className="text-ink">{score}</b> / {answers.length} right
          </span>
        )}
      </div>

      <div className="relative">
        <AnimatePresence mode="popLayout" initial={false}>
          {!done ? (
            <Card key={clip.id + i} clip={clip} index={i} total={deck.length} answer={answers[i]} onAnswer={answer} compact={compact} />
          ) : (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 22 }} className={`relative overflow-hidden rounded-[4px] border border-rule bg-card ${compact ? 'p-5' : 'aspect-video p-8'}`}>
              <div className="kicker">Your result</div>
              <div className="mt-2 flex items-baseline gap-3">
                <span className={`font-display leading-none tracking-tight ${compact ? 'text-[72px]' : 'text-[104px]'}`}>{score}</span>
                <span className={`font-display text-ink-3 ${compact ? 'text-[28px]' : 'text-[38px]'}`}>/ {deck.length}</span>
              </div>
              <div className={`mt-5 grid gap-4 border-t border-rule pt-5 ${compact ? '' : 'grid-cols-3'}`}>
                <div>
                  <div className="font-display text-[30px] leading-none text-fake">{aiCalledReal} <span className="text-[18px] text-ink-3">of {nAi}</span></div>
                  <div className="mt-1.5 text-[13px] text-ink-3">AI clips you took for real footage</div>
                </div>
                <div>
                  <div className="font-display text-[30px] leading-none text-real">{realCalledAi} <span className="text-[18px] text-ink-3">of {deck.length - nAi}</span></div>
                  <div className="mt-1.5 text-[13px] text-ink-3">real clips you suspected were AI</div>
                </div>
                <div>
                  <div className="font-display text-[30px] leading-none">{seed}%</div>
                  <div className="mt-1.5 text-[13px] text-ink-3">of Seedance 2.0 clips our 20 reviewers caught in RA-Bench. These models are newer.</div>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-2.5">
                <button onClick={restart} className="btn btn-dark"><Icon name="replay" size={14} /> New round</button>
                <a href="#frontier" className="btn btn-line">All 15 AI clips <Icon name="down" size={13} /></a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* the next clip loads while this one plays */}
        {!done && deck[i + 1] && <video key={'pre' + deck[i + 1].src} src={asset(deck[i + 1].src)} muted playsInline preload="auto" className="pointer-events-none absolute h-px w-px opacity-0" aria-hidden />}
      </div>

      {!done && (
        <div className={`mt-4 ${compact ? 'min-h-[214px]' : 'min-h-[150px]'}`}>
          {!answered ? (
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => answer('real')} className="group flex h-14 items-center justify-center gap-3 rounded-[4px] border-2 border-real font-mono text-[13px] font-semibold tracking-[0.14em] text-real uppercase transition-colors hover:bg-real hover:text-white">
                <span className="transition-transform group-hover:-translate-x-1">←</span> Real
              </button>
              <button onClick={() => answer('ai')} className="group flex h-14 items-center justify-center gap-3 rounded-[4px] border-2 border-fake font-mono text-[13px] font-semibold tracking-[0.14em] text-fake uppercase transition-colors hover:bg-fake hover:text-white">
                AI-generated <span className="transition-transform group-hover:translate-x-1">→</span>
              </button>
              <p className="col-span-2 text-center font-mono text-[10.5px] tracking-[0.1em] text-ink-3 uppercase">{compact ? 'or swipe the card left / right' : 'or drag the card · keys ← →'}</p>
            </div>
          ) : (
            <div className={`flex gap-5 ${compact ? 'flex-col' : 'items-start justify-between'}`}>
              <div className="min-w-0 flex-1">
                <AnimatePresence mode="wait">
                  <Reveal a={answers[i]} compact={compact} />
                </AnimatePresence>
              </div>
              <button onClick={next} className={`btn btn-dark shrink-0 ${compact ? 'justify-center' : ''}`}>
                {last ? 'See your score' : 'Next clip'} <Icon name="arrow" size={13} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/** every frontier clip, by model; hover (or tap) to play; blurred until the round is over or revealed */
export function FrontierGallery({ unlocked, onReveal, compact = false }: { unlocked: boolean; onReveal: () => void; compact?: boolean }) {
  const [playing, setPlaying] = useState<string | null>(null);
  const rows = useMemo(() => MODELS.map((m) => ({ ...m, clips: AI_CLIPS.filter((c) => c.model === m.key) })), []);
  return (
    <div id="frontier" className="relative scroll-mt-24">
      <div className={`space-y-8 transition-[filter,opacity] duration-700 ${unlocked ? '' : 'pointer-events-none opacity-70 blur-[14px] select-none'}`} aria-hidden={!unlocked}>
        {rows.map((r) => (
          <div key={r.key}>
            <div className="mb-3 flex items-baseline justify-between gap-4 border-b border-ink pb-2">
              <h4 className="font-display text-[24px] leading-none">{r.name}</h4>
              <span className="kicker">{compact ? r.maker : `${r.maker} · 5 random clips`}</span>
            </div>
            <div className={compact ? '-mx-5 flex snap-x snap-mandatory gap-2 overflow-x-auto px-5 pb-2' : 'grid grid-cols-5 gap-2'}>
              {r.clips.map((c) => {
                const on = playing === c.id;
                return (
                  <button
                    key={c.id}
                    onMouseEnter={() => setPlaying(c.id)}
                    onMouseLeave={() => setPlaying((p) => (p === c.id ? null : p))}
                    onClick={() => setPlaying((p) => (p === c.id ? null : c.id))}
                    className={`group relative flex shrink-0 snap-start flex-col overflow-hidden rounded-[3px] border border-rule bg-card text-left ${compact ? 'w-[78%]' : ''}`}
                  >
                    <div className="relative aspect-video bg-screen text-white">
                      <img src={asset(c.poster)} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                      {on && <video src={asset(c.src)} muted playsInline autoPlay loop className="absolute inset-0 h-full w-full object-cover" />}
                      <span className="absolute top-2 left-2 rounded-[2px] bg-[var(--fake)] px-1.5 py-0.5 font-mono text-[9px] tracking-[0.12em] uppercase">AI</span>
                      <span className={`absolute right-2 bottom-2 grid h-7 w-7 place-items-center rounded-full bg-white/90 text-[#101726] transition-opacity ${on ? 'opacity-0' : 'opacity-100'}`}><Icon name="play" size={11} className="ml-0.5" /></span>
                    </div>
                    <div className="flex-1 px-2.5 pt-2 pb-2.5 text-ink">
                      <div className="text-[13px] leading-tight font-medium">{c.title}</div>
                      <div className={`font-display mt-1 text-[12.5px] leading-snug text-ink-3 italic ${on ? '' : 'line-clamp-2'}`}>“{c.prompt}”</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      {!unlocked && (
        <div className="absolute inset-0 z-10 grid place-items-center">
          <div className="max-w-md border border-rule bg-card p-6 text-center shadow-[var(--shadow)]">
            <div className="kicker text-fake">Spoiler</div>
            <p className="font-display mt-2 text-[22px] leading-snug">All 15 frontier clips, with the sentence each one came from.</p>
            <p className="mt-2 text-[13.5px] text-ink-3">Some of them are in your round. Finish it first, or</p>
            <button onClick={onReveal} className="btn btn-line mt-4">Reveal now <Icon name="eye" size={14} /></button>
          </div>
        </div>
      )}
    </div>
  );
}
