import { motion, LayoutGroup } from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { asset } from '@/lib/hooks';
import media from '@/data/media.json';
import { HUMAN, SOURCES } from '@/data/results';
import { Icon } from '@/components/ui/Icon';
import { Stamp } from '@/components/ui/Stamp';

/**
 * Same first frame, ten realities: the real rocket-launch anchor and its nine generated continuations,
 * restarted together so every tile leaves the shared frame at the same instant. Hover isolates a tile;
 * "Find the real one" hides the labels and shuffles the wall.
 */
type Tile = (typeof media.wall.tiles)[number];
const LOOP = 5.4;

export function GeneratorWall({ cols = 5 }: { cols?: number }) {
  const tiles = media.wall.tiles as Tile[];
  const [hover, setHover] = useState<string | null>(null);
  const [blind, setBlind] = useState(false);
  const [guess, setGuess] = useState<string | null>(null);
  const [order, setOrder] = useState(tiles.map((t) => t.key));
  const [phase, setPhase] = useState(0);
  const refs = useRef<Record<string, HTMLVideoElement | null>>({});
  const box = useRef<HTMLDivElement>(null);
  const [onScreen, setOnScreen] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { rootMargin: '100px' });
    if (box.current) io.observe(box.current);
    return () => io.disconnect();
  }, []);
  // one clock for the whole wall
  useEffect(() => {
    const vs = Object.values(refs.current).filter(Boolean) as HTMLVideoElement[];
    if (!onScreen) {
      vs.forEach((v) => v.pause());
      return;
    }
    const restart = () => {
      vs.forEach((v) => {
        v.currentTime = 0;
        v.play().catch(() => {});
      });
      setPhase((p) => p + 1);
    };
    restart();
    const t = window.setInterval(restart, LOOP * 1000);
    return () => window.clearInterval(t);
  }, [onScreen]);

  const byKey = useMemo(() => Object.fromEntries(tiles.map((t) => [t.key, t])), [tiles]);
  const info = (k: string) => {
    const s = SOURCES.find((x) => x.key === k);
    const h = HUMAN.bySource.find((x) => x.key === k);
    return { s, h };
  };
  const toggleBlind = () => {
    if (blind) {
      setBlind(false);
      setGuess(null);
      setOrder(tiles.map((t) => t.key));
    } else {
      const o = [...order];
      for (let i = o.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [o[i], o[j]] = [o[j], o[i]];
      }
      setOrder(o);
      setGuess(null);
      setBlind(true);
    }
  };

  return (
    <div ref={box}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.12em] text-ink-3 uppercase">
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 bg-real" /> Real anchor</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 border border-ink-3" /> Open-source</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 bg-fake" /> Closed-source</span>
        </div>
        <button onClick={toggleBlind} className={`flex h-9 items-center gap-2 rounded-full border px-4 font-mono text-[11px] tracking-[0.12em] uppercase transition-colors ${blind ? 'border-fake bg-fake text-white' : 'border-ink text-ink hover:bg-ink hover:text-paper'}`}>
          <Icon name={blind ? 'eye' : 'shuffle'} size={14} />
          {blind ? 'Show labels' : 'Find the real one'}
        </button>
      </div>
      <LayoutGroup>
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
          {order.map((k) => {
            const t = byKey[k];
            const real = k === 'real';
            const { s, h } = info(k);
            const dim = hover && hover !== k;
            const revealed = blind && guess !== null;
            const showLabel = !blind || revealed;
            return (
              <motion.button
                layout
                transition={{ type: 'spring', stiffness: 200, damping: 26 }}
                key={k}
                onMouseEnter={() => setHover(k)}
                onMouseLeave={() => setHover(null)}
                onClick={() => blind && !guess && setGuess(k)}
                className={`group relative aspect-video overflow-hidden rounded-[2px] bg-screen text-left text-white ${blind && !guess ? 'cursor-crosshair' : 'cursor-default'}`}
                style={{ zIndex: hover === k ? 5 : 1 }}
              >
                <motion.div className="absolute inset-0" animate={{ scale: hover === k ? 1.06 : 1, filter: dim ? 'grayscale(0.85) brightness(0.45)' : 'grayscale(0) brightness(1)' }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
                  <video ref={(el) => { refs.current[k] = el; }} src={asset(t.src)} poster={asset(t.poster)} muted playsInline preload="auto" className="h-full w-full object-cover" />
                </motion.div>
                {/* the shared first frame flashes at every restart */}
                <motion.span key={`f-${phase}`} className="pointer-events-none absolute inset-0 border-2 border-white" initial={{ opacity: 0.9 }} animate={{ opacity: 0 }} transition={{ duration: 0.9, delay: 0.15 }} />
                <span className={`pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/75 to-transparent transition-opacity ${showLabel ? 'opacity-100' : 'opacity-0'}`} />
                {showLabel && (
                  <span className="pointer-events-none absolute right-2.5 bottom-2 left-2.5 flex items-end justify-between gap-2">
                    <span>
                      <span className="flex items-center gap-1.5 font-mono text-[9.5px] tracking-[0.14em] uppercase opacity-80">
                        <span className={`h-2 w-2 ${real ? 'bg-[var(--real)]' : s?.family === 'closed' ? 'bg-[var(--fake)]' : 'border border-white/80'}`} />
                        {real ? 'Real anchor' : s?.family === 'closed' ? 'Closed' : 'Open'}
                      </span>
                      <span className="mt-0.5 block text-[14px] leading-tight font-semibold">{real ? 'Real · DVIDS' : s?.name}</span>
                    </span>
                    {!real && h && (
                      <span className="text-right font-mono text-[9.5px] leading-tight tracking-[0.06em] opacity-0 transition-opacity group-hover:opacity-90">
                        reviewers flagged
                        <b className="block text-[15px] font-semibold">{h.gen}%</b>
                      </span>
                    )}
                  </span>
                )}
                {real && showLabel && <span className="pointer-events-none absolute inset-0 rounded-[2px] ring-2 ring-[var(--real)] ring-inset" />}
                {revealed && guess === k && <Stamp kind={real ? 'real' : 'fake'} label={real ? 'Found it' : 'Generated'} size={0.7} />}
              </motion.button>
            );
          })}
        </div>
      </LayoutGroup>
      <p className="mt-3 min-h-6 text-[13.5px] text-ink-3">
        {blind
          ? guess === null
            ? 'Labels hidden and tiles shuffled. Click the clip you think is the real launch.'
            : guess === 'real'
              ? 'Right — the real launch. Nine generators had the same first frame and the same caption.'
              : 'That one was generated. The real launch is outlined in blue.'
          : 'Every tile starts on the same real frame and the same caption. Hover a tile to isolate it.'}
      </p>
    </div>
  );
}
