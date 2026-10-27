import { useState } from 'react';
import { SectionHead } from '@/components/ui/SectionHead';
import { Reveal } from '@/components/ui/Reveal';
import { FrontierGallery, RealOrAI } from '@/components/viz/RealOrAI';
import data from '@/data/realorai.json';

export function Test() {
  const [unlocked, setUnlocked] = useState(false);
  return (
    <section id="test" className="relative mx-auto max-w-[1440px] px-6 py-24 lg:px-10 lg:py-28">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <SectionHead no="02" kicker="Perception test" title="Real or AI?" accent={['AI?']} lede="Ten clips, one at a time. Some are real footage. The rest were made from a single sentence by three of the newest video generators." />
            <Reveal delay={0.2}>
              <div className="mt-8 space-y-2.5 border-t border-rule pt-6">
                {[
                  ['MiniMax-H3', 'MiniMax'],
                  ['Seedance 2.5', 'ByteDance'],
                  ['Wan 3.0', 'Alibaba'],
                ].map(([m, by]) => (
                  <div key={m} className="flex items-baseline justify-between">
                    <span className="font-display text-[22px] leading-none">{m}</span>
                    <span className="font-mono text-[10.5px] tracking-[0.12em] text-ink-3 uppercase">{by}</span>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-[13px] leading-relaxed text-ink-3">
                None of these three is in RA-Bench. AI clips come from VBench-2.0 prompts, sampled at random (seed {data.sampling.match(/seed (\d+)/)?.[1]}) with no quality filtering. Real clips are RA-Bench anchors from DVIDS, NOAA and Pexels. Every clip is cut to 5 s at 720p with no sound, so format gives nothing away.
              </p>
            </Reveal>
          </div>
        </div>
        <div className="lg:col-span-8">
          <Reveal>
            <RealOrAI onDone={() => setUnlocked(true)} />
          </Reveal>
        </div>
      </div>
      <div className="mt-20">
        <Reveal>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
            <h3 className="font-display max-w-2xl text-[clamp(1.9rem,3.2vw,2.8rem)] leading-[1.02] tracking-[-0.02em]">
              The frontier, <em className="text-fake">unfiltered.</em>
            </h3>
            <p className="max-w-md text-[14px] leading-relaxed text-ink-3">Five random clips per model, each beside the sentence it came from. Hover to play.</p>
          </div>
        </Reveal>
        <FrontierGallery unlocked={unlocked} onReveal={() => setUnlocked(true)} />
      </div>
    </section>
  );
}
