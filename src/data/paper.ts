/** Paper metadata: title, authors, affiliations, links, citation (arXiv 2608.14391v2, 15 Aug 2026). */

export const PAPER = {
  short: 'RA-Bench',
  expansion: 'Real videos as Anchors',
  title: 'Can We Defend Against AI-Generated Video Attacks on Real-World Crisis Events?',
  subtitle: 'A Systematic Evaluation of Detectors, Generators and Social Dissemination',
  arxivId: '2608.14391',
  date: 'August 2026',
};

export const LINKS = {
  arxiv: 'https://arxiv.org/abs/2608.14391',
  pdf: 'https://arxiv.org/pdf/2608.14391',
  code: 'https://github.com/24029100313/RA-Bench',
  data: 'https://huggingface.co/datasets/liangshuo0111/RA-Bench',
  hfPaper: 'https://huggingface.co/papers/2608.14391',
};

export const AFFILIATIONS: Record<number, string> = {
  1: 'National University of Singapore',
  2: 'Xidian University',
  3: 'University of California, Berkeley',
  4: 'The Hong Kong University of Science and Technology',
  5: 'Arizona State University',
  6: 'Renmin University of China',
  7: 'Monash University',
  8: 'InfRec, Cardinal AI Lab',
  9: 'University of Wisconsin–Madison',
  10: 'Shanghai Jiao Tong University',
  11: 'Stanford University',
  12: 'ETH Zurich',
  13: 'Xi’an Jiaotong University',
  14: 'University of Illinois Urbana–Champaign',
  15: 'Carnegie Mellon University',
  16: 'Independent Researcher',
  17: 'Zhejiang University',
  18: 'GigaAI',
  19: 'Alaya Lab',
};

export type Author = { name: string; aff: number[]; equal?: boolean; lead?: boolean; corr?: boolean };

export const AUTHORS: Author[] = [
  { name: 'Shuo Liang', aff: [1, 2], equal: true },
  { name: 'Yixing Ma', aff: [1, 3], equal: true },
  { name: 'Pengfei Zhou', aff: [1], equal: true, lead: true },
  { name: 'Zhenglin Wan', aff: [1] },
  { name: 'Xingyan Chen', aff: [3] },
  { name: 'Zihan Mei', aff: [5] },
  { name: 'Manting Li', aff: [3] },
  { name: 'Feihan Chen', aff: [6] },
  { name: 'Zhiwen Wang', aff: [7] },
  { name: 'Bin Xu', aff: [8] },
  { name: 'Haotian Zhang', aff: [6] },
  { name: 'Jiajun Song', aff: [6] },
  { name: 'Shiya Su', aff: [9] },
  { name: 'Run Liu', aff: [10] },
  { name: 'Zhenghang Ni', aff: [2] },
  { name: 'Yifa Yu', aff: [11] },
  { name: 'Jintao Hong', aff: [2] },
  { name: 'Bolong Feng', aff: [10] },
  { name: 'Yifei Liu', aff: [3] },
  { name: 'Zirui Zhang', aff: [12] },
  { name: 'Jingxuan Zhang', aff: [1] },
  { name: 'Songlin Zhao', aff: [14] },
  { name: 'Yifan Bai', aff: [13] },
  { name: 'Kang Tan', aff: [15] },
  { name: 'Yizhe Liu', aff: [13] },
  { name: 'Junhao Du', aff: [13] },
  { name: 'Yongtao Ge', aff: [19] },
  { name: 'Zhaopan Xv', aff: [16] },
  { name: 'Xinyuan Zhang', aff: [16] },
  { name: 'Mengru Ma', aff: [2] },
  { name: 'Chunhua Shen', aff: [17] },
  { name: 'Wei Wang', aff: [4], corr: true },
  { name: 'Yang You', aff: [1], corr: true },
  { name: 'Zheng Zhu', aff: [18], corr: true },
  { name: 'Kaipeng Zhang', aff: [19], corr: true },
  { name: 'Wangbo Zhao', aff: [4], corr: true },
];

const bibAuthors = AUTHORS.map((a) => {
  const parts = a.name.split(' ');
  return `${parts.slice(1).join(' ')}, ${parts[0]}`;
}).join(' and ');

export const BIBTEX = `@article{liang2026rabench,
  title   = {Can We Defend Against AI-Generated Video Attacks on Real-World Crisis Events? A Systematic Evaluation of Detectors, Generators and Social Dissemination},
  author  = {${bibAuthors}},
  journal = {arXiv preprint arXiv:2608.14391},
  year    = {2026}
}`;
