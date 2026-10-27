import { useState } from 'react';
import { motion } from 'motion/react';
import { Reveal, WordsRise } from '@/components/ui/Reveal';
import { SectionHead } from '@/components/ui/SectionHead';
import { Icon } from '@/components/ui/Icon';
import { Logo } from '@/components/ui/Logo';
import ClickSpark from '@/components/reactbits/ClickSpark/ClickSpark';
import LogoLoop from '@/components/reactbits/LogoLoop/LogoLoop';
import { AFFILIATIONS, AUTHORS, BIBTEX, LINKS, PAPER } from '@/data/paper';
import logos from '@/data/logos.json';
import { asset } from '@/lib/hooks';

const LESSONS = [
  { t: 'Report reliability per source, prompt and protocol.', d: 'One benchmark score hides source generalization, prompt sensitivity, protocol dependence and class bias. Measure them separately.' },
  { t: 'Combine evidence instead of trusting one classifier.', d: 'No family transfers on its own. Modular or agent-based workflows that pool detectors and forensic tools are the direction the results point to.' },
  { t: 'Test after the share, not only on the clean file.', d: 'Transcoding, downscaling and a badge push predictions toward “Real”. Robustness to the last mile has to be part of the evaluation.' },
];
const FUTURE = ['Robust detectors for the newest generators', 'Benchmarks for faithful detector explanations', 'Active watermarking, co-designed with passive detection', 'Audio-visual detection for generators that make sound', 'Detectors as reward models for more realistic generation'];

