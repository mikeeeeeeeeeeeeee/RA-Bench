import { forwardRef, useEffect, useImperativeHandle, useRef, type CSSProperties } from 'react';
import { asset } from '@/lib/hooks';

/** a muted inline clip that only plays while it is on screen (and never preloads off screen) */
export const Video = forwardRef<HTMLVideoElement, { src: string; poster?: string; className?: string; style?: CSSProperties; loop?: boolean; play?: boolean; onTime?: (t: number) => void; rate?: number }>(function Video(
  { src, poster, className = '', style, loop = true, play = true, onTime, rate = 1 },
  fwd
) {
  const ref = useRef<HTMLVideoElement>(null);
  useImperativeHandle(fwd, () => ref.current!);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.playbackRate = rate;
    let visible = false;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && play) {
        if (v.preload !== 'auto') v.preload = 'auto';
        v.play().catch(() => {});
      } else v.pause();
    }, { rootMargin: '200px' });
    io.observe(v);
    if (!play) v.pause();
    else if (visible) v.play().catch(() => {});
    return () => io.disconnect();
  }, [play, src, rate]);
  useEffect(() => {
    const v = ref.current;
    if (!v || !onTime) return;
    const on = () => onTime(v.currentTime);
    v.addEventListener('timeupdate', on);
    return () => v.removeEventListener('timeupdate', on);
  }, [onTime]);
  return <video ref={ref} className={className} style={style} src={asset(src)} poster={poster ? asset(poster) : undefined} muted playsInline loop={loop} preload="none" disablePictureInPicture />;
});
