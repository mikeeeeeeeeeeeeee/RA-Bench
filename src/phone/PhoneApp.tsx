import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState, type ReactNode } from 'react';
import DecryptedText from '@/components/reactbits/DecryptedText/DecryptedText';
import CountUp from '@/components/reactbits/CountUp/CountUp';
import LogoLoop from '@/components/reactbits/LogoLoop/LogoLoop';
import ClickSpark from '@/components/reactbits/ClickSpark/ClickSpark';
import { Logo } from '@/components/ui/Logo';
import { Icon } from '@/components/ui/Icon';
import { ThemeToggle, ViewToggle } from '@/components/ui/Toggles';
import { Reveal, WordsRise } from '@/components/ui/Reveal';
import { Claim } from '@/components/ui/Claim';
import { ForensicLens } from '@/components/viz/ForensicLens';
import { FilmPlayer } from '@/components/viz/FilmPlayer';
import { SpotTheFake } from '@/components/viz/SpotTheFake';
import { GeneratorWall } from '@/components/viz/GeneratorWall';
import { CompareMatrix, DomainRibbon, Pipeline } from '@/components/viz/BenchmarkBits';
import { BusterBias, DetectorDrop, PromptRoulette, TimestampTrap } from '@/components/viz/Detectors';
import { Conditioning, HumanBars, HumanProofMeters, LastMile, QualityFacts } from '@/components/viz/Findings';
import { AFFILIATIONS, AUTHORS, BIBTEX, LINKS, PAPER } from '@/data/paper';
import { COUNTS } from '@/data/results';
import media from '@/data/media.json';
import logos from '@/data/logos.json';
import { asset } from '@/lib/hooks';

const CHAPTERS = [
  { id: 'top', label: 'Overview' },
  { id: 'film', label: 'Film' },
  { id: 'test', label: 'Test yourself' },
  { id: 'benchmark', label: 'Benchmark' },
  { id: 'generalize', label: 'Detectors' },
  { id: 'generation', label: 'Generation' },
  { id: 'humans', label: 'People' },
  { id: 'lastmile', label: 'Sharing' },
  { id: 'team', label: 'Team' },
  { id: 'cite', label: 'Cite' },
];

function PBar({ onMenu }: { onMenu: () => void }) {
  const [cur, setCur] = useState('Overview');
  const [p, setP] = useState(0);
  useEffect(() => {
    const on = () => {
      let c = 'Overview';
      for (const ch of CHAPTERS) {
        const el = document.getElementById(ch.id);
        if (el && el.getBoundingClientRect().top < 120) c = ch.label;
      }
      setCur(c);
      setP(scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight));
    };
    on();
    addEventListener('scroll', on, { passive: true });
    return () => removeEventListener('scroll', on);
  }, []);
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-rule bg-paper pt-[env(safe-area-inset-top)]">
      <div className="flex h-14 items-center gap-2 px-4">
        <a href="#top" aria-label="Back to top"><Logo size={0.9} /></a>
        <AnimatePresence mode="wait">
          <motion.span key={cur} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="ml-1 truncate font-mono text-[10.5px] tracking-[0.12em] text-ink-3 uppercase">
            {cur}
          </motion.span>
        </AnimatePresence>
        <div className="ml-auto flex items-center gap-1.5">
          <ViewToggle current="phone" />
          <ThemeToggle />
          <button onClick={onMenu} aria-label="Chapters" className="grid h-9 w-9 place-items-center rounded-full border border-rule bg-card">
            <Icon name="menu" size={16} />
          </button>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-[-1px] h-[2px] origin-left bg-fake" style={{ transform: `scaleX(${p})` }} />
    </header>
  );
}

function Sheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-[60] bg-black/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.nav className="fixed inset-x-0 bottom-0 z-[61] rounded-t-[18px] border-t border-rule bg-paper px-5 pt-3 pb-[calc(20px+env(safe-area-inset-bottom))]" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', stiffness: 320, damping: 34 }} drag="y" dragConstraints={{ top: 0, bottom: 0 }} dragElastic={{ top: 0, bottom: 0.6 }} onDragEnd={(_, i) => i.offset.y > 80 && onClose()}>
            <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-rule" />
            <div className="kicker mb-2">Chapters</div>
            <ul>
              {CHAPTERS.map((c, i) => (
                <li key={c.id}>
                  <a href={`#${c.id}`} onClick={onClose} className="flex items-baseline gap-4 border-b border-rule-2 py-3.5">
                    <span className="font-mono text-[11px] text-fake">{String(i).padStart(2, '0')}</span>
                    <span className="font-display text-[22px] leading-none">{c.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}

function PSection({ id, no, kicker, title, accent, lede, children, tint = false }: { id: string; no: string; kicker: string; title: string; accent?: string[]; lede?: ReactNode; children: ReactNode; tint?: boolean }) {
  return (
    <section id={id} className={`scroll-mt-14 px-5 py-16 ${tint ? 'border-y border-rule bg-paper-2/60' : ''}`}>
      <Reveal>
        <div className="flex items-center gap-3">
          <span className="grid h-6 min-w-8 place-items-center bg-ink px-1.5 font-mono text-[11px] font-semibold text-paper">{no}</span>
          <span className="kicker">{kicker}</span>
        </div>
      </Reveal>
      <h2 className="font-display mt-4 text-[34px] leading-[1.02] tracking-[-0.02em] text-balance [hyphens:none]">
        <WordsRise text={title} accent={accent} />
      </h2>
      {lede && (
        <Reveal delay={0.1}>
          <p className="mt-4 text-[16.5px] leading-[1.6] text-ink-2">{lede}</p>
        </Reveal>
      )}
      <div className="mt-8">{children}</div>
    </section>
  );
}

function Sub({ tag, title, children }: { tag: string; title: string; children: ReactNode }) {
  return (
    <div className="mt-12 border-t border-rule pt-8">
      <div className="kicker text-fake">{tag}</div>
      <h3 className="font-display mt-2 text-[25px] leading-[1.1] [hyphens:none]">{title}</h3>
      <div className="mt-5">{children}</div>
    </div>
  );
}

export default function PhoneApp() {
  const [menu, setMenu] = useState(false);
  const lead = AUTHORS.filter((a) => a.equal), corr = AUTHORS.filter((a) => a.corr), rest = AUTHORS.filter((a) => !a.equal && !a.corr);
  const [copied, setCopied] = useState(false);
  return (
    <>
      <PBar onMenu={() => setMenu(true)} />
      <Sheet open={menu} onClose={() => setMenu(false)} />
      <main className="pt-[calc(56px+env(safe-area-inset-top))] text-[16.5px]">
        {/* hero */}
        <section id="top" className="px-5 pt-8 pb-12">
          <div className="flex flex-wrap gap-2">
            <a href={LINKS.hfPaper} target="_blank" rel="noreferrer" className="flex h-7 items-center gap-2 rounded-full border border-rule bg-card pr-3 pl-1 font-mono text-[10px] tracking-[0.1em] text-ink-2 uppercase">
              <span className="grid h-5 place-items-center rounded-full bg-[#ffd21e] px-2 font-semibold text-[#101726]">#1</span>HF Daily Papers
            </a>
            <a href={LINKS.arxiv} target="_blank" rel="noreferrer" className="flex h-7 items-center rounded-full border border-rule bg-card px-3 font-mono text-[10px] tracking-[0.1em] text-ink-2 uppercase">arXiv {PAPER.arxivId}</a>
          </div>
          <h1 className="font-display mt-6 text-[clamp(2.6rem,12vw,3.4rem)] leading-[0.96] tracking-[-0.03em] [hyphens:none]">
            Can we defend against <span className="block italic text-fake"><DecryptedText text="AI-generated" animateOn="view" speed={42} maxIterations={14} sequential characters="▚▞▙▟█▓▒░01#%&@" encryptedClassName="text-ink-4" /></span> crisis videos?
          </h1>
          <p className="font-display mt-5 text-[19px] leading-snug text-ink-2 italic">A systematic evaluation of detectors, generators and social dissemination, anchored in real crisis footage.</p>
          <div className="mt-7 -mx-1">
            <ForensicLens realSrc={media.hero.real.src} realPoster={media.hero.real.poster} gens={media.hero.gens} compact />
          </div>
          <p className="mt-3 text-[13px] leading-relaxed text-ink-3">Camp Bullis fire, Texas — real footage, and continuations generated from its first frame. All three fooled every reviewer who saw them. Drag the lens.</p>
          <div className="mt-7 grid grid-cols-2 gap-2">
            <a className="btn btn-dark justify-center" href={LINKS.arxiv} target="_blank" rel="noreferrer"><Icon name="paper" size={15} /> Paper</a>
            <a className="btn btn-line justify-center" href="#film" onClick={() => window.dispatchEvent(new CustomEvent('rabench:play-film'))}><Icon name="play" size={13} /> Film</a>
            <a className="btn btn-line justify-center" href={LINKS.data} target="_blank" rel="noreferrer"><Icon name="data" size={15} /> Dataset</a>
            <a className="btn btn-line justify-center" href={LINKS.code} target="_blank" rel="noreferrer"><Icon name="code" size={15} /> Code</a>
          </div>
          <div className="mt-10 grid grid-cols-2 border-t border-rule">
            {[
              { n: COUNTS.videos, l: 'videos' },
              { n: COUNTS.anchors, l: 'real anchors' },
              { n: COUNTS.generated, l: 'generated clips' },
              { n: COUNTS.generators, l: 'generators' },
            ].map((s, i) => (
              <div key={s.l} className={`border-b border-rule py-4 ${i % 2 ? 'pl-4' : 'border-r pr-4'}`}>
                <div className="font-display tnum text-[34px] leading-none"><CountUp to={s.n} separator="," trigger="view" duration={1.4} /></div>
                <div className="kicker mt-2">{s.l}</div>
              </div>
            ))}
          </div>
        </section>

        <PSection id="film" no="01" kicker="The film" title="Ninety seconds, one question." accent={['one', 'question.']}>
          <FilmPlayer compact />
        </PSection>

        <PSection id="test" no="02" kicker="Perception test" title="Can you tell real from generated?" accent={['generated?']} lede="Five pairs. Each generated clip fooled all five of our reviewers. Tap the one you think is generated." tint>
          <SpotTheFake />
        </PSection>

        <PSection id="benchmark" no="03" kicker="The benchmark" title="Same first frame. Ten realities." accent={['Ten', 'realities.']} lede={<>Each real crisis clip hands its first frame and one shared caption to nine generators.</>}>
          <GeneratorWall cols={2} />
          <Sub tag="Construction" title="675 public videos → 17,886 clips">
            <Pipeline />
          </Sub>
          <Sub tag="Coverage" title="Ten risk domains, no quotas">
            <DomainRibbon />
          </Sub>
          <Sub tag="Table 1" title="What earlier benchmarks leave out">
            <CompareMatrix compact />
          </Sub>
        </PSection>

        <PSection id="generalize" no="04" kicker="Finding 1" title="None of the three detector families generalizes." accent={['None']} tint>
          <Claim tag="Traditional detectors" title="Public scores do not survive real anchors." stat={<>84.2 <span className="text-ink-4">→</span> 51.3</>} statNote="7-detector mean AUC">Seven detectors at 67.6–98.6 AUC on public benchmarks average 43.9–57.3 per generator here.</Claim>
          <div className="mt-6"><DetectorDrop compact /></div>
          <Sub tag="Zero-shot multimodal models" title="Change the prompt, and the verdict flips.">
            <PromptRoulette compact />
            <ul className="mt-5 space-y-3 text-[15px] text-ink-2">
              <li><b className="font-display text-[22px] text-ink">19.7 → 97.8 → 100%</b><br />Qwen3.5-0.8B's fake recall across the three prompts.</li>
              <li><b className="font-display text-[22px] text-teal">≥ 51.8%</b><br />Gemini-3.1-Pro: stable and strongest, still about 63% BAcc.</li>
              <li><b className="font-display text-[22px] text-ink">2.9–4.4%</b><br />GPT-5.5: stable because it calls almost everything real.</li>
            </ul>
          </Sub>
          <Sub tag="Fine-tuned detectors" title="A detector was partly reading the clock.">
            <TimestampTrap compact />
            <div className="mt-8"><BusterBias /></div>
          </Sub>
        </PSection>

        <PSection id="generation" no="05" kicker="Finding 2" title="Generation properties cut differently for each family." accent={['differently']}>
          <Conditioning compact />
          <div className="mt-8"><QualityFacts /></div>
        </PSection>

        <PSection id="humans" no="06" kicker="Finding 3" title="What fools people fools detectors." accent={['detectors.']} tint>
          <Claim tag="Human reviewers" title="Closed-source generators fool people more often." stat={<>68.6 <span className="text-ink-4">vs</span> 52.9%</>} statNote="flagged as generated · open vs closed" />
          <div className="mt-6"><HumanBars compact /></div>
          <Sub tag="RA-Bench-HumanProof" title="633 clips all five reviewers called real.">
            <HumanProofMeters />
          </Sub>
        </PSection>

        <PSection id="lastmile" no="07" kicker="RA-Bench-LastMile" title="Every share erases evidence." accent={['erases']} lede="Follow one generated wildfire clip through the paper's dissemination chain.">
          <LastMile compact />
        </PSection>

        <section className="border-y border-rule px-5 py-16 text-center">
          <h2 className="font-display text-[44px] leading-[0.95] tracking-[-0.03em]">
            <WordsRise text="Detection must survive" /> <WordsRise text="the real world." accent={['the', 'real', 'world.']} delay={0.15} />
          </h2>
          <p className="mt-5 text-[15px] text-ink-3">Report reliability per source, prompt and protocol; combine evidence; test after the share, not only on the clean file.</p>
        </section>

        <PSection id="team" no="08" kicker="Team" title="Thirty-six authors, nineteen institutions." accent={['nineteen']}>
          <div className="space-y-3">
            {lead.map((a) => (
              <div key={a.name} className="flex items-baseline justify-between border-b border-rule-2 pb-2">
                <span className="font-display text-[22px]">{a.name}<sup className="text-fake">*{a.lead ? '§' : ''}</sup></span>
                <span className="font-mono text-[10.5px] text-ink-3">{a.aff.join(',')}</span>
              </div>
            ))}
            {corr.map((a) => (
              <div key={a.name} className="flex items-baseline justify-between border-b border-rule-2 pb-2">
                <span className="font-display text-[20px]">{a.name}<sup className="text-real">†</sup></span>
                <span className="font-mono text-[10.5px] text-ink-3">{a.aff.join(',')}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 columns-2 gap-5 text-[14px]">
            {rest.map((a) => (
              <div key={a.name} className="flex break-inside-avoid justify-between border-b border-rule-2 py-1.5">
                <span>{a.name}</span>
                <span className="font-mono text-[10px] text-ink-3">{a.aff.join(',')}</span>
              </div>
            ))}
          </div>
          <details className="mt-5 text-[12.5px] text-ink-3">
            <summary className="cursor-pointer font-mono text-[11px] tracking-[0.12em] uppercase">Affiliations</summary>
            <div className="mt-2 space-y-0.5">
              {Object.entries(AFFILIATIONS).map(([k, v]) => (<div key={k}><sup className="mr-1 font-mono">{k}</sup>{v}</div>))}
            </div>
          </details>
          <div className="mt-8 rounded-[4px] border border-rule bg-white py-4">
            <LogoLoop logos={logos.map((l, i) => ({ src: asset(l.src), alt: `affiliation ${i + 1}`, width: l.w * 0.45, height: 44 }))} speed={32} logoHeight={44} gap={40} fadeOut fadeOutColor="#ffffff" ariaLabel="Affiliations" />
          </div>
        </PSection>

        <PSection id="cite" no="09" kicker="Cite" title="Use RA-Bench." accent={['RA-Bench.']} tint>
          <div className="relative overflow-hidden rounded-[4px] bg-screen text-[#d6dbe4]">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5 font-mono text-[10.5px] tracking-[0.12em] text-white/60 uppercase">
              <span>bibtex</span>
              <ClickSpark sparkColor={['#ee4a22', '#7ea3ff', '#ffffff']} sparkCount={10} sparkRadius={24}>
                <button onClick={() => navigator.clipboard?.writeText(BIBTEX).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1600); })} className="flex items-center gap-1.5 rounded-full border border-white/25 px-3 py-1 text-white/85">
                  <Icon name={copied ? 'check' : 'copy'} size={13} /> {copied ? 'Copied' : 'Copy'}
                </button>
              </ClickSpark>
            </div>
            <pre className="max-h-[300px] overflow-auto p-4 font-mono text-[11.5px] leading-relaxed whitespace-pre-wrap">{BIBTEX}</pre>
          </div>
          <div className="mt-5 grid gap-2">
            <a className="btn btn-dark justify-between" href={LINKS.arxiv} target="_blank" rel="noreferrer">arXiv {PAPER.arxivId} <Icon name="arrow" size={13} /></a>
            <a className="btn btn-line justify-between" href={LINKS.data} target="_blank" rel="noreferrer">Hugging Face dataset <Icon name="arrow" size={13} /></a>
            <a className="btn btn-line justify-between" href={LINKS.code} target="_blank" rel="noreferrer">GitHub code <Icon name="arrow" size={13} /></a>
          </div>
        </PSection>
        <footer className="px-5 pt-8 pb-[calc(32px+env(safe-area-inset-bottom))] text-[12px] leading-relaxed text-ink-3">
          <Logo size={0.9} />
          <p className="mt-3">Every clip comes from the public RA-Bench release; real footage shown is US-government public domain (DVIDS). The synthetic news badge's logo is blurred.</p>
        </footer>
      </main>
    </>
  );
}
