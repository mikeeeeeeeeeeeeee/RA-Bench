# RA-Bench — project page

Project page for **Can We Defend Against AI-Generated Video Attacks on Real-World Crisis Events? A Systematic Evaluation of Detectors, Generators and Social Dissemination** ([arXiv 2608.14391](https://arxiv.org/abs/2608.14391)).

Live: https://mikeeeeeeeeeeeeee.github.io/RA-Bench/

- Dataset: https://huggingface.co/datasets/liangshuo0111/RA-Bench
- Code: https://github.com/24029100313/RA-Bench

## Develop

```bash
npm ci
npm run dev        # http://localhost:5173
npm run typecheck
npm run build      # -> dist/
```

Every push to `main` builds and deploys to GitHub Pages (`.github/workflows/deploy.yml`).

## Content

- All numbers are in `src/data/results.ts` (copied from the paper's tables); paper metadata in `src/data/paper.ts`.
- Every clip in `public/media/` is a file from the public RA-Bench release, re-encoded for the web. Real footage shown is US-government public domain (DVIDS). LastMile clips are shown exactly as released.
- The film (`public/film/`) has English narration with English + Chinese subtitles (`src/data/film-cues.json`, `public/film/*.vtt`).
- Phones get their own layout (`src/phone/`); `?view=phone|desktop` forces one, and both layouts carry a switch. `?theme=dark` forces the dark theme.
