import { useCallback, useEffect, useRef, useState } from 'react';
import { asset } from '@/lib/hooks';
import { timecode } from '@/components/ui/Frame';

/**
 * Forensic lens. The generated clip fills the frame; a lens that follows the pointer shows the real
 * anchor underneath — both clips start on the same first frame and are kept in step, so what differs
 * inside the lens is exactly what the generator invented. WebGL (two video textures, barrel distortion,
 * chromatic fringe at the rim, a short glitch when the generator changes); a CSS clip-path fallback
 * covers browsers without WebGL.
 */

const VERT = `attribute vec2 p; varying vec2 v; void main(){ v = p*0.5+0.5; gl_Position = vec4(p,0.,1.); }`;
const FRAG = `
precision highp float;
varying vec2 v;
uniform sampler2D uGen, uReal;
uniform vec2 uRes, uLens, uScaleG, uScaleR;
uniform float uR, uOpen, uTime, uGlitch, uDark;
vec2 cover(vec2 uv, vec2 s){ return (uv-0.5)*s+0.5; }
float hash(float n){ return fract(sin(n)*43758.5453); }
void main(){
  vec2 uv = vec2(v.x, 1.0-v.y);
  vec2 px = v*uRes; px.y = uRes.y-px.y;
  // glitch: horizontal bands slide and split when the generator changes
  float band = floor(uv.y*28.0 + floor(uTime*30.0));
  float g = uGlitch*step(0.55, hash(band))*(hash(band+3.1)-0.5)*0.12;
  vec2 ug = uv + vec2(g, 0.0);
  vec3 gen = vec3(texture2D(uGen, cover(ug+vec2(uGlitch*0.012,0.), uScaleG)).r,
                  texture2D(uGen, cover(ug, uScaleG)).g,
                  texture2D(uGen, cover(ug-vec2(uGlitch*0.012,0.), uScaleG)).b);
  gen *= 1.0 - 0.10*uDark;
  float R = uR*uOpen;
  vec2 d = px-uLens;
  float dist = length(d);
  vec3 col = gen;
  if (R > 1.0 && dist < R + 40.0) {
    vec2 q = d/R; float k = dot(q,q);
    // barrel: the lens magnifies a little at its centre and bends toward the rim
    vec2 lp = uLens + d*(0.9 - 0.10*k);
    vec2 luv = lp/uRes;
    float ca = 0.006*k*k;
    vec2 dir = normalize(d+0.0001);
    vec3 real = vec3(texture2D(uReal, cover(luv+dir*ca, uScaleR)).r,
                     texture2D(uReal, cover(luv, uScaleR)).g,
                     texture2D(uReal, cover(luv-dir*ca, uScaleR)).b);
    float inside = smoothstep(R, R-1.5, dist);
    // soft drop shadow just outside the rim
    float shadow = smoothstep(R+34.0, R, dist)*(1.0-inside)*0.45;
    col = mix(gen*(1.0-shadow), real, inside);
    // the rim: a bright hairline and a faint outer ring
    float rim = smoothstep(1.6, 0.0, abs(dist-R));
    float ring = smoothstep(1.0, 0.0, abs(dist-(R+9.0)))*0.35;
    col = mix(col, vec3(1.0), rim*0.9 + ring);
    // reticle: a fine crosshair with a gap at the centre
    float cx = smoothstep(0.9,0.0,abs(d.x))*step(10.0,abs(d.y))*step(abs(d.y),R*0.22);
    float cy = smoothstep(0.9,0.0,abs(d.y))*step(10.0,abs(d.x))*step(abs(d.x),R*0.22);
    col = mix(col, vec3(1.0), (cx+cy)*0.55*inside);
    // ticks around the rim every 15 degrees
    float a = atan(d.y,d.x);
    float tick = step(0.985, cos(a*24.0))*smoothstep(R-2.0,R-9.0,dist)*smoothstep(R-12.0,R-9.0,dist);
    col = mix(col, vec3(1.0), tick*0.7);
  }
  gl_FragColor = vec4(col,1.0);
}`;

export type LensGen = { key: string; name: string; src: string; dur: number };

