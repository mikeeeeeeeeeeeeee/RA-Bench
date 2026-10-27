/** RA/BENCH wordmark: an ink box, a vermilion slash, the word */
export function Logo({ size = 1, className = '' }: { size?: number; className?: string }) {
  return (
    <span className={`inline-flex items-center font-sans font-extrabold tracking-[0.08em] select-none ${className}`} style={{ fontSize: 15 * size }}>
      <span className="grid place-items-center bg-ink px-[0.45em] py-[0.18em] text-paper">RA</span>
      <span className="mx-[0.18em] text-fake">/</span>
      <span>BENCH</span>
    </span>
  );
}
