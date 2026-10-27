import { SectionHead } from '@/components/ui/SectionHead';
import { Reveal } from '@/components/ui/Reveal';
import { GeneratorWall } from '@/components/viz/GeneratorWall';
import { CompareMatrix, DomainRibbon, Pipeline } from '@/components/viz/BenchmarkBits';

export function Benchmark() {
  return (
    <section id="benchmark" className="relative border-y border-rule bg-paper-2/60">
      <div className="mx-auto max-w-[1440px] px-6 py-28 lg:px-10 lg:py-36">
        <div className="grid items-end gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionHead no="03" kicker="The benchmark" title="Same first frame. Ten realities." accent={['Ten', 'realities.']} />
          </div>
          <Reveal className="lg:col-span-5" delay={0.1}>
            <p className="text-[17px] leading-relaxed text-ink-2">
              RA-Bench uses <b className="font-semibold text-ink">real videos as anchors</b>. Each real crisis clip hands its first frame and one shared caption to nine image-to-video generators — so a detector cannot win by spotting a scene that never existed.
            </p>
          </Reveal>
        </div>
        <Reveal className="mt-14">
          <GeneratorWall />
        </Reveal>

        <div className="mt-28">
          <Reveal>
            <div className="flex items-baseline justify-between gap-4 border-b border-ink pb-3">
              <h3 className="font-display text-[30px] leading-none">From 675 public videos to 17,886 clips</h3>
              <span className="kicker hidden sm:block">Figure 2 · five stages</span>
            </div>
          </Reveal>
          <div className="mt-10">
            <Pipeline />
          </div>
        </div>

        <div className="mt-24 grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <div className="flex items-baseline justify-between gap-4 border-b border-ink pb-3">
                <h3 className="font-display text-[26px] leading-none">Ten risk domains</h3>
                <span className="kicker">1,830 anchors</span>
              </div>
              <p className="mt-4 mb-6 text-[14px] text-ink-3">No quotas: categories keep the frequency they have in public footage. 44 subcategories in all.</p>
              <DomainRibbon />
            </Reveal>
          </div>
          <div className="lg:col-span-7">
            <Reveal delay={0.1}>
              <div className="flex items-baseline justify-between gap-4 border-b border-ink pb-3">
                <h3 className="font-display text-[26px] leading-none">What earlier benchmarks leave out</h3>
                <span className="kicker">Table 1</span>
              </div>
              <div className="mt-4">
                <CompareMatrix />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
