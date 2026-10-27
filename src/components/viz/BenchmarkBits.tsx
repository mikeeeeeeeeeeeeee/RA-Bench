import { motion } from 'motion/react';
import { useState } from 'react';
import CountUp from '@/components/reactbits/CountUp/CountUp';
import { COMPARE, COMPARE_COLS, DOMAINS, PIPELINE } from '@/data/results';
import { useInView } from '@/lib/hooks';

const ease = [0.16, 1, 0.3, 1] as const;

/** Figure 2 as a running strip: five stages joined by a line that carries clips from left to right */
export function Pipeline() {
  const [ref, on] = useInView<HTMLDivElement>();
  const [hot, setHot] = useState<number | null>(null);
  return (
    <div ref={ref} className="relative">
      <svg className="pointer-events-none absolute -top-9 left-0 hidden h-6 w-full lg:block" preserveAspectRatio="none" viewBox="0 0 1000 24">
        <motion.line x1="0" y1="12" x2="1000" y2="12" stroke="var(--rule)" strokeWidth="1.5" initial={{ pathLength: 0 }} animate={on ? { pathLength: 1 } : {}} transition={{ duration: 1.6, ease }} />
        {on &&
          Array.from({ length: 9 }).map((_, i) => (
            <motion.rect key={i} y="9" width="10" height="6" rx="1" fill={i % 3 === 0 ? 'var(--real)' : 'var(--fake)'} initial={{ x: -20, opacity: 0 }} animate={{ x: [-20, 1010], opacity: [0, 1, 1, 0] }} transition={{ duration: 6, delay: 1.2 + i * 0.66, repeat: Infinity, ease: 'linear', times: [0, 0.05, 0.92, 1] }} />
          ))}
      </svg>
      <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-5">
        {PIPELINE.map((p, i) => (
          <motion.div
            key={p.step}
            onMouseEnter={() => setHot(i)}
            onMouseLeave={() => setHot(null)}
            initial={{ opacity: 0, y: 18 }}
            animate={on ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.25 + i * 0.12, ease }}
            className="relative pr-5"
          >
            <div className="flex items-center gap-3">
              <span className={`relative z-[1] grid h-[26px] w-[26px] place-items-center rounded-full border font-mono text-[11px] transition-colors duration-300 ${hot === i || i === 4 ? 'border-fake bg-fake text-white' : i === 3 ? 'border-real bg-real text-white' : 'border-ink bg-paper text-ink'}`}>{i + 1}</span>
              <span className="kicker text-ink">{p.step}</span>
            </div>
            <div className="font-display tnum mt-8 text-[clamp(2.2rem,3.2vw,3.1rem)] leading-none tracking-[-0.02em]">
              <CountUp to={p.n} duration={1.4 + i * 0.15} separator="," trigger="view" />
            </div>
            <div className="mt-2 text-[14px] font-medium text-ink">{p.unit}</div>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-3">{p.detail}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/** Figure 3(b): the 1,830 real anchors across ten risk domains, as one ribbon */
export function DomainRibbon() {
  const [ref, on] = useInView<HTMLDivElement>();
  const [hot, setHot] = useState<number | null>(null);
  const total = DOMAINS.reduce((a, d) => a + d.n, 0);
  const shade = (i: number) => `color-mix(in oklab, var(--ink) ${88 - i * 7}%, var(--paper))`;
  return (
    <div ref={ref}>
      <div className="flex h-14 w-full overflow-hidden rounded-[2px]">
        {DOMAINS.map((d, i) => (
          <motion.div
            key={d.code}
            onMouseEnter={() => setHot(i)}
            onMouseLeave={() => setHot(null)}
            className="relative h-full cursor-default border-r border-paper last:border-r-0"
            style={{ background: hot === i ? 'var(--fake)' : shade(i) }}
            initial={{ flexBasis: '0%' }}
            animate={on ? { flexBasis: `${(d.n / total) * 100}%` } : {}}
            transition={{ duration: 1.1, delay: i * 0.06, ease }}
          >
            <span className="absolute bottom-1.5 left-2 font-mono text-[10px] tracking-[0.08em] text-paper/90 uppercase">{d.n / total > 0.085 ? d.short : ''}</span>
          </motion.div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-1.5 sm:grid-cols-5">
        {DOMAINS.map((d, i) => (
          <div key={d.code} onMouseEnter={() => setHot(i)} onMouseLeave={() => setHot(null)} className={`flex items-baseline justify-between gap-2 border-b py-1.5 text-[12.5px] transition-colors ${hot === i ? 'border-fake text-ink' : 'border-rule-2 text-ink-3'}`}>
            <span className="truncate">{d.name}</span>
            <span className="tnum font-mono text-[11px]">{d.n}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Table 1: what earlier benchmarks cover; RA-Bench's row lights up mark by mark */
export function CompareMatrix({ compact = false }: { compact?: boolean }) {
  const [ref, on] = useInView<HTMLDivElement>();
  const mark = (v: number, hot: boolean, d: number) => {
    if (v === 2)
      return (
        <motion.svg width="22" height="22" viewBox="0 0 22 22" initial={{ scale: 0, rotate: -20 }} animate={on ? { scale: 1, rotate: 0 } : {}} transition={{ type: 'spring', stiffness: 300, damping: 14, delay: 0.9 + d * 0.12 }}>
          <circle cx="11" cy="11" r="10" fill="var(--fake)" />
          <motion.path d="m6.5 11.5 3 3 6-6.5" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={on ? { pathLength: 1 } : {}} transition={{ duration: 0.4, delay: 1.05 + d * 0.12 }} />
        </motion.svg>
      );
    if (v === 1) return <span className={`inline-block h-3.5 w-3.5 rounded-full border-[1.5px] ${hot ? 'border-ink' : 'border-ink-3'}`} title="partly" />;
    return <span className="inline-block h-[1.5px] w-3.5 bg-ink-4" title="no" />;
  };
  return (
    <div ref={ref} className="overflow-x-auto">
      <table className={`w-full border-collapse text-[13px] ${compact ? '' : 'min-w-[720px]'}`}>
        <thead>
          <tr className="border-b border-ink">
            <th className="py-3 pr-4 text-left font-mono text-[10.5px] font-normal tracking-[0.12em] text-ink-3 uppercase">Benchmark</th>
            {COMPARE_COLS.map((c, i) => (
              <th key={c} title={c} className="px-2 py-3 text-center font-mono text-[10.5px] font-normal tracking-[0.08em] text-ink-3 uppercase">{compact ? i + 1 : c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {COMPARE.map((r, ri) => {
            const hot = r.name === 'RA-Bench';
            return (
              <motion.tr key={r.name} initial={{ opacity: 0 }} animate={on ? { opacity: 1 } : {}} transition={{ delay: ri * 0.05 }} className={`border-b ${hot ? 'border-fake bg-fake-soft' : 'border-rule-2'}`}>
                <td className={`py-3 pr-4 ${hot ? 'font-display text-[18px] text-ink' : 'text-ink-2'}`}>{r.name}</td>
                {r.v.map((v, i) => (
                  <td key={i} className="px-2 py-3 text-center">
                    <span className="inline-grid place-items-center">{mark(v, hot, i)}</span>
                  </td>
                ))}
              </motion.tr>
            );
          })}
        </tbody>
      </table>
      {compact && (
        <ol className="mt-3 space-y-0.5 text-[12px] text-ink-3">
          {COMPARE_COLS.map((c, i) => (
            <li key={c}>
              <span className="mr-2 font-mono">{i + 1}</span>
              {c}
            </li>
          ))}
        </ol>
      )}
      <div className="mt-3 flex gap-5 font-mono text-[10.5px] tracking-[0.1em] text-ink-3 uppercase">
        <span className="flex items-center gap-2"><span className="inline-block h-3 w-3 rounded-full border-[1.5px] border-ink-3" /> partly</span>
        <span className="flex items-center gap-2"><span className="inline-block h-[1.5px] w-3 bg-ink-4" /> not covered</span>
      </div>
    </div>
  );
}
