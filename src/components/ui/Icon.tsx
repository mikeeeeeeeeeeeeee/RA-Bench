/** a small hand-drawn icon set (1.5px strokes, 24px grid) */
const P: Record<string, string> = {
  arrow: 'M7 17 17 7M9 7h8v8',
  down: 'M12 5v14M6 13l6 6 6-6',
  play: 'M8 5.5v13l11-6.5z',
  pause: 'M8 5h3v14H8zM13 5h3v14h-3z',
  sun: 'M12 4V2M12 22v-2M4 12H2M22 12h-2M5.6 5.6 4.2 4.2M19.8 19.8l-1.4-1.4M5.6 18.4l-1.4 1.4M19.8 4.2l-1.4 1.4M12 16.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9z',
  moon: 'M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z',
  phone: 'M8 2.5h8a1.5 1.5 0 0 1 1.5 1.5v16a1.5 1.5 0 0 1-1.5 1.5H8A1.5 1.5 0 0 1 6.5 20V4A1.5 1.5 0 0 1 8 2.5zM11 18.5h2',
  monitor: 'M3.5 4.5h17v11h-17zM9 20h6M12 15.5V20',
  paper: 'M6 2.5h8.5l4 4V21.5H6zM14 2.5V7h4.5M9 12h7M9 15.5h7M9 9h3',
  code: 'm8.5 7-5 5 5 5M15.5 7l5 5-5 5M13.5 4.5l-3 15',
  data: 'M4 6.5c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zM4 6.5v11c0 1.7 3.6 3 8 3s8-1.3 8-3v-11M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3',
  copy: 'M8.5 8.5h11v11h-11zM15.5 8.5v-4h-11v11h4',
  check: 'm5 12.5 4.5 4.5L19 7.5',
  menu: 'M4 7h16M4 12h16M4 17h16',
  close: 'M6 6l12 12M18 6 6 18',
  cc: 'M3.5 5.5h17v13h-17zM10.5 10.2a2.5 2.5 0 1 0 0 3.6M17 10.2a2.5 2.5 0 1 0 0 3.6',
  replay: 'M4 12a8 8 0 1 0 2.3-5.6M4 4.5V9h4.5',
  shuffle: 'M3 7h3.5c4.5 0 6.5 10 11 10H21M3 17h3.5c1.8 0 3-1.6 4.1-3.6M13.4 9.6C14.5 8 15.7 7 17.5 7H21M18 4l3 3-3 3M18 14l3 3-3 3',
  eye: 'M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  hf: 'M12 3.5c-4.7 0-8.5 3.6-8.5 8.1 0 4.5 3.8 8.9 8.5 8.9s8.5-4.4 8.5-8.9c0-4.5-3.8-8.1-8.5-8.1zM8.5 10.5h.01M15.5 10.5h.01M8.8 14.5c1.6 1.8 4.8 1.8 6.4 0',
  full: 'M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5',
  volume: 'M4 9.5h3.5L12 5.5v13l-4.5-4H4zM15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11',
  mute: 'M4 9.5h3.5L12 5.5v13l-4.5-4H4zM16 9.5l5 5M21 9.5l-5 5',
};
export function Icon({ name, size = 16, className = '', stroke = 1.6 }: { name: keyof typeof P | string; size?: number; className?: string; stroke?: number }) {
  const fill = name === 'play' || name === 'pause';
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill={fill ? 'currentColor' : 'none'} stroke={fill ? 'none' : 'currentColor'} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={P[name]} />
    </svg>
  );
}
