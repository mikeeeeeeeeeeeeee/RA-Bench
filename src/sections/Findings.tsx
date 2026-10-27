import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { SectionHead } from '@/components/ui/SectionHead';
import { Reveal } from '@/components/ui/Reveal';
import { Claim } from '@/components/ui/Claim';
import { BusterBias, DetectorDrop, PromptRoulette, TimestampTrap } from '@/components/viz/Detectors';
import { Conditioning, HumanBars, HumanProofMeters, LastMile, QualityFacts } from '@/components/viz/Findings';

function Row({ claim, figure, flip = false }: { claim: ReactNode; figure: ReactNode; flip?: boolean }) {
  return (
    <div className="grid items-start gap-10 border-t border-rule pt-12 lg:grid-cols-12 lg:gap-14">
      <div className={`lg:col-span-4 ${flip ? 'lg:order-2' : ''} lg:sticky lg:top-28`}>{claim}</div>
      <div className={`lg:col-span-8 ${flip ? 'lg:order-1' : ''}`}>
        <Reveal>{figure}</Reveal>
      </div>
    </div>
  );
}

function FindingHead({ id, n, title, accent, lede }: { id: string; n: string; title: string; accent?: string; lede: string }) {
  return (
    <div id={id} className="scroll-mt-24 pt-24 pb-10">
      <Reveal>
        <div className="flex items-center gap-4">
          <span className="font-display text-[88px] leading-[0.8] text-fake italic">{n}</span>
          <span className="kicker">Finding {n}</span>
        </div>
      </Reveal>
      <h3 className="font-display mt-6 max-w-4xl text-[clamp(2.2rem,4.4vw,3.9rem)] leading-[1] tracking-[-0.025em] text-balance">
        {accent ? (
          <>
            {title.split(accent)[0]}
            <em className="text-fake">{accent}</em>
            {title.split(accent)[1]}
          </>
        ) : (
          title
        )}
      </h3>
      <Reveal delay={0.1}>
        <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-ink-2">{lede}</p>
      </Reveal>
    </div>
  );
}

const CARDS = [
  { href: '#generalize', n: '43.9–57.3', unit: '% AUC', label: 'Traditional detectors on RA-Bench, down from 67.6–98.6 on public benchmarks' },
  { href: '#generation', n: '70.5 → 28.3', unit: '% fake recall', label: 'Fine-tuned detectors as generators get more real frames to work from' },
  { href: '#humans', n: '633', unit: 'clips', label: 'generated videos that all five human reviewers called real' },
  { href: '#lastmile', n: '46.0 → 1.4', unit: '% fake recall', label: 'Fine-tuned detectors after the clip is shared: transcoded, shrunk, badged' },
];

