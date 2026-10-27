import { motion } from 'motion/react';
import { useTheme } from '@/theme/Theme';
import { switchView, type View } from '@/lib/mode';
import { Icon } from './Icon';

/** sun/moon switch; the new theme spreads from the button as a circle */
export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggle } = useTheme();
  return (
    <button
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      title={theme === 'dark' ? 'Light theme' : 'Dark theme'}
      onClick={(e) => {
        const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
        toggle({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
      }}
      className={`relative grid h-9 w-9 place-items-center overflow-hidden rounded-full border border-rule bg-card text-ink transition-colors hover:border-ink ${className}`}
    >
      <motion.span key={theme} initial={{ rotate: -90, scale: 0.4, opacity: 0 }} animate={{ rotate: 0, scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }}>
        <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={16} />
      </motion.span>
    </button>
  );
}

/** phone | desktop segmented switch: reloads into the other layout at the same section */
export function ViewToggle({ current, className = '' }: { current: View; className?: string }) {
  return (
    <div role="group" aria-label="Layout" className={`relative flex h-9 items-center rounded-full border border-rule bg-card p-[3px] ${className}`}>
      {(['phone', 'desktop'] as View[]).map((v) => (
        <button
          key={v}
          aria-pressed={current === v}
          title={v === 'phone' ? 'Phone layout' : 'Desktop layout'}
          onClick={() => current !== v && switchView(v)}
          className={`relative z-[1] grid h-[28px] w-[30px] place-items-center rounded-full transition-colors ${current === v ? 'text-paper' : 'text-ink-3 hover:text-ink'}`}
        >
          {current === v && <motion.span layoutId={`vt-${current}`} className="absolute inset-0 -z-[1] rounded-full bg-ink" />}
          <Icon name={v === 'phone' ? 'phone' : 'monitor'} size={15} />
        </button>
      ))}
    </div>
  );
}
