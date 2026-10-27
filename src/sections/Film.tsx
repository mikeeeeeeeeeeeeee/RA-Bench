import { SectionHead } from '@/components/ui/SectionHead';
import { Reveal } from '@/components/ui/Reveal';
import { FilmPlayer } from '@/components/viz/FilmPlayer';

export function Film() {
  return (
    <section id="film" className="relative mx-auto max-w-[1440px] px-6 pt-28 lg:px-10 lg:pt-36">
      <div className="grid items-end gap-8 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <SectionHead no="01" kicker="The film" title="Ninety seconds, one question." accent={['one', 'question.']} />
        </div>
        <Reveal className="lg:col-span-6" delay={0.1}>
          <p className="text-[17px] leading-relaxed text-ink-2">The whole paper in a minute and a half, narrated in English with English and Chinese subtitles. Every clip in it comes from the RA-Bench release.</p>
        </Reveal>
      </div>
      <Reveal className="mx-auto mt-12 max-w-[1180px]">
        <FilmPlayer />
      </Reveal>
    </section>
  );
}
