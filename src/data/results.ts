/**
 * Every number the page draws, copied from the paper (arXiv 2608.14391v2).
 * Sources are listed in the paper's order: four open-source generators, then five closed-source.
 * The fixed-duration Wan2.2 control is kept apart (`fixed`), as in the paper, and never enters an average.
 */

export type Family = 'open' | 'closed';
export type Source = { key: string; name: string; short: string; family: Family; clips: number };

export const SOURCES: Source[] = [
  { key: 'wan22_dynamic_seed0', name: 'Wan2.2', short: 'Wan2.2', family: 'open', clips: 1830 },
  { key: 'wan22_lightning_seed0', name: 'Wan2.2-Lightning', short: 'W-Light.', family: 'open', clips: 1830 },
  { key: 'ltx_seed0', name: 'LTX', short: 'LTX', family: 'open', clips: 1830 },
  { key: 'omniweaving_seed0', name: 'OmniWeaving', short: 'OmniW.', family: 'open', clips: 1830 },
  { key: 'happy_horse', name: 'HappyHorse', short: 'HappyH.', family: 'closed', clips: 1787 },
  { key: 'runway', name: 'Runway', short: 'Runway', family: 'closed', clips: 1805 },
  { key: 'kling_v3', name: 'Kling', short: 'Kling', family: 'closed', clips: 1790 },
  { key: 'seedance2', name: 'Seedance 2.0', short: 'Seed.2.0', family: 'closed', clips: 1524 },
  { key: 'hailuo_2_3_fast', name: 'Hailuo', short: 'Hailuo', family: 'closed', clips: 1830 },
];

export const COUNTS = {
  videos: 17886,
  anchors: 1830,
  generated: 16056,
  generators: 9,
  open: 4,
  closed: 5,
  l1: 10,
  l2: 44,
  sourceVideos: 675,
  humanProof: 633,
  lastMileAnchors: 150,
  hours: 5.1,
};

/** Figure 2: the five-stage construction pipeline */
export const PIPELINE = [
  { step: 'Collect', n: 675, unit: 'public source videos', detail: '10 risk domains · 44 subcategories · government, open-licence and platform sources' },
  { step: 'Segment', n: 5774, unit: 'reviewable clips', detail: 'PySceneDetect cuts, FFmpeg splits, ResNet-18 near-duplicate warnings' },
  { step: 'Review', n: 2426, unit: 'clips retained', detail: 'two rounds: 7 reviewers × 2 per clip (11,548 decisions), 4 adjudicators; 3,348 rejected' },
  { step: 'Anchor', n: 1830, unit: 'real anchors', detail: '3–15 s, one H.264 encoding, 595 near-duplicates pruned, rights recorded · 338 sources · 5.1 h' },
  { step: 'Generate', n: 16056, unit: 'generated clips', detail: 'first frame + one shared prompt → 9 image-to-video generators (provider filters drop some)' },
];

/** Figure 3(b): real anchors per L1 risk domain */
export const DOMAINS = [
  { code: 'L1-02', name: 'War & armed conflict', short: 'War', n: 359 },
  { code: 'L1-04', name: 'Public safety', short: 'Safety', n: 299 },
  { code: 'L1-07', name: 'Public health', short: 'Health', n: 250 },
  { code: 'L1-01', name: 'Weather & natural disasters', short: 'Disaster', n: 232 },
  { code: 'L1-08', name: 'Technology', short: 'Tech', n: 170 },
  { code: 'L1-06', name: 'Economic & social panic', short: 'Panic', n: 141 },
  { code: 'L1-05', name: 'Accidents & infrastructure', short: 'Accident', n: 140 },
  { code: 'L1-03', name: 'Politics & governance', short: 'Politics', n: 137 },
  { code: 'L1-10', name: 'Large public events', short: 'Events', n: 58 },
  { code: 'L1-09', name: 'Space & exploration', short: 'Space', n: 44 },
];

