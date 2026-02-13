import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';

/**
 * TrendsFallbackEffect Carousel displays random project icons in a spin mode active = true or
 * in no movement active = false, total icons in the carousel iconCount = 14 and speed spinSpeed
 * single RAF loop with phase state machine adaptive strip repetition so small screens never run out of icons
 * resize safe recompute sizing + snap current frame cleanly visibilitychange safety resumes when tab/app comes back
 */
const TrendsFallbackEffect = ({ active = true, iconCount = 14, spinSpeed = 55 }) => {
  const icons = useMemo(() => {
    const modules = import.meta.glob('../assets/images/icons/*.svg', {
      eager: true,
      as: 'url',
    });
    const urls = Object.values(modules);
    return urls.slice(0, Math.max(1, Math.min(iconCount, urls.length)));
  }, [iconCount]);

  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const itemRefs = useRef([]);

  const rafRef = useRef(null);

  const animRef = useRef({
    phase: 'idle', // 'spin' | 'rest' | 'idle'
    phaseStartTs: 0,
    spinDurationMs: 0,
    restDurationMs: 0,
    fromOffset: 0,
    toOffset: 0,
    offset: 0,
    trackPx: 0,
    stepPx: 0,
    itemPx: 0,
    centerPx: 0,
    viewW: 0,
    running: false,// used for resume safety
  });

  const [metrics, setMetrics] = useState({ w: 0, h: 0 });
  const [rev, setRev] = useState(0); // forces rebuild when sizing changes
  useEffect(() => {
    if (!viewportRef.current) return;

    const el = viewportRef.current;
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      setMetrics({ w: Math.round(r.width), h: Math.round(r.height) });
    });  // eesizeObserver update viewport width/height

    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!metrics.w || icons.length <= 0) return;

    const w = metrics.w;//for small-screen slightly smaller min
    const itemPx = clamp(Math.round(w * 0.16), 48, 120);
    const gapPx = clamp(Math.round(w * 0.035), 8, 22);
    const stepPx = itemPx + gapPx;

    const trackPx = stepPx * icons.length;
    const centerPx = w / 2;

    const a = animRef.current;
    a.itemPx = itemPx;
    a.stepPx = stepPx;
    a.trackPx = trackPx;
    a.centerPx = centerPx;
    a.viewW = w;
    a.offset = mod(a.offset, trackPx);// keep offset valid after resizing

    setRev((x) => x + 1);//triggers re-render of strip with new sizing
  }, [metrics.w, icons.length]);  // build sizing model when metrics/icons change

  const beginSpin = () => {
    const a = animRef.current;
    if (!a.trackPx || !a.stepPx || !a.itemPx || !a.centerPx) return;

    const durMs = randInt(2000, 3000);
    const speedN = clamp01(spinSpeed / 100);

    const loops = 1 + Math.floor(speedN * 3) + randInt(0, 1);
    const targetIdx = randInt(0, icons.length - 1);

    const i = targetIdx + loops * icons.length;
    const toOffset = i * a.stepPx + a.itemPx / 2 - a.centerPx;

    a.phase = 'spin';
    a.phaseStartTs = performance.now();
    a.spinDurationMs = durMs;
    a.fromOffset = a.offset;
    a.toOffset = toOffset;
  };// phase helper chooses next spin target

  const beginRest = () => {
    const a = animRef.current;
    a.phase = 'rest';
    a.phaseStartTs = performance.now();
    a.restDurationMs = 3000 + randInt(-180, 220);
    a.offset = mod(a.toOffset, a.trackPx); //snap clean
    applyFrame(true);
  };

  const tick = () => {
    const a = animRef.current;

    if (!a.running) return;

    const now = performance.now();

    if (a.phase === 'spin') {
      const t = clamp01((now - a.phaseStartTs) / a.spinDurationMs);
      const eased = easeOutCubic(t);
      a.offset = lerp(a.fromOffset, a.toOffset, eased);
      applyFrame(false);
      if (t >= 1) beginRest();
    } else if (a.phase === 'rest') {
      applyFrame(false);// keep frame applied (cheap)
      const t = now - a.phaseStartTs;
      if (t >= a.restDurationMs) {
        beginSpin();
      }
    } else {
      // idle: do nothing
    }
    rafRef.current = requestAnimationFrame(tick);
  }; // main RAF loop single source of truth

  const stop = () => {
    const a = animRef.current;
    a.running = false;
    a.phase = 'idle';
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  };

  const start = () => {
    const a = animRef.current;
    stop();//ensure clean start
    if (!active || icons.length <= 1 || !metrics.w) return;

    a.running = true;
    beginSpin();
    rafRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    if (!active || icons.length <= 1 || !metrics.w) {
      stop();
      return;
    }
    start();
    return () => stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, icons.length, metrics.w, spinSpeed]);//start/stop based on active/icons/metrics

  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === 'visible') {
        // restart clean when coming back
        if (active) start();
      } else {
        stop();
      }
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, icons.length, metrics.w]);// resume safety for mobile/tab throttling

  const applyFrame = (force = false) => {
    const a = animRef.current;
    const track = trackRef.current;
    if (!track || !a.trackPx || !a.stepPx || !a.itemPx || !a.viewW) return;

    const off = mod(a.offset, a.trackPx);
    track.style.transform = `translate3d(${-off}px, 0, 0)`;

    const halfW = a.viewW / 2;
    const edgeScale = 1.18; // slightly calmer on small screens
    const centerScale = 0.70;

    for (let i = 0; i < itemRefs.current.length; i++) {
      const el = itemRefs.current[i];
      if (!el) continue;

      const baseX = Number(el.dataset.baseX || 0);
      const itemCenter = baseX - off + a.itemPx / 2;
      const distN = clamp01(Math.abs(itemCenter - a.centerPx) / halfW);

      const scale = lerp(centerScale, edgeScale, Math.pow(distN, 0.85));
      const alpha = lerp(0.55, 0.95, distN);// make center MORE visible your previous math inverted it

      el.style.opacity = `${alpha}`;
      el.style.transform = `translate3d(${baseX}px, -50%, 0) scale(${scale})`;
    }

    if (force) track.getBoundingClientRect();
  };

  const renderedItems = useMemo(() => {
    const a = animRef.current;
    if (!icons.length || !a.stepPx || !a.itemPx || !metrics.w) return [];

    itemRefs.current = [];

    const baseCount = icons.length;

    // ensure we render enough to cover viewport twice + extra
    const needed = Math.ceil((metrics.w * 2) / a.stepPx) + baseCount * 2;
    const total = clamp(needed, baseCount * 3, baseCount * 8);

    // center the strip around 0 so translate works smoothly
    const startK = -Math.floor(total / 2);

    const items = [];
    for (let n = 0; n < total; n++) {
      const k = startK + n;
      const idx = mod(k, baseCount);
      const baseX = k * a.stepPx;

      items.push(
        <IconItem
          key={`${k}-${idx}-${rev}`}
          ref={(el) => (itemRefs.current[n] = el)}
          data-base-x={baseX}
          style={{
            width: a.itemPx,
            height: a.itemPx,
            transform: `translate3d(${baseX}px, -50%, 0) scale(1)`,
            opacity: 0.9,
          }}
        >
          <img src={icons[idx]} alt="" draggable={false} />
        </IconItem>
      );
    }

    return items;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [icons, metrics.w, rev]);  // render strip adaptive repeats so viewport always filled + buffer

  useEffect(() => {
    if (!renderedItems.length) return;
    applyFrame(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderedItems]);

  if (!icons.length) return <Shell aria-label="Loading effect" />;

  return (
    <Shell aria-label="Loading effect">
      <Blob className="blob blob-1" />
      <Blob className="blob blob-2" />
      <Blob className="blob blob-3" />

      <Vignette />

      <CarouselViewport ref={viewportRef}>
        <CarouselTrack ref={trackRef}>{renderedItems}</CarouselTrack>
        <CenterMask />
      </CarouselViewport>

      <GlassHighlight />
    </Shell>
  );
};

export default TrendsFallbackEffect;

const randInt = (min, max) => Math.floor(min + Math.random() * (max - min + 1));
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const clamp01 = (v) => clamp(v, 0, 1);
const mod = (n, m) => ((n % m) + m) % m;
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

// ===== styles (kept basically the same) =====

const drift1 = keyframes`
  0%   { transform: translate(-12%, -10%) scale(1.15); }
  33%  { transform: translate(8%, 6%) scale(1.25); }
  66%  { transform: translate(2%, -4%) scale(1.18); }
  100% { transform: translate(-12%, -10%) scale(1.15); }
`;

const drift2 = keyframes`
  0%   { transform: translate(10%, 12%) scale(1.2); }
  33%  { transform: translate(-6%, 2%) scale(1.1); }
  66%  { transform: translate(4%, -8%) scale(1.26); }
  100% { transform: translate(10%, 12%) scale(1.2); }
`;

const drift3 = keyframes`
  0%   { transform: translate(0%, 0%) scale(1.08); }
  33%  { transform: translate(8%, -10%) scale(1.22); }
  66%  { transform: translate(-10%, 6%) scale(1.12); }
  100% { transform: translate(0%, 0%) scale(1.08); }
`;

const hueSwim = keyframes`
  0%   { filter: hue-rotate(0deg) saturate(1.15); }
  50%  { filter: hue-rotate(18deg) saturate(1.28); }
  100% { filter: hue-rotate(0deg) saturate(1.15); }
`;

const Shell = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 320px;
  border-radius: var(--input-radius-rounded);
  border: 1.5px solid var(--grey-50);
  background: transparent;
  overflow: hidden;
  isolation: isolate;

  will-change: transform;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    z-index: 1;
  }
