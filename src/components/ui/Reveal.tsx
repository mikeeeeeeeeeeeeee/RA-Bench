import { motion } from 'motion/react';
import type { ReactNode } from 'react';

/** fade + rise once on entering the viewport */
export function Reveal({ children, delay = 0, y = 22, className = '', as = 'div' }: { children: ReactNode; delay?: number; y?: number; className?: string; as?: 'div' | 'li' | 'span' }) {
  const M = motion[as];
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </M>
  );
}

/** a headline whose words rise out of a mask one after another */
export function WordsRise({ text, className = '', delay = 0, accent }: { text: string; className?: string; delay?: number; accent?: string[] }) {
  const words = text.split(' ');
  return (
    <span className={className}>
      {words.map((w, i) => {
        const hot = accent?.includes(w.replace(/[.,?!]/g, ''));
        return (
          <span key={i} className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
            <motion.span
              className={`inline-block ${hot ? 'italic text-fake' : ''}`}
              initial={{ y: '105%' }}
              whileInView={{ y: '0%' }}
              viewport={{ once: true, margin: '0px 0px -8% 0px' }}
              transition={{ duration: 0.85, delay: delay + i * 0.045, ease: [0.16, 1, 0.3, 1] }}
            >
              {w}
              {i < words.length - 1 ? ' ' : ''}
            </motion.span>
          </span>
        );
      })}
    </span>
  );
}