/** Table 1: benchmark designs (2 = yes, 1 = partly, 0 = no) */
export const COMPARE_COLS = ['Real-event grounding', 'Social-risk taxonomy', 'Real-event-conditioned I2V', 'Human-deceptive challenge set', 'Dissemination simulation'];
export const COMPARE: { name: string; v: number[] }[] = [
  { name: 'GVF', v: [0, 0, 0, 0, 0] },
  { name: 'GenVideo', v: [0, 0, 0, 0, 1] },
  { name: 'GenVidBench', v: [0, 0, 1, 0, 0] },
  { name: 'GenBuster-Bench', v: [0, 0, 0, 0, 1] },
  { name: 'GenWorld', v: [0, 0, 1, 0, 0] },
  { name: 'AIGVDBench', v: [0, 0, 0, 0, 0] },
  { name: 'Chameleon', v: [1, 0, 1, 0, 1] },
  { name: 'RA-Bench', v: [2, 2, 2, 2, 2] },
];

/** Table 2: traditional detectors, paired AUC (%) on the nine sources, and their public reference */
export type Detector = { name: string; level: 'frame' | 'video'; ref: number; auc: number[]; fixed: number };
export const TRADITIONAL: Detector[] = [
  { name: 'CNNSpot', level: 'frame', ref: 81.4, auc: [35.5, 43.8, 64.0, 45.8, 39.2, 31.9, 45.4, 40.4, 53.9], fixed: 34.6 },
  { name: 'NPR', level: 'frame', ref: 67.6, auc: [50.6, 55.2, 58.6, 50.9, 54.6, 52.3, 44.3, 48.7, 54.6], fixed: 49.9 },
  { name: 'UnivFD', level: 'frame', ref: 89.9, auc: [32.7, 43.0, 51.2, 39.9, 43.0, 38.4, 39.1, 35.0, 44.0], fixed: 33.4 },
  { name: 'ForgeLens', level: 'frame', ref: 92.9, auc: [60.0, 69.6, 64.1, 63.0, 64.9, 59.5, 59.2, 48.1, 61.7], fixed: 61.0 },
  { name: 'DeCoF', level: 'video', ref: 81.5, auc: [62.5, 56.7, 62.5, 72.1, 58.5, 55.2, 57.2, 60.6, 63.2], fixed: 63.2 },
  { name: 'D3', level: 'video', ref: 77.7, auc: [55.4, 49.1, 58.0, 52.9, 28.0, 24.4, 28.9, 50.4, 44.0], fixed: 55.7 },
  { name: 'ReStraV', level: 'video', ref: 98.6, auc: [59.3, 62.4, 42.5, 68.3, 55.7, 45.8, 67.4, 49.3, 56.4], fixed: 51.2 },
];
export const TRAD_MEAN = { ref: 84.2, auc: [50.9, 54.2, 57.3, 56.1, 49.1, 43.9, 48.8, 47.5, 54.0], t5: [6.3, 7.1, 6.0, 7.5, 6.4, 2.8, 3.5, 4.0, 5.2], openAvg: 54.6, closedAvg: 48.7 };

/** Figure 15 (Appendix B.3): fake recall and real recall (%) of every zero-shot model under each prompt */
export const PROMPTS = ['Binary', 'Diagnostic', 'Rating'] as const;
export type Prompt = (typeof PROMPTS)[number];
export const ZERO_SHOT: { name: string; group: 'dense' | 'moe' | 'frontier'; fakeR: number[]; realR: number[] }[] = [
  { name: 'Qwen3.5-0.8B', group: 'dense', fakeR: [19.7, 97.8, 100.0], realR: [88.9, 1.8, 0.0] },
  { name: 'Qwen3.5-2B', group: 'dense', fakeR: [0.4, 14.0, 79.8], realR: [100.0, 87.6, 25.2] },
  { name: 'Qwen3.5-4B', group: 'dense', fakeR: [85.2, 5.5, 21.9], realR: [19.2, 95.2, 80.5] },
  { name: 'Qwen3.5-9B', group: 'dense', fakeR: [80.4, 0.4, 1.3], realR: [25.9, 99.8, 99.5] },
  { name: 'Qwen3.5-27B', group: 'dense', fakeR: [18.6, 3.9, 1.6], realR: [87.8, 98.6, 99.6] },
  { name: 'Qwen3.5-35B-A3B', group: 'moe', fakeR: [13.8, 5.4, 42.4], realR: [94.1, 97.8, 70.5] },
  { name: 'Qwen3.5-122B-A10B', group: 'moe', fakeR: [16.5, 27.4, 63.0], realR: [89.5, 82.2, 48.7] },
  { name: 'Qwen3.7-Plus', group: 'frontier', fakeR: [18.3, 21.2, 21.8], realR: [91.8, 89.5, 90.3] },
  { name: 'Gemini-3.1-Pro', group: 'frontier', fakeR: [54.4, 51.8, 52.3], realR: [72.4, 74.5, 75.1] },
  { name: 'GPT-5.5', group: 'frontier', fakeR: [4.4, 2.9, 3.4], realR: [99.2, 99.6, 99.6] },
];
/** Table 3: Gemini-3.1-Pro-Preview Binary BAcc per source (the strongest zero-shot model) */
export const GEMINI_BINARY = [63.4, 61.6, 74.5, 66.6, 62.5, 67.8, 60.1, 54.3, 59.9];