export function ForensicLens({ realSrc, realPoster, gens, className = '', compact = false }: { realSrc: string; realPoster?: string; gens: LensGen[]; className?: string; compact?: boolean }) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const vGen = useRef<HTMLVideoElement>(null);
  const vReal = useRef<HTMLVideoElement>(null);
  const [gi, setGi] = useState(0);
  const [gl, setGl] = useState<'pending' | 'ok' | 'none'>('pending');
  const [live, setLive] = useState(false);
  const liveRef = useRef(false);
  const [hud, setHud] = useState({ x: 0, y: 0, t: 0, r: 120, shared: true });
  const lens = useRef({ x: 0, y: 0, tx: 0, ty: 0, vx: 0, vy: 0, hover: false, idleAt: 0, touched: false });
  const glitch = useRef(0);
  const visible = useRef(false);
  const gen = gens[gi];

  // keep the two clips in step and loop both at the generated clip's end (the shared first frame)
  const sync = useCallback(() => {
    const g = vGen.current, r = vReal.current;
    if (!g || !r) return;
    const dur = Math.min(gen.dur, r.duration || gen.dur) - 0.06;
    if (g.currentTime >= dur || g.ended) {
      g.currentTime = 0;
      r.currentTime = 0;
      g.play().catch(() => {});
      r.play().catch(() => {});
    } else if (Math.abs(r.currentTime - g.currentTime) > 0.09) r.currentTime = g.currentTime;
  }, [gen.dur]);

  useEffect(() => {
    const c = canvas.current!, w = wrap.current!;
    const g = c.getContext('webgl', { premultipliedAlpha: false, antialias: false, preserveDrawingBuffer: false });
    if (!g) {
      setGl('none');
      return;
    }
    setGl('ok');
    const sh = (type: number, src: string) => {
      const s = g.createShader(type)!;
      g.shaderSource(s, src);
      g.compileShader(s);
      return s;
    };
    const prog = g.createProgram()!;
    g.attachShader(prog, sh(g.VERTEX_SHADER, VERT));
    g.attachShader(prog, sh(g.FRAGMENT_SHADER, FRAG));
    g.linkProgram(prog);
    if (!g.getProgramParameter(prog, g.LINK_STATUS)) {
      setGl('none');
      return;
    }
    g.useProgram(prog);
    const buf = g.createBuffer();
    g.bindBuffer(g.ARRAY_BUFFER, buf);
    g.bufferData(g.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), g.STATIC_DRAW);
    const loc = g.getAttribLocation(prog, 'p');
    g.enableVertexAttribArray(loc);
    g.vertexAttribPointer(loc, 2, g.FLOAT, false, 0, 0);
    const tex = [0, 1].map((i) => {
      const t = g.createTexture()!;
      g.activeTexture(g.TEXTURE0 + i);
      g.bindTexture(g.TEXTURE_2D, t);
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.LINEAR);
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, g.LINEAR);
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE);
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE);
      g.texImage2D(g.TEXTURE_2D, 0, g.RGBA, 1, 1, 0, g.RGBA, g.UNSIGNED_BYTE, new Uint8Array([12, 16, 24, 255]));
      return t;
    });
    const U = (n: string) => g.getUniformLocation(prog, n);
    g.uniform1i(U('uGen'), 0);
    g.uniform1i(U('uReal'), 1);
    let W = 0, H = 0, dpr = 1;
    const resize = () => {
      dpr = Math.min(2, devicePixelRatio || 1);
      const r = w.getBoundingClientRect();
      W = r.width;
      H = r.height;
      c.width = Math.round(W * dpr);
      c.height = Math.round(H * dpr);
      g.viewport(0, 0, c.width, c.height);
      const L = lens.current;
      if (!L.touched) {
        L.x = L.tx = W * 0.62;
        L.y = L.ty = H * 0.46;
      }
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(w);
    const io = new IntersectionObserver(([e]) => {
      visible.current = e.isIntersecting;
      const vs = [vGen.current, vReal.current];
      vs.forEach((v) => v && (e.isIntersecting ? v.play().catch(() => {}) : v.pause()));
    });
    io.observe(w);
    let raf = 0, last = performance.now(), open = 0;
    const t0 = performance.now();
    const scale = (v: HTMLVideoElement | null) => {
      if (!v || !v.videoWidth) return [1, 1];
      const va = v.videoWidth / v.videoHeight, ca = W / H;
      return va > ca ? [ca / va, 1] : [1, va / ca];
    };
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible.current) return;
      const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
      last = now;
      const L = lens.current;
      const time = (now - t0) / 1000;
      // idle drift until the visitor takes the lens; after they leave, glide back and drift again
      if (!L.hover && now - L.idleAt > 2600) {
        L.tx = W * (0.6 + 0.16 * Math.sin(time * 0.31));
        L.ty = H * (0.48 + 0.14 * Math.sin(time * 0.47 + 1.2));
      }
      const k = L.hover ? 260 : 40, damp = L.hover ? 30 : 13;
      L.vx += (k * (L.tx - L.x) - damp * L.vx) * dt;
      L.vy += (k * (L.ty - L.y) - damp * L.vy) * dt;
      L.x += L.vx * dt;
      L.y += L.vy * dt;
      open += (1 - open) * Math.min(1, dt * 2.2);
      glitch.current = Math.max(0, glitch.current - dt * 2.2);
      const g1 = vGen.current, r1 = vReal.current;
      sync();
      // until both clips can be drawn, the shared first frame (the poster) stands in
      if (!liveRef.current && g1 && r1 && g1.readyState >= 2 && r1.readyState >= 2) {
        liveRef.current = true;
        setLive(true);
      }
      [g1, r1].forEach((v, i) => {
        if (v && v.readyState >= 2) {
          g.activeTexture(g.TEXTURE0 + i);
          g.bindTexture(g.TEXTURE_2D, tex[i]);
          g.texImage2D(g.TEXTURE_2D, 0, g.RGBA, g.RGBA, g.UNSIGNED_BYTE, v);
        }
      });
      const R = Math.min(W, H) * (compact ? 0.3 : 0.27);
      const sg = scale(g1), sr = scale(r1);
      g.uniform2f(U('uRes'), W * dpr, H * dpr);
      g.uniform2f(U('uLens'), L.x * dpr, L.y * dpr);
      g.uniform2f(U('uScaleG'), sg[0], sg[1]);
      g.uniform2f(U('uScaleR'), sr[0], sr[1]);
      g.uniform1f(U('uR'), R * dpr);
      g.uniform1f(U('uOpen'), open);
      g.uniform1f(U('uTime'), time);
      g.uniform1f(U('uGlitch'), glitch.current);
      g.uniform1f(U('uDark'), 1);
      g.drawArrays(g.TRIANGLE_STRIP, 0, 4);
      const t = g1?.currentTime ?? 0;
      setHud((h) => (Math.abs(h.x - L.x) > 0.5 || Math.abs(h.y - L.y) > 0.5 || Math.abs(h.t - t) > 0.03 || h.r !== R ? { x: L.x, y: L.y, t, r: R, shared: t < 0.35 } : h));
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      g.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [sync, compact]);

  // switching the generator: restart both clips together and flash the glitch
  useEffect(() => {
    glitch.current = 1;
    const g = vGen.current, r = vReal.current;
    if (g && r) {
      r.currentTime = 0;
      g.play().catch(() => {});
      r.play().catch(() => {});
    }
  }, [gi]);

  const move = (x: number, y: number) => {
    const r = wrap.current!.getBoundingClientRect();
    const L = lens.current;
    L.tx = Math.max(0, Math.min(r.width, x - r.left));
    L.ty = Math.max(0, Math.min(r.height, y - r.top));
    L.hover = true;
    L.touched = true;
  };
  const leave = () => {
    lens.current.hover = false;
    lens.current.idleAt = performance.now();
  };

  return (
    <div className={className}>
      <div
        ref={wrap}
        className="viewfinder relative aspect-video w-full cursor-none touch-pan-y overflow-hidden rounded-[3px] bg-screen text-white/90 select-none"
        onPointerMove={(e) => (e.pointerType === 'mouse' || e.buttons) && move(e.clientX, e.clientY)}
        onPointerDown={(e) => move(e.clientX, e.clientY)}
        onPointerLeave={leave}
        onPointerUp={(e) => e.pointerType !== 'mouse' && leave()}
      >
        <video ref={vGen} key={gen.src} src={asset(gen.src)} muted playsInline autoPlay preload="auto" crossOrigin="anonymous" className={gl === 'none' ? 'absolute inset-0 h-full w-full object-cover' : 'hidden'} />
        <video ref={vReal} src={asset(realSrc)} poster={realPoster ? asset(realPoster) : undefined} muted playsInline autoPlay preload="auto" crossOrigin="anonymous"
          className={gl === 'none' ? 'absolute inset-0 h-full w-full object-cover' : 'hidden'}
          style={gl === 'none' ? { clipPath: `circle(${hud.r}px at ${hud.x}px ${hud.y}px)` } : undefined} />
        {realPoster && <img src={asset(realPoster)} alt="" className="absolute inset-0 h-full w-full object-cover" />}
        <canvas ref={canvas} className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${gl === 'none' ? 'hidden' : ''} ${live ? 'opacity-100' : 'opacity-0'}`} />
        <span className="vf-c tl" /><span className="vf-c tr" /><span className="vf-c bl" /><span className="vf-c br" />
        {/* HUD */}
        <div className={`pointer-events-none absolute inset-x-0 top-0 z-[4] flex items-start justify-between font-mono uppercase ${compact ? 'px-5 pt-4 text-[9px] tracking-[0.1em]' : 'px-8 pt-5 text-[10.5px] tracking-[0.14em]'}`}>
          <span className="flex items-center gap-2 rounded-[2px] bg-black/55 px-2 py-1 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-[var(--fake)] shadow-[0_0_10px_var(--fake)]" />
            {compact ? gen.name : `Generated · ${gen.name}`}
          </span>
          {!compact && <span className="tnum rounded-[2px] bg-black/45 px-2 py-1 backdrop-blur-sm">{timecode(hud.t)}</span>}
        </div>
        {/* the lens label rides on the rim */}
        <div className={`pointer-events-none absolute z-[5] -translate-x-1/2 font-mono uppercase ${compact ? 'text-[8.5px] tracking-[0.1em]' : 'text-[10px] tracking-[0.16em]'}`} style={{ left: hud.x, top: Math.max(compact ? 30 : 44, hud.y - hud.r - (compact ? 24 : 30)) }}>
          <span className="flex items-center gap-1.5 rounded-full bg-[var(--real)] px-2.5 py-1 text-white shadow-lg">
            <span className="h-1.5 w-1.5 rounded-full bg-white" /> Real footage
          </span>
        </div>
        <div className={`pointer-events-none absolute z-[4] font-mono uppercase transition-opacity duration-300 ${compact ? 'bottom-3 left-5 text-[9px] tracking-[0.1em]' : 'bottom-5 left-8 text-[10.5px] tracking-[0.14em]'} ${hud.shared ? 'opacity-100' : 'opacity-0'}`}>
          <span className="rounded-[2px] bg-white px-2 py-1 text-[#101726]">t = 0 · shared first frame</span>
        </div>
        <div className={`pointer-events-none absolute z-[4] font-mono uppercase transition-opacity duration-300 ${compact ? 'right-5 bottom-3 text-[9px] tracking-[0.1em]' : 'right-8 bottom-5 text-[10.5px] tracking-[0.14em]'} ${hud.shared ? 'opacity-0' : 'opacity-80'}`}>
          {compact ? 'Drag the lens' : 'Move the lens to see what really happened'}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="kicker mr-1">{compact ? 'Generator' : 'Generated by'}</span>
        {gens.map((x, i) => (
          <button key={x.key} onClick={() => setGi(i)} className={`h-8 rounded-full border px-3 font-mono text-[11px] tracking-[0.08em] transition-all ${i === gi ? 'border-fake bg-fake text-white' : 'border-rule text-ink-2 hover:border-ink'}`}>
            {x.name}
          </button>
        ))}
      </div>
    </div>
  );
}
