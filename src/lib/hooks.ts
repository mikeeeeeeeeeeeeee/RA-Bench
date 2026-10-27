import { useEffect, useRef, useState, type RefObject } from 'react';

/** true once (or while, with `once: false`) the element is on screen */
export function useInView<T extends Element>(opts: { once?: boolean; margin?: string; threshold?: number } = {}): [RefObject<T | null>, boolean] {
  const { once = true, margin = '0px 0px -12% 0px', threshold = 0 } = opts;
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) setInView(false);
      },
      { rootMargin: margin, threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once, margin, threshold]);
  return [ref, inView];
}

export function useMedia(q: string) {
  const [m, setM] = useState(() => (typeof window !== 'undefined' ? matchMedia(q).matches : false));
  useEffect(() => {
    const mq = matchMedia(q);
    const on = () => setM(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [q]);
  return m;
}

export const useReducedMotion = () => useMedia('(prefers-reduced-motion: reduce)');

/** a value that eases toward `target` every frame (critically damped), for smooth number/bar morphs */
export function useSpring(target: number, stiffness = 120, damping = 22) {
  const [v, setV] = useState(target);
  const s = useRef({ x: target, v: 0 });
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
      last = now;
      const st = s.current;
      st.v += (stiffness * (target - st.x) - damping * st.v) * dt;
      st.x += st.v * dt;
      if (Math.abs(target - st.x) < 0.01 && Math.abs(st.v) < 0.01) {
        st.x = target;
        setV(target);
        return;
      }
      setV(st.x);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, stiffness, damping]);
  return v;
}

export const asset = (p: string) => `${import.meta.env.BASE_URL}${p}`;
export const fmt = (n: number, d = 1) => n.toFixed(d);
export const fmtInt = (n: number) => Math.round(n).toLocaleString('en-US');