/** Table 4: fine-tuned MLLMs (BAcc and FakeR per source); the same 16 frames, two temporal tags */
export const SKYRA = {
  sft: {
    official: { bacc: [60.6, 59.9, 74.7, 51.9, 80.2, 80.3, 80.1, 73.5, 54.9], fakeR: [33.8, 32.5, 61.9, 16.4, 73.3, 73.2, 72.8, 59.6, 22.5], fixed: { bacc: 91.9, fakeR: 96.4 }, mean: 68.5 },
    index: { bacc: [60.2, 58.7, 31.1, 50.9, 59.4, 61.0, 59.1, 52.8, 56.0], fakeR: [65.1, 62.0, 6.7, 46.3, 63.9, 66.6, 62.5, 52.4, 56.6], fixed: { bacc: 59.1, fakeR: 62.8 }, mean: 54.4 },
    gap5s: { official: 48.6, index: 1.5 },
  },
  rl: {
    official: { bacc: [61.1, 60.7, 76.9, 52.1, 81.2, 81.1, 81.4, 74.8, 56.1], fakeR: [38.2, 37.3, 69.8, 20.2, 78.7, 78.3, 78.9, 65.9, 28.3], fixed: { bacc: 90.8, fakeR: 97.7 }, mean: 69.5 },
    index: { bacc: [60.0, 58.6, 29.7, 53.0, 59.7, 61.3, 60.6, 54.5, 57.1], fakeR: [70.5, 67.7, 9.9, 56.4, 70.5, 73.2, 71.5, 61.5, 64.6], fixed: { bacc: 59.0, fakeR: 68.4 }, mean: 54.9 },
    gap5s: { official: 43.4, index: 1.4 },
  },
  busterx: { fakeR: [6.0, 9.1, 4.1, 6.1, 6.5, 6.8, 5.6, 6.4, 6.1], realR: 93.7 },
};

/** Table 5: the same 1,830 prompts under three Wan2.2 conditioning settings (seed 0) */
export const CONDITIONING = {
  settings: ['Prompt only (T2V)', 'First frame (I2V)', 'First + last frame (I2V)'],
  short: ['T2V', 'First frame', 'First + last'],
  traditional: [
    { name: 'CNNSpot', auc: [15.9, 35.5, 40.5] },
    { name: 'NPR', auc: [30.7, 50.6, 44.4] },
    { name: 'UnivFD', auc: [16.3, 32.7, 34.5] },
    { name: 'ForgeLens', auc: [24.2, 60.0, 44.8] },
    { name: 'DeCoF', auc: [66.6, 62.5, 68.5] },
    { name: 'D3', auc: [20.2, 55.4, 29.8] },
    { name: 'ReStraV', auc: [59.6, 59.3, 50.0] },
  ],
  tradMean: [33.4, 50.9, 44.6],
  finetuned: [
    { name: 'Skyra-SFT · timestamp', fakeR: [63.2, 33.8, 16.4] },
    { name: 'Skyra-SFT · frame index', fakeR: [94.9, 65.1, 45.8] },
    { name: 'Skyra-RL · timestamp', fakeR: [70.4, 38.2, 20.7] },
    { name: 'Skyra-RL · frame index', fakeR: [97.2, 70.5, 54.9] },
    { name: 'BusterX++', fakeR: [27.0, 6.0, 4.0] },
  ],
  ftMean: [70.5, 42.7, 28.3],
};

/** §4.2.1 / Figure 9 and §4.2.3 / Table 6 */
export const QUALITY = {
  geminiDiag: { quality: -9.6, fidelity: -14.4, combined: -12.4 },
  motion: { binary: 6.5, diagnostic: 8.4, rating: 5.5, traditional: 0.1 },
  seedMaxDelta: 1.05,
};

