import { SectionHead } from '@/components/ui/SectionHead';
import { SpotTheFake } from '@/components/viz/SpotTheFake';
import { Reveal } from '@/components/ui/Reveal';

export function Test() {
  return (
    <section id="test" className="relative mx-auto max-w-[1440px] px-6 py-28 lg:px-10 lg:py-36">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionHead no="02" kicker="Perception test" title="Can you tell real from generated?" accent={['generated?']} lede="Five pairs from RA-Bench-HumanProof. In each, one clip is real and one is generated — and the generated one fooled every reviewer who saw it." />
          <Reveal delay={0.2}>
            <ul className="mt-8 space-y-3 border-t border-rule pt-6 text-[14px] text-ink-2">
              <li className="flex gap-3"><span className="font-mono text-[11px] text-fake">01</span>Both clips share their first frame and length.</li>
              <li className="flex gap-3"><span className="font-mono text-[11px] text-fake">02</span>Click the clip you think was generated.</li>
              <li className="flex gap-3"><span className="font-mono text-[11px] text-fake">03</span>Compare yourself with our reviewers at the end.</li>
            </ul>
          </Reveal>
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
