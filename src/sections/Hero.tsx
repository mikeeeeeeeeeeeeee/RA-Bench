import { motion } from 'motion/react';
import DecryptedText from '@/components/reactbits/DecryptedText/DecryptedText';
import CountUp from '@/components/reactbits/CountUp/CountUp';
import { ForensicLens } from '@/components/viz/ForensicLens';
import { Icon } from '@/components/ui/Icon';
import { LINKS, PAPER, AUTHORS } from '@/data/paper';
import { COUNTS } from '@/data/results';
import media from '@/data/media.json';

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const lead = AUTHORS.filter((a) => a.equal);
  return (
    <section id="top" className="relative mx-auto max-w-[1440px] px-6 pt-[100px] lg:px-10">
      <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }} className="flex flex-wrap items-center gap-2.5">
            <a href={LINKS.hfPaper} target="_blank" rel="noreferrer" className="group flex h-7 items-center gap-2 rounded-full border border-rule bg-card pr-3 pl-1 font-mono text-[10.5px] tracking-[0.1em] text-ink-2 uppercase hover:border-ink">
              <span className="grid h-5 place-items-center rounded-full bg-[#ffd21e] px-2 font-semibold text-[#101726]">#1</span>
              HF Daily Papers
            </a>
            <a href={LINKS.arxiv} target="_blank" rel="noreferrer" className="flex h-7 items-center rounded-full border border-rule bg-card px-3 font-mono text-[10.5px] tracking-[0.1em] text-ink-2 uppercase hover:border-ink">
              arXiv {PAPER.arxivId}
            </a>
          </motion.div>

          <h1 className="font-display mt-6 text-[clamp(3rem,4.9vw,5.4rem)] leading-[0.95] tracking-[-0.03em]">
            <motion.span className="block" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.05, ease }}>
              Can we defend against
            </motion.span>
            <motion.span className="block italic text-fake" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.3 }}>
              <DecryptedText text="AI-generated" animateOn="view" speed={42} maxIterations={14} sequential revealDirection="start" characters="▚▞▙▟█▓▒░01#%&@" encryptedClassName="text-ink-4" />
            </motion.span>
            <motion.span className="block" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2, ease }}>
              crisis videos?
            </motion.span>
          </h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.55 }} className="font-display mt-6 max-w-[34rem] text-[21px] leading-snug text-ink-2 italic">
            A systematic evaluation of detectors, generators and social dissemination, anchored in footage of real crisis events.
          </motion.p>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.7 }} className="mt-5 max-w-[34rem]">
            <p className="text-[14px] text-ink-2">
              {lead.map((a, i) => (
                <span key={a.name}>
                  {a.name}
                  <sup className="text-fake">*{a.lead ? '§' : ''}</sup>
                  {i < lead.length - 1 ? ', ' : ''}
                </span>
              ))}
              <span className="text-ink-3"> and 33 co-authors</span>
            </p>
            <a href="#team" className="group mt-1.5 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.1em] text-ink-3 uppercase hover:text-ink">
              NUS · UC Berkeley · HKUST · Stanford · ETH Zürich · +14
              <span className="transition-transform duration-300 group-hover:translate-y-0.5">↓</span>
            </a>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.85, ease }} className="mt-8 flex flex-wrap gap-2.5">
            <a className="btn btn-dark" href={LINKS.arxiv} target="_blank" rel="noreferrer">
              <Icon name="paper" size={15} /> Paper <Icon name="arrow" size={13} />
            </a>
            <a className="btn btn-line" href={LINKS.data} target="_blank" rel="noreferrer">
              <Icon name="data" size={15} /> Dataset
            </a>
            <a className="btn btn-line" href={LINKS.code} target="_blank" rel="noreferrer">
              <Icon name="code" size={15} /> Code
            </a>
          </motion.div>

        </div>

        <motion.div className="lg:col-span-7" initial={{ opacity: 0, scale: 0.97, filter: 'blur(8px)' }} animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} transition={{ duration: 1.3, delay: 0.25, ease }}>
          <ForensicLens realSrc={media.hero.real.src} realPoster={media.hero.real.poster} gens={media.hero.gens} />
          <div className="mt-3 flex items-start justify-between gap-8">
            <p className="max-w-lg text-[13.5px] leading-relaxed text-ink-3">
              <span className="text-ink-2">Camp Bullis fire, Texas, 2022 — real footage (DVIDS) and three continuations generated from its first frame.</span> Each of the three fooled all five human reviewers who saw it.
            </p>
        <motion.a
          href="#film"
          onClick={() => window.dispatchEvent(new CustomEvent('rabench:play-film'))}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.1, ease }}
          className="group inline-flex shrink-0 items-center gap-3.5"
        >
          <span className="relative grid h-12 w-12 place-items-center rounded-full bg-fake text-white transition-transform duration-500 group-hover:scale-110">
            <span className="absolute inset-0 animate-ping rounded-full bg-fake/40 [animation-duration:2.6s]" />
            <Icon name="play" size={16} className="relative ml-0.5" />
          </span>
          <span>
            <span className="block text-[15px] font-medium text-ink">Watch the film</span>
            <span className="block font-mono text-[10.5px] tracking-[0.1em] text-ink-3 uppercase">1:34 · English narration · 中英字幕</span>
          </span>
        </motion.a>
          </div>
        </motion.div>
      </div>

      <Stats />
    </section>
  );
}

function Stats() {
  const items = [
    { n: COUNTS.videos, label: 'videos in total' },
    { n: COUNTS.anchors, label: 'real crisis anchors' },
    { n: COUNTS.generated, label: 'generated clips' },
    { n: COUNTS.generators, label: 'video generators', note: '4 open · 5 closed' },
    { n: COUNTS.l1, label: 'social-risk domains', note: '44 subcategories' },
  ];
  return (
    <div className="mt-12 grid grid-cols-2 border-y border-rule sm:grid-cols-3 lg:mt-14 lg:grid-cols-5">
      {items.map((it, i) => (
        <motion.div key={it.label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: i * 0.07, ease }} className={`px-5 py-5 ${i > 0 ? 'lg:border-l lg:border-rule' : ''}`}>
          <div className="font-display tnum text-[clamp(2.2rem,3.4vw,3.2rem)] leading-none tracking-[-0.02em]">
            <CountUp to={it.n} duration={1.6} separator="," trigger="view" />
          </div>
          <div className="kicker mt-3">{it.label}</div>
          {it.note && <div className="mt-1 font-mono text-[10.5px] text-ink-4">{it.note}</div>}
        </motion.div>
      ))}
    </div>
  );
}
