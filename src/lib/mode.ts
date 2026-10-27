/**
 * Which layout the page shows: the phone layout (src/phone) or the desktop page (src/App).
 *   ?view=phone / ?view=desktop   choose one and remember it
 *   a remembered choice           wins over detection
 *   otherwise                     phones and small touch screens get the phone layout
 * Both layouts carry a switch between them; switching keeps the section being read.
 */
export type View = 'phone' | 'desktop';
const KEY = 'rabench-view';
const SWITCHED = 'rabench-view-switched';

/** a phone: a mobile user agent, or a narrow screen, or a coarse pointer on a small screen */
export function detectPhone(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent || '';
  const uaMobile = /iPhone|iPod|Android.*Mobile|Windows Phone|BlackBerry|Opera Mini|IEMobile|Mobile Safari/i.test(ua);
  const hinted = (navigator as Navigator & { userAgentData?: { mobile?: boolean } }).userAgentData?.mobile === true;
  const narrow = matchMedia('(max-width: 639px)').matches;
  const smallTouch = matchMedia('(pointer: coarse)').matches && Math.min(screen.width, screen.height) < 600;
  return uaMobile || hinted || narrow || smallTouch;
}

export function saved(): View | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'phone' || v === 'desktop' ? v : null;
  } catch {
    return null;
  }
}

export function chooseView(): View {
  try {
    const q = new URLSearchParams(location.search).get('view');
    if (q === 'phone' || q === 'desktop') {
      localStorage.setItem(KEY, q);
      return q;
    }
  } catch {
    /* private mode */
  }
  return saved() ?? (detectPhone() ? 'phone' : 'desktop');
}

export const SECTIONS = ['top', 'film', 'test', 'benchmark', 'findings', 'generalize', 'generation', 'humans', 'lastmile', 'team', 'cite'];

export function currentSection(line = 140): string {
  let id = '';
  for (const s of SECTIONS) {
    const el = document.getElementById(s);
    if (el && el.getBoundingClientRect().top <= line) id = s;
  }
  return id;
}

/** remember the choice, fade to paper and reload into the other layout at the same section */
export function switchView(v: View) {
  const anchor = currentSection();
  try {
    localStorage.setItem(KEY, v);
    sessionStorage.setItem(SWITCHED, '1');
  } catch {
    /* private mode */
  }
  const u = new URL(location.href);
  u.searchParams.delete('view');
  u.hash = anchor && anchor !== 'top' ? `#${anchor}` : '';
  const veil = document.createElement('div');
  veil.style.cssText = 'position:fixed;inset:0;z-index:2147483647;background:var(--paper);opacity:0;transition:opacity .25s ease;pointer-events:none';
  document.body.appendChild(veil);
  requestAnimationFrame(() => (veil.style.opacity = '1'));
  window.setTimeout(() => {
    history.scrollRestoration = 'manual';
    history.replaceState(null, '', u.toString());
    location.reload();
  }, 260);
}

export function settleAfterSwitch() {
  try {
    if (sessionStorage.getItem(SWITCHED) !== '1') return;
    sessionStorage.removeItem(SWITCHED);
  } catch {
    return;
  }
  history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);
  window.setTimeout(() => (history.scrollRestoration = 'auto'), 2500);
}
