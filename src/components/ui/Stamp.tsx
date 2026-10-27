/** a rubber-stamp verdict that slams onto a frame */
export function Stamp({ kind, label, rot = -8, size = 1 }: { kind: 'real' | 'fake'; label?: string; rot?: number; size?: number }) {
  return (
    <span className="stamp z-10" style={{ color: kind === 'real' ? 'var(--real)' : 'var(--fake)', ['--rot' as string]: `${rot}deg`, fontSize: 18 * size }}>
      {label ?? (kind === 'real' ? 'Real' : 'Generated')}
    </span>
  );
}