export function Outlook() {
  return (
    <section className="relative overflow-hidden border-y border-rule">
      <div className="mx-auto max-w-[1440px] px-6 py-28 lg:px-10 lg:py-36">
        <div className="text-center">
          <Reveal>
            <span className="kicker">What it means</span>
          </Reveal>
          <h2 className="font-display mx-auto mt-6 max-w-5xl text-[clamp(3rem,7.4vw,7rem)] leading-[0.92] tracking-[-0.035em]">
            <WordsRise text="Detection must survive" />
            <br />
            <WordsRise text="the real world." accent={['the', 'real', 'world.']} delay={0.2} />
          </h2>
        </div>
        <div className="mt-20 grid gap-px border border-rule bg-rule lg:grid-cols-3">
          {LESSONS.map((l, i) => (
            <Reveal key={l.t} delay={i * 0.08} className="bg-paper p-7">
              <div className="font-mono text-[11px] text-fake">0{i + 1}</div>
              <div className="font-display mt-4 text-[24px] leading-tight">{l.t}</div>
              <p className="mt-3 text-[14px] leading-relaxed text-ink-3">{l.d}</p>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-12">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="kicker mr-2">Future directions</span>
            {FUTURE.map((f) => (
              <span key={f} className="rounded-full border border-rule px-3 py-1.5 text-[13px] text-ink-2">{f}</span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Team() {
  const lead = AUTHORS.filter((a) => a.equal);
  const corr = AUTHORS.filter((a) => a.corr);
  const rest = AUTHORS.filter((a) => !a.equal && !a.corr);
  const affShort = (n: number) => AFFILIATIONS[n].replace('The Hong Kong University of Science and Technology', 'HKUST').replace('University of California, Berkeley', 'UC Berkeley').replace('National University of Singapore', 'NUS');
  return (
    <section id="team" className="relative mx-auto max-w-[1440px] px-6 py-28 lg:px-10 lg:py-36">
      <SectionHead no="05" kicker="Team" title="Thirty-six authors, nineteen institutions." accent={['nineteen']} lede="Video generation, multimedia forensics, multimodal reasoning and responsible AI." />
      <div className="mt-14 grid gap-px border border-rule bg-rule md:grid-cols-[1.2fr_2fr]">
        <div className="bg-paper p-6">
          <div className="kicker text-fake">Equal contribution</div>
          <div className="mt-4 space-y-4">
            {lead.map((a) => (
              <div key={a.name}>
                <div className="font-display text-[26px] leading-none">
                  {a.name}
                  <sup className="ml-0.5 text-[14px] text-fake">*{a.lead ? '§' : ''}</sup>
                </div>
                <div className="mt-1 text-[12.5px] text-ink-3">{a.lead ? 'Project lead · ' : ''}{a.aff.map(affShort).join(' · ')}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-paper p-6">
          <div className="kicker text-real">Corresponding authors</div>
          <div className="mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
            {corr.map((a) => (
              <div key={a.name}>
                <div className="font-display text-[22px] leading-none">
                  {a.name}
                  <sup className="ml-0.5 text-[13px] text-real">†</sup>
                </div>
                <div className="mt-1 text-[12.5px] text-ink-3">{a.aff.map(affShort).join(' · ')}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Reveal className="mt-8">
        <div className="columns-2 gap-8 text-[14px] sm:columns-3 lg:columns-5">
          {rest.map((a) => (
            <div key={a.name} className="flex break-inside-avoid items-baseline justify-between border-b border-rule-2 py-2">
              <span>{a.name}</span>
              <span className="font-mono text-[10px] text-ink-3">{a.aff.join(',')}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 grid gap-x-6 gap-y-1 text-[12px] text-ink-3 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(AFFILIATIONS).map(([k, v]) => (
            <span key={k}>
              <sup className="mr-1 font-mono">{k}</sup>
              {v}
            </span>
          ))}
        </div>
        <p className="mt-4 font-mono text-[10.5px] tracking-[0.08em] text-ink-3 uppercase">* equal contribution · § project lead · † corresponding author</p>
      </Reveal>
      <Reveal className="mt-14">
        <div className="rounded-[4px] border border-rule bg-white py-6 [&_img]:opacity-90 [&_img:hover]:opacity-100">
          <LogoLoop logos={logos.map((l, i) => ({ src: asset(l.src), alt: `affiliation ${i + 1}`, width: l.w * 0.6, height: 58 }))} speed={38} logoHeight={58} gap={56} pauseOnHover scaleOnHover fadeOut fadeOutColor="#ffffff" ariaLabel="Affiliations" />
        </div>
      </Reveal>
    </section>
  );
}

export function Cite() {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(BIBTEX).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    });
  };
  return (
    <section id="cite" className="relative border-t border-rule bg-paper-2/60">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-6 py-24 lg:grid-cols-12 lg:px-10">
        <div className="lg:col-span-4">
          <SectionHead no="06" kicker="Cite" title="Use RA-Bench." accent={['RA-Bench.']} />
          <div className="mt-8 flex flex-col gap-2.5">
            <a className="btn btn-dark justify-between" href={LINKS.arxiv} target="_blank" rel="noreferrer">Paper · arXiv {PAPER.arxivId} <Icon name="arrow" size={13} /></a>
            <a className="btn btn-line justify-between" href={LINKS.data} target="_blank" rel="noreferrer">Dataset · Hugging Face <Icon name="arrow" size={13} /></a>
            <a className="btn btn-line justify-between" href={LINKS.code} target="_blank" rel="noreferrer">Evaluation code · GitHub <Icon name="arrow" size={13} /></a>
          </div>
        </div>
        <div className="lg:col-span-8">
          <Reveal>
            <div className="relative overflow-hidden rounded-[4px] bg-screen text-[#d6dbe4]">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-3 font-mono text-[11px] tracking-[0.12em] text-white/60 uppercase">
                <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#ff5f57]" /><span className="h-2 w-2 rounded-full bg-[#febc2e]" /><span className="h-2 w-2 rounded-full bg-[#28c840]" /><span className="ml-2">bibtex</span></span>
                <ClickSpark sparkColor={['#ee4a22', '#7ea3ff', '#ffffff']} sparkCount={10} sparkRadius={26}>
                  <button onClick={copy} className="flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1 text-white/85 hover:border-white/60">
                    <Icon name={copied ? 'check' : 'copy'} size={13} /> {copied ? 'Copied' : 'Copy'}
                  </button>
                </ClickSpark>
              </div>
              <pre className="max-h-[360px] overflow-auto p-5 font-mono text-[12.5px] leading-relaxed whitespace-pre-wrap">{BIBTEX}</pre>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="mx-auto max-w-[1440px] px-6 py-12 lg:px-10">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <Logo />
        <p className="max-w-2xl text-[12px] leading-relaxed text-ink-3">
          Real videos as Anchors for evaluating AI-generated video detection. Every clip on this page comes from the public RA-Bench release; real footage shown here is US-government public domain (DVIDS).
        </p>
        <motion.a href="#top" whileHover={{ y: -2 }} className="flex items-center gap-2 font-mono text-[11px] tracking-[0.12em] text-ink-2 uppercase">
          Back to top <span className="rotate-180"><Icon name="down" size={14} /></span>
        </motion.a>
      </div>
    </footer>
  );
}