export function Findings() {
  return (
    <section id="findings" className="relative mx-auto max-w-[1440px] px-6 pt-28 pb-16 lg:px-10 lg:pt-36">
      <SectionHead no="04" kicker="What we found" title="Detection breaks in every direction we pushed." accent={['every']} lede="Seven traditional detectors, ten zero-shot multimodal models under three prompts, two fine-tuned detectors, twenty human reviewers — and a simulated trip through social media." />
      <div className="mt-14 grid gap-px border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4">
        {CARDS.map((c, i) => (
          <motion.a key={c.href} href={c.href} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }} className="group relative overflow-hidden bg-paper p-6 transition-colors hover:bg-card">
            <span className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-fake transition-transform duration-500 group-hover:scale-x-100" />
            <div className="font-mono text-[11px] text-ink-3">0{i + 1}</div>
            <div className="font-display tnum mt-6 text-[clamp(2rem,2.8vw,2.7rem)] leading-none tracking-[-0.02em] group-hover:text-fake">{c.n}</div>
            <div className="mt-1 font-mono text-[11px] text-ink-3">{c.unit}</div>
            <p className="mt-4 text-[13.5px] leading-snug text-ink-2">{c.label}</p>
          </motion.a>
        ))}
      </div>

      <FindingHead id="generalize" n="1" title="None of the three detector families generalizes." accent="None" lede="Good public scores, larger models and task-specific fine-tuning each fail to carry over across RA-Bench's nine generators." />
      <div className="space-y-20">
        <Row
          claim={
            <Claim tag="1a · Traditional detectors" title="Public benchmark scores do not survive real anchors." stat={<>84.2 <span className="text-ink-4">→</span> 51.3</>} statNote="7-detector mean AUC · public ref. → RA-Bench" more={<>For 26 of the 63 detector–generator pairs, AUC is below 50%: generated clips score as <i>less</i> fake than their real anchors. Rankings do not transfer either (Spearman 0.26): UnivFD drops from 2nd to 6th, NPR rises from 6th to 3rd, and the leader changes with the generator. At 5% false positives the seven-detector mean catches only 2.8–7.5% of generated clips.</>}>
              Seven detectors that reach 67.6–98.6 AUC on public benchmarks average 43.9–57.3 per generator here. Pick a generator to see it alone.
            </Claim>
          }
          figure={<DetectorDrop />}
        />
        <Row
          flip
          claim={
            <Claim tag="1b · Zero-shot multimodal models" title="Change the prompt, and the verdict flips." more={<>Requiring structured output does not help: GPT-5.5's continuous rating ranks fakes above their anchors (62.1 AUC) while its verdict calls almost everything real. Diagnostic aspect scores collapse — Qwen3.5-0.8B and -9B repeat one value across all five aspects in over 99% of outputs. Scaling Qwen3.5 from 0.8B to 122B lifts Rating AUC on LTX from 51.0 to 65.8, but only from 50.5 to 52.7 on Hailuo.</>}>
              Ten models, the same 16 frames, three ways of asking. Small models jump between “everything is fake” and “everything is real”; the stable ones are stable because they lean one way.
            </Claim>
          }
          figure={<PromptRoulette />}
        />
        <Row
          claim={
            <Claim tag="1c · Fine-tuned detectors" title="A fine-tuned detector was partly reading the clock." stat={<>68.5 <span className="text-ink-4">→</span> 54.4</>} statNote="Skyra-SFT mean BAcc, timestamps → frame indices" more={<>Wan2.2 with its duration fixed near 5 s (same generator, anchors and prompts) lifts Skyra-SFT's fake recall from 33.8% to 96.4%. Replacing timestamps with frame indices, with the visual input unchanged, shrinks the exact-5-second gap from 48.6 to 1.5 points. An audit of the released ViF training metadata shows the 5-second final timestamp correlates with the label. Even without timestamps, per-generator BAcc still spans 31.1–61.0%.</>}>
              Skyra scored higher on clips ending at exactly 5.00 s. Swap its timestamps for frame indices — same frames — and the advantage disappears.
            </Claim>
          }
          figure={
            <div className="space-y-10">
              <TimestampTrap />
              <div className="border-t border-rule pt-6">
                <BusterBias />
              </div>
            </div>
          }
        />
      </div>

      <FindingHead id="generation" n="2" title="Generation properties cut differently for each detector family." accent="differently" lede="More faithful, more temporally consistent clips leave weaker fake evidence — but which property matters depends on the detector, and more real conditioning pushes the two families in opposite directions." />
      <div className="space-y-12 border-t border-rule pt-12">
        <Reveal>
          <Conditioning />
        </Reveal>
        <Reveal>
          <QualityFacts />
        </Reveal>
      </div>

      <FindingHead id="humans" n="3" title="What fools people fools detectors — and sharing makes it worse." accent="fools detectors" lede="Twenty reviewers judged RA-Bench without knowing the source. The clips that fooled all of them are also hard for every detector family, and a simulated trip through social media erases what evidence remains." />
      <div className="space-y-20">
        <Row
          claim={
            <Claim tag="3a · Human reviewers" title="Closed-source generators fool people far more often." stat={<>68.6 <span className="text-ink-4">vs</span> 52.9<span className="text-[0.5em] text-ink-3">%</span></>} statNote="flagged as generated · open vs closed source" more={<>The pattern holds for every one of the 20 reviewers, and leaving any reviewer out preserves the full nine-source ranking. Real crisis footage is not safe either: 22.8% of judgments on real videos said “generated”.</>}>
              Reviewers flag 75.8% of OmniWeaving clips, but only 45.1% of Kling and 40.7% of Seedance 2.0 — below a coin flip.
            </Claim>
          }
          figure={<HumanBars />}
        />
        <Row
          flip
          claim={
            <Claim tag="3b · RA-Bench-HumanProof" title="633 clips that all five reviewers called real." stat="54.7%" statNote="Gemini Binary BAcc on HumanProof" more={<>HumanProof is built in two stages: 1,080 generated clips judged Real by all three first-stage reviewers, then re-checked by two more; 633 survived. It holds 514 closed-source clips, including 160 from Kling and 159 from Seedance 2.0. Official-timestamp Skyra reaches 72.0–74.5% BAcc, but that keeps the timestamp prior; with frame indices both checkpoints fall to 53.7%. BusterX++ flags 3.9%.</>}>
              On these clips Gemini loses most of its fake evidence, traditional detectors stay near chance, and timestamp-free Skyra lands at 53.7%.
            </Claim>
          }
          figure={<HumanProofMeters />}
        />
      </div>

      <div id="lastmile" className="scroll-mt-24 pt-24">
        <div className="grid items-end gap-8 border-t border-rule pt-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <div className="kicker text-fake">3c · RA-Bench-LastMile</div>
            </Reveal>
            <h4 className="font-display mt-3 text-[clamp(2rem,3.6vw,3.2rem)] leading-[1.02] tracking-[-0.02em] text-balance">Every share erases evidence.</h4>
          </div>
          <Reveal className="lg:col-span-5" delay={0.1}>
            <p className="text-[15.5px] leading-relaxed text-ink-2">Clips rarely reach viewers or moderators as clean files. Follow one generated wildfire clip through the paper's dissemination chain — and watch the detectors' fake recall drain toward zero.</p>
          </Reveal>
        </div>
        <div className="mt-10">
          <Reveal>
            <LastMile />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
