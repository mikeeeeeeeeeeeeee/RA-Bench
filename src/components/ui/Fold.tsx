import { AnimatePresence, motion } from 'motion/react';
import { useState, type ReactNode } from 'react';

/** longer text folds behind a quiet toggle */
export function Fold({ label = 'What the paper says', children }: { label?: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-4">
      <button onClick={() => setOpen((o) => !o)} className="group flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] text-ink-3 uppercase hover:text-ink">
        <span className={`grid h-4 w-4 place-items-center border border-current transition-transform duration-300 ${open ? 'rotate-45' : ''}`}>
          <svg width="8" height="8" viewBox="0 0 8 8"><path d="M4 0v8M0 4h8" stroke="currentColor" strokeWidth="1.2" /></svg>
        </span>
        {label}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden">
            <div className="pt-3 text-[15px] leading-relaxed text-ink-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