/** Table 7: human judgments (Real / Uncertain / Generated, %) — Generated is human fake recall */
export const HUMAN = {
  realVideos: { real: 71.9, unc: 5.3, gen: 22.8 },
  bySource: [
    { key: 'wan22_dynamic_seed0', real: 27.0, unc: 5.5, gen: 67.5, hp: 21 },
    { key: 'wan22_lightning_seed0', real: 28.5, unc: 4.9, gen: 66.6, hp: 40 },
    { key: 'ltx_seed0', real: 30.3, unc: 5.1, gen: 64.6, hp: 49 },
    { key: 'omniweaving_seed0', real: 19.5, unc: 4.7, gen: 75.8, hp: 9 },
    { key: 'happy_horse', real: 37.2, unc: 6.9, gen: 55.9, hp: 74 },
    { key: 'runway', real: 34.8, unc: 5.6, gen: 59.7, hp: 74 },
    { key: 'kling_v3', real: 47.7, unc: 7.3, gen: 45.1, hp: 160 },
    { key: 'seedance2', real: 51.9, unc: 7.4, gen: 40.7, hp: 159 },
    { key: 'hailuo_2_3_fast', real: 31.8, unc: 5.3, gen: 63.0, hp: 47 },
  ],
  openAvg: 68.6,
  closedAvg: 52.9,
  reviewers: 20,
};

/** Table 8: detectors on RA-Bench-HumanProof vs a source-matched RA-Bench reference */
export const HUMANPROOF = [
  { name: 'Gemini · Binary', metric: 'BAcc', hp: 54.7, ref: 61.2 },
  { name: 'Gemini · Diagnostic', metric: 'BAcc', hp: 54.5, ref: 61.0 },
  { name: 'Gemini · Rating', metric: 'AUC', hp: 54.9, ref: 61.5 },
  { name: '7 traditional (mean)', metric: 'AUC', hp: 47.5, ref: 49.5 },
  { name: 'Skyra-SFT · frame index', metric: 'BAcc', hp: 53.7, ref: 55.3 },
  { name: 'Skyra-RL · frame index', metric: 'BAcc', hp: 53.7, ref: 56.1 },
  { name: 'BusterX++', metric: 'BAcc', hp: 49.4, ref: 49.9 },
];

/** Table 30/31: RA-Bench-LastMile, six dissemination conditions (equal-source means over nine generators) */
export const LASTMILE = {
  conditions: [
    { id: 'T0', label: 'Original', ops: 'Standardized clip, no extra encoding', short: 'Original' },
    { id: 'T1', label: 'T1 · Transcode', ops: 'VP9 (CRF 36) → H.264 (CRF 28), as platforms re-encode uploads', short: '+ Transcode' },
    { id: 'T2', label: 'T1 + T2 · Downscale', ops: '0.5× spatial downsampling, then T1', short: '+ Downscale' },
    { id: 'T3', label: 'T1 + T3 · 8 fps', ops: 'Conversion to 8 fps, then T1', short: '+ 8 fps' },
    { id: 'T4', label: 'T1 + T4 · News badge', ops: 'A synthetic news badge in the corner, then T1', short: '+ News badge' },
    { id: 'T5', label: 'Full', ops: 'Downscale, 8 fps, news badge and T1, in sequence', short: 'Full chain' },
  ],
  /** five fine-tuned configurations (Skyra-SFT/RL × timestamp/frame index, BusterX++) */
  ftFakeR: [46.0, 29.9, 7.9, 19.8, 14.0, 1.4],
  ftBAcc: [59.5, 54.5, 46.5, 48.2, 51.2, 47.1],
  ftRealR: { T1: 79.1, T4: 88.5 },
  tradAUC: [51.4, 48.5, 46.4, 49.7, 49.1, 47.3],
  tradT5: [5.7, 4.5, 2.5, 4.0, 3.8, 2.8],
  forgeLens: [61.6, 44.7, 32.6, 46.3, 44.9, 35.6],
  spearmanFull: 0.07,
};

/** the three headline findings (§1) */
export const HEADLINE = {
  tradFrom: [67.6, 98.6],
  tradTo: [43.9, 57.3],
  skyraIndex: [54.4, 54.9],
  busterFakeR: [4.1, 9.1],
};
