import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FILM } from '@/data/film';
import { asset } from '@/lib/hooks';
import { Icon } from '@/components/ui/Icon';

const fmtT = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

/**
 * The film: a custom player with chapters, a scrubber that previews the chapter under the pointer, and a
 * subtitle strip under the picture — English above, the same line in Chinese below. The strip holds every
 * cue invisibly in one grid cell, so it keeps the height of the longest and never jumps.
 */
export function FilmPlayer({ compact = false }: { compact?: boolean }) {
  const v = useRef<HTMLVideoElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [t, setT] = useState(0);
  const [dur, setDur] = useState(FILM.duration);
  const [muted, setMuted] = useState(false);
  const [cc, setCc] = useState(() => {
    try {
      return localStorage.getItem('rabench-cc') !== '0';
    } catch {
      return true;
    }
  });
  const [hoverT, setHoverT] = useState<number | null>(null);

  const play = useCallback(() => {
    const el = v.current;
    if (!el) return;
    setStarted(true);
    el.play().catch(() => {});
  }, []);
  useEffect(() => {
    const on = () => {
      document.getElementById('film')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      window.setTimeout(play, 500);
    };
    window.addEventListener('rabench:play-film', on);
    return () => window.removeEventListener('rabench:play-film', on);
  }, [play]);
  useEffect(() => {
    try {
      localStorage.setItem('rabench-cc', cc ? '1' : '0');
    } catch {
      /* private mode */
    }
  }, [cc]);

  const seek = (s: number) => {
    const el = v.current;
    if (!el) return;
    el.currentTime = Math.max(0, Math.min(dur - 0.05, s));
    setT(el.currentTime);
    if (!started) play();
  };
  const fromX = (x: number) => {
    const r = bar.current!.getBoundingClientRect();
    return ((x - r.left) / r.width) * dur;
  };
  const cue = FILM.cues.find((c) => t >= c[0] && t < c[1]);
  const chapterAt = (s: number) => [...FILM.chapters].reverse().find((c) => s >= c.t);
  const cur = chapterAt(t);
  const toggle = () => (v.current?.paused ? play() : v.current?.pause());

  return (
    <div
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'k') { e.preventDefault(); toggle(); }
        if (e.key === 'ArrowRight') seek(t + 5);
        if (e.key === 'ArrowLeft') seek(t - 5);
        if (e.key === 'c') setCc((c) => !c);
        if (e.key === 'm') setMuted((m) => !m);
      }}
      tabIndex={0}
      className="outline-none"
    >
      <div className="viewfinder group relative aspect-video overflow-hidden rounded-[4px] bg-screen text-white shadow-[var(--shadow)]">
        <video
          ref={v}
          src={asset(FILM.src)}
          poster={asset(FILM.poster)}
          playsInline
          preload="metadata"
          muted={muted}
          className="absolute inset-0 h-full w-full"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onTimeUpdate={(e) => setT((e.target as HTMLVideoElement).currentTime)}
          onLoadedMetadata={(e) => setDur((e.target as HTMLVideoElement).duration || FILM.duration)}
          onClick={toggle}
        >
          <track kind="subtitles" srcLang="en" label="English + 中文" src={asset(FILM.vtt)} />
        </video>
        <span className="vf-c tl" /><span className="vf-c tr" /><span className="vf-c bl" /><span className="vf-c br" />
        <AnimatePresence>
          {!started && (
            <motion.button onClick={play} initial={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.04 }} transition={{ duration: 0.5 }} className="absolute inset-0 z-[5] grid place-items-center bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,.05),rgba(0,0,0,.45))]">
              <span className={`relative grid ${compact ? 'h-[64px] w-[64px]' : 'h-[88px] w-[88px]'} place-items-center rounded-full bg-white text-[#101726] shadow-2xl transition-transform duration-500 group-hover:scale-110`}>
                <span className="absolute inset-0 animate-ping rounded-full bg-white/40 [animation-duration:2.4s]" />
                <Icon name="play" size={30} className="relative ml-1" />
              </span>
              <span className={`absolute text-left ${compact ? 'bottom-5 left-8' : 'bottom-6 left-8'}`}>
                <span className={`block font-mono tracking-[0.14em] text-white/85 uppercase ${compact ? 'text-[9.5px]' : 'text-[11px]'}`}>Film · English narration · 中英字幕</span>
                
              </span>
              <span className={`absolute font-mono text-[12px] text-white/80 ${compact ? 'right-8 bottom-5' : 'right-8 bottom-6'}`}>{fmtT(dur)}</span>
            </motion.button>
          )}
        </AnimatePresence>
        {/* controls */}
        <div className={`absolute inset-x-0 bottom-0 z-[6] bg-gradient-to-t from-black/75 to-transparent px-5 pt-10 pb-3 transition-opacity duration-300 ${started ? (playing ? 'opacity-0 group-hover:opacity-100' : 'opacity-100') : 'pointer-events-none opacity-0'}`}>
          <div
            ref={bar}
            className="relative h-5 cursor-pointer"
            onPointerMove={(e) => setHoverT(fromX(e.clientX))}
            onPointerLeave={() => setHoverT(null)}
            onPointerDown={(e) => seek(fromX(e.clientX))}
          >
            <div className="absolute top-1/2 h-[3px] w-full -translate-y-1/2 rounded-full bg-white/25" />
            <div className="absolute top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-[var(--fake)]" style={{ width: `${(t / dur) * 100}%` }} />
            {FILM.chapters.slice(1).map((c) => (
              <span key={c.t} className="absolute top-1/2 h-[7px] w-[2px] -translate-y-1/2 bg-white/70" style={{ left: `${(c.t / dur) * 100}%` }} />
            ))}
            <span className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" style={{ left: `${(t / dur) * 100}%` }} />
            {hoverT !== null && (
              <span className="absolute -top-8 -translate-x-1/2 rounded-[2px] bg-black/80 px-2 py-1 font-mono text-[10.5px] whitespace-nowrap" style={{ left: `${(hoverT / dur) * 100}%` }}>
                {fmtT(hoverT)} · {chapterAt(hoverT)?.label}
              </span>
            )}
          </div>
          <div className="mt-1 flex items-center gap-3 font-mono text-[11px]">
            <button onClick={toggle} aria-label={playing ? 'Pause' : 'Play'} className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/15">
              <Icon name={playing ? 'pause' : 'play'} size={15} />
            </button>
            <span className="tnum text-white/80">{fmtT(t)} / {fmtT(dur)}</span>
            <span className="hidden text-white/60 sm:inline">· {cur?.label}</span>
            <span className="ml-auto" />
            <button onClick={() => setMuted((m) => !m)} aria-label="Mute" className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/15"><Icon name={muted ? 'mute' : 'volume'} size={16} /></button>
            <button onClick={() => setCc((c) => !c)} aria-label="Subtitles" className={`grid h-8 w-8 place-items-center rounded-full hover:bg-white/15 ${cc ? 'text-[var(--fake)]' : ''}`}><Icon name="cc" size={17} /></button>
            <button onClick={() => (v.current as HTMLVideoElement & { webkitEnterFullscreen?: () => void })?.requestFullscreen?.() ?? (v.current as HTMLVideoElement & { webkitEnterFullscreen?: () => void })?.webkitEnterFullscreen?.()} aria-label="Full screen" className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/15"><Icon name="full" size={15} /></button>
          </div>
        </div>
      </div>
      {/* subtitle strip */}
      {cc && FILM.cues.length > 0 && (
        <div className={`mt-0 grid rounded-b-[4px] border border-t-0 border-rule bg-card px-6 ${compact ? 'py-3' : 'py-4'} text-center`}>
          {FILM.cues.map((c, i) => (
            <div key={i} className="invisible col-start-1 row-start-1" aria-hidden>
              <div className={compact ? 'text-[14px]' : 'text-[16px]'}>{c[2]}</div>
              <div className="font-zh mt-1 text-[14px]">{c[3]}</div>
            </div>
          ))}
          <div className="col-start-1 row-start-1 self-center">
            <AnimatePresence mode="wait">
              {cue ? (
                <motion.div key={cue[0]} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                  <div className={`${compact ? 'text-[14px]' : 'text-[16px]'} leading-snug text-ink`}>{cue[2]}</div>
                  <div className="font-zh mt-1 text-[14px] leading-snug text-ink-3">{cue[3]}</div>
                </motion.div>
              ) : (
                <motion.div key="none" initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} className="font-mono text-[11px] tracking-[0.12em] text-ink-4 uppercase">{started ? '♪' : 'English narration · 中英双语字幕'}</motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {FILM.chapters.map((c) => (
          <button key={c.t} onClick={() => seek(c.t + 0.05)} className={`flex h-8 items-center gap-2 rounded-full border px-3 font-mono text-[11px] transition-colors ${cur?.t === c.t && started ? 'border-ink bg-ink text-paper' : 'border-rule text-ink-2 hover:border-ink'}`}>
            <span className="tnum opacity-60">{fmtT(c.t)}</span>
            {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}
