import type { ReactNode } from 'react';

/** an evidence frame: dark screen, viewfinder corners, optional HUD rows */
export function Frame({ children, className = '', top, bottom, corners = true, rounded = 'rounded-[3px]' }: { children: ReactNode; className?: string; top?: ReactNode; bottom?: ReactNode; corners?: boolean; rounded?: string }) {
  return (
    <div className={`viewfinder relative overflow-hidden bg-screen text-white/85 ${rounded} ${className}`}>
      {children}
      {corners && (
        <>
          <span className="vf-c tl" />
          <span className="vf-c tr" />
          <span className="vf-c bl" />
          <span className="vf-c br" />
        </>
      )}
      {top && <div className="pointer-events-none absolute inset-x-0 top-0 z-[4] flex items-center justify-between gap-3 px-8 pt-5 font-mono text-[10.5px] tracking-[0.14em] uppercase">{top}</div>}
      {bottom && <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[4] flex items-end justify-between gap-3 px-8 pb-5 font-mono text-[10.5px] tracking-[0.14em] uppercase">{bottom}</div>}
    </div>
  );
}

export function Rec({ label = 'REC' }: { label?: string }) {
  return (
    <span className="flex items-center gap-2">
      <span className="rec-dot" />
      {label}
    </span>
  );
}

/** a broadcast timecode HH:MM:SS:FF from seconds */
export function timecode(t: number, fps = 30) {
  const f = Math.floor((t % 1) * fps);
  const s = Math.floor(t) % 60;
  const m = Math.floor(t / 60) % 60;
  const p = (n: number) => String(n).padStart(2, '0');
  return `00:${p(m)}:${p(s)}:${p(f)}`;
}
