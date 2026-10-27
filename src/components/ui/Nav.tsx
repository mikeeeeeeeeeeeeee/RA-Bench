import { motion, useScroll, useSpring } from 'motion/react';
import { useEffect, useState } from 'react';
import { LINKS } from '@/data/paper';
import { Logo } from './Logo';
import { Icon } from './Icon';
import { ThemeToggle, ViewToggle } from './Toggles';

const ITEMS = [
  { id: 'film', label: 'Film' },
  { id: 'test', label: 'Test yourself' },
  { id: 'benchmark', label: 'Benchmark' },
  { id: 'findings', label: 'Findings' },
  { id: 'team', label: 'Team' },
  { id: 'cite', label: 'Cite' },
];

export function Nav() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.3 });
  const [active, setActive] = useState('');
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => {
      setScrolled(scrollY > 40);
      let id = '';
      for (const it of ITEMS) {
        const el = document.getElementById(it.id);
        if (el && el.getBoundingClientRect().top < innerHeight * 0.4) id = it.id;
      }
      setActive(id);
    };
    on();
    addEventListener('scroll', on, { passive: true });
    return () => removeEventListener('scroll', on);
  }, []);
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-[background,backdrop-filter,border-color] duration-500 ${scrolled ? 'border-b border-rule bg-[var(--glass)] backdrop-blur-xl' : 'border-b border-transparent'}`}>
      <div className="mx-auto flex h-[68px] max-w-[1440px] items-center gap-6 px-6 lg:px-10">
        <a href="#top" aria-label="RA-Bench, back to top" className="shrink-0">
          <Logo />
        </a>
        <nav className="mx-auto hidden items-center gap-1 md:flex">
          {ITEMS.map((it) => (
            <a key={it.id} href={`#${it.id}`} className={`relative px-3 py-2 font-mono text-[11.5px] tracking-[0.12em] uppercase transition-colors ${active === it.id ? 'text-ink' : 'text-ink-3 hover:text-ink'}`}>
              {active === it.id && <motion.span layoutId="nav-dot" className="absolute inset-x-3 -bottom-[1px] h-[2px] bg-fake" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
              {it.label}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <a href={LINKS.arxiv} target="_blank" rel="noreferrer" className="hidden h-9 items-center gap-1.5 rounded-full border border-ink bg-ink px-4 font-mono text-[11px] tracking-[0.12em] text-paper uppercase transition-colors hover:border-fake hover:bg-fake lg:flex">
            Paper <Icon name="arrow" size={13} />
          </a>
          <ViewToggle current="desktop" />
          <ThemeToggle />
        </div>
      </div>
      <motion.div className="absolute inset-x-0 bottom-[-1px] h-[2px] origin-left bg-fake" style={{ scaleX: progress }} />
    </header>
  );
}
