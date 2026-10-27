import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

export type ThemeName = 'light' | 'dark';
const KEY = 'rabench-theme';

/** Light is the default for every first visit; only the visitor's own toggle (saved) changes it. */
function initial(): ThemeName {
  try {
    const q = new URLSearchParams(location.search).get('theme');
    if (q === 'light' || q === 'dark') return q;
    const s = localStorage.getItem(KEY);
    if (s === 'light' || s === 'dark') return s;
  } catch {
    /* private mode */
  }
  return 'light';
}

type Ctx = { theme: ThemeName; toggle: (origin?: { x: number; y: number }) => void };
const ThemeCtx = createContext<Ctx>({ theme: 'light', toggle: () => {} });
export const useTheme = () => useContext(ThemeCtx);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeName>(initial);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0a0d13' : '#f3f1ec');
  }, [theme]);

  const toggle = useCallback(
    (origin?: { x: number; y: number }) => {
      const next: ThemeName = theme === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem(KEY, next);
      } catch {
        /* private mode */
      }
      const apply = () => {
        document.documentElement.dataset.theme = next;
        setTheme(next);
      };
      const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } };
      if (!doc.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) return apply();
      const x = origin?.x ?? innerWidth - 60;
      const y = origin?.y ?? 40;
      const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      const vt = doc.startViewTransition(apply);
      vt.ready.then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
          { duration: 620, easing: 'cubic-bezier(.16,1,.3,1)', pseudoElement: '::view-transition-new(root)' }
        );
      });
    },
    [theme]
  );
  return <ThemeCtx.Provider value={{ theme, toggle }}>{children}</ThemeCtx.Provider>;
}
