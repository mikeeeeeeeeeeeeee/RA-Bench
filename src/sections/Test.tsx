import { SectionHead } from '@/components/ui/SectionHead';
import { Reveal } from '@/components/ui/Reveal';
import { RealOrAI } from '@/components/viz/RealOrAI';
import { SpotTheFake } from '@/components/viz/SpotTheFake';

function RoundTag({ n, label }: { n: number; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-display text-[44px] leading-none text-fake italic">{n}</span>
      <span className="kicker">Round {n} · {label}</span>
    </div>
  );
}

export function Test() {
  return (
    <section id="test" className="relative mx-auto max-w-[1440px] px-6 py-24 lg:px-10 lg:py-28">
      {/* round 1: one clip at a time, frontier generators mixed with real footage */}
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <SectionHead no="02" kicker="Perception test" title="Can you tell real from generated?" accent={['generated?']} />
            <Reveal delay={0.15}>
              <div className="mt-10 border-t border-rule pt-6">
                <RoundTag n={1} label="One clip at a time" />
                <p className="mt-4 text-[16px] leading-relaxed text-ink-2">Six clips. Three are real footage; three were made from a single sentence by the newest generators, <b className="font-semibold text-ink">Seedance 2.5</b> and <b className="font-semibold text-ink">MiniMax-H3</b>. Real or AI?</p>
                <p className="mt-4 text-[13px] leading-relaxed text-ink-3">Neither model is in RA-Bench. Real clips are RA-Bench anchors (DVIDS, NOAA, Pexels). Every clip is cut to 5 s at 720p with no sound, so format gives nothing away.</p>
              </div>
            </Reveal>
          </div>
        </div>
        <div className="lg:col-span-8">
          <Reveal>
            <RealOrAI />
          </Reveal>
        </div>
      </div>

      {/* round 2: the RA-Bench setting, a real clip beside its forgery */}
      <div id="pairs" className="mt-24 grid scroll-mt-24 gap-12 border-t border-rule pt-16 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <Reveal>
              <RoundTag n={2} label="Side by side" />
              <h3 className="font-display mt-5 text-[clamp(1.9rem,2.8vw,2.6rem)] leading-[1.04] tracking-[-0.02em] text-balance">Same first frame. Which one is generated?</h3>
              <p className="mt-4 text-[16px] leading-relaxed text-ink-2">Five pairs from RA-Bench-HumanProof. In each, one clip is real and one continues it from its first frame — and the generated one fooled every reviewer who saw it.</p>
            </Reveal>
            <Reveal delay={0.15}>
              <ul className="mt-6 space-y-3 border-t border-rule pt-6 text-[14px] text-ink-2">
                <li className="flex gap-3"><span className="font-mono text-[11px] text-fake">01</span>Both clips share their first frame and length.</li>
                <li className="flex gap-3"><span className="font-mono text-[11px] text-fake">02</span>Click the clip you think was generated.</li>
                <li className="flex gap-3"><span className="font-mono text-[11px] text-fake">03</span>Compare yourself with our reviewers at the end.</li>
              </ul>
            </Reveal>
          </div>
        </div>
        <div className="lg:col-span-8">
          <Reveal>
            <SpotTheFake />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