`;

const Blob = styled.div`
  position: absolute;
  z-index: 0;

  width: 150%;
  height: 150%;
  left: -25%;
  top: -25%;

  background:
    radial-gradient(50% 50% at 20% 30%, rgba(70, 65, 222, 0.183) 0%, rgba(53,47,220,0.00) 72%),
    radial-gradient(50% 50% at 55% 80%, rgba(90, 47, 199, 0.34) 0%, rgba(255,209,25,0.00) 70%),
    radial-gradient(50% 50% at 85% 72%, rgba(207,125,71,0.14) 0%, rgba(207,125,71,0.00) 78%),
    radial-gradient(50% 50% at 40% 10%, rgba(112, 150, 255, 0.396) 0%, rgba(255,209,25,0.00) 74%),
    radial-gradient(50% 50% at 40% 10%, rgba(40, 69, 125, 0.257) 0%, rgba(255,209,25,0.00) 74%);

  filter: blur(60px);
  opacity: 0.82;
  mix-blend-mode: screen;

  &.blob-1 {
    animation: ${drift1} 8.6s ease-in-out infinite, ${hueSwim} 6.4s ease-in-out infinite;
  }
  &.blob-2 {
    animation: ${drift2} 10.4s ease-in-out infinite, ${hueSwim} 7.2s ease-in-out infinite;
    opacity: 0.98;
    filter: blur(18px);
  }
  &.blob-3 {
    animation: ${drift3} 9.6s ease-in-out infinite, ${hueSwim} 8.0s ease-in-out infinite;
    opacity: 0.58;
    filter: blur(42px);
    mix-blend-mode: overlay;
  }
`;

const Vignette = styled.div`
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  opacity: 0.9;
`;

const GlassHighlight = styled.div`
  position: absolute;
  inset: 0;
  z-index: 4;
  pointer-events: none;
  opacity: 0.62;
`;

const CarouselViewport = styled.div`
  position: absolute;
  inset: 0;
  z-index: 3;
  overflow: hidden;
  pointer-events: none;
`;

const CarouselTrack = styled.div`
  position: absolute;
  inset: 0;
  will-change: transform;
  transform: translate3d(0, 0, 0);
`;

const IconItem = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  transform-origin: center;
  filter: drop-shadow(0 12px 22px rgba(0,0,0,0.14));

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    user-select: none;
    -webkit-user-drag: none;
    opacity: 0.92;
  }
`;

const CenterMask = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 4;

  background:
    radial-gradient(50% 60% at 50% 50%, rgba(0,0,0,0.00) 0%, rgba(0,0,0,0.06) 55%, rgba(0,0,0,0.20) 100%);
`;