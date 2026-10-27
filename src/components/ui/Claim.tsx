import type { ReactNode } from 'react';
import { Reveal } from './Reveal';
import { Fold } from './Fold';

/** a finding beside its figure: tag, the claim as a title, the numbers, one sentence, the rest folded */
export function Claim({ tag, title, stat, statNote, children, more }: { tag: string; title: string; stat?: ReactNode; statNote?: ReactNode; children?: ReactNode; more?: ReactNode }) {
  return (
    <Reveal>
      <div className="kicker text-fake">{tag}</div>
      <h4 className="font-display mt-3 text-[clamp(1.6rem,2.3vw,2.15rem)] leading-[1.08] tracking-[-0.015em] text-balance">{title}</h4>
      {stat && <div className="font-display tnum mt-5 text-[clamp(2.6rem,4vw,3.6rem)] leading-none tracking-[-0.025em]">{stat}</div>}
      {statNote && <div className="mt-2 font-mono text-[11px] tracking-[0.06em] text-ink-3 uppercase">{statNote}</div>}
      {children && <div className="mt-4 text-[15.5px] leading-relaxed text-ink-2">{children}</div>}
      {more && <Fold>{more}</Fold>}
    </Reveal>
  );
}
