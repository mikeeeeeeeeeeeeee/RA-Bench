import cues from './film-cues.json';

/** The narrated film (English voice, English + Chinese subtitles). Chapter times are film time (s). */
export const FILM = {
  src: 'film/ra-bench-film-en.mp4',
  poster: 'film/poster.webp',
  vtt: 'film/ra-bench-film-en-zh.vtt',
  duration: 94.4,
  chapters: [
    { t: 0, label: 'Cold open' },
    { t: 10.6, label: 'The question' },
    { t: 17, label: 'The benchmark' },
    { t: 33.2, label: 'Detectors' },
    { t: 54.2, label: 'Generation' },
    { t: 62.8, label: 'People' },
    { t: 75.3, label: 'Sharing' },
    { t: 85.9, label: 'Outro' },
  ],
  cues: cues as [number, number, string, string][],
};
