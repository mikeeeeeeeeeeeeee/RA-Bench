import type { ReactNode } from 'react';
import { Reveal, WordsRise } from './Reveal';

/** "03 — KICKER" label, a large serif title with an optional italic accent word, and a one-line lede */
export function SectionHead({ no, kicker, title, accent, lede, align = 'left', invert = false, children }: { no: string; kicker: string; title: string; accent?: string[]; lede?: ReactNode; align?: 'left' | 'center'; invert?: boolean; children?: ReactNode }) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-4xl text-center' : 'max-w-5xl'}>
      <Reveal>
        <div className={`flex items-center gap-3 ${align === 'center' ? 'justify-center' : ''}`}>
          <span className={`grid h-6 min-w-8 place-items-center px-1.5 font-mono text-[11px] font-semibold ${invert ? 'bg-paper text-ink' : 'bg-ink text-paper'}`}>{no}</span>
          <span className="kicker" style={invert ? { color: 'var(--ink-2)' } : undefined}>{kicker}</span>
        </div>
      </Reveal>
      <h2 className="font-display mt-6 text-[clamp(2.4rem,5.2vw,4.6rem)] leading-[0.98] tracking-[-0.025em] text-balance">
        <WordsRise text={title} accent={accent} />
      </h2>
      {lede && (
        <Reveal delay={0.15}>
          <p className={`mt-6 max-w-2xl text-[17px] leading-relaxed text-ink-2 ${align === 'center' ? 'mx-auto' : ''}`}>{lede}</p>
        </Reveal>
      )}
      {children}
    </div>
  );
}
