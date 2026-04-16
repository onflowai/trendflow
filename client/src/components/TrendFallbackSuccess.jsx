import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';

/**
 * TrendFallbackSuccess shows the chosen tech icon fullImageUrl has responsive sizing based on container width
 * iconMovement = true controls optional slow movement inside bounds no React re-render per frame
 */
const TrendFallbackSuccess = ({
  icon = '',
  iconMovement = true,
  isMobile = false,
  iconSize,
  iconSizeSmall,
  speed = 1,
}) => {
  const shellRef = useRef(null);
  const iconRef = useRef(null);
  const rafRef = useRef(null);
  const stateRef = useRef({
    x: 0,
    y: 0,
    lastTs: 0,
    w: 0,
    h: 0,
    margin: 16,
    phaseA: Math.random() * Math.PI * 2,
    phaseB: Math.random() * Math.PI * 2,
    phaseC: Math.random() * Math.PI * 2,
    phaseD: Math.random() * Math.PI * 2,
  });

  const [autoSize, setAutoSize] = useState(96);
  const resolvedIcon = useMemo(() => icon || '', [icon]);
  const resolvedSize = useMemo(() => {
    const override = isMobile ? iconSizeSmall : iconSize;
    return override ?? autoSize;
  }, [isMobile, iconSizeSmall, iconSize, autoSize]);

  useEffect(() => {
    if (!shellRef.current) return;

    const ro = new ResizeObserver(() => {
      const r = shellRef.current.getBoundingClientRect();
      const s = clamp(Math.round(r.width * 0.22), 70, 140);
      stateRef.current.w = r.width;
      stateRef.current.h = r.height;
      setAutoSize(s);
    });

    ro.observe(shellRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    cancel();
    if (!iconMovement) return;
    const now = performance.now();
    stateRef.current.lastTs = now;
    tick(now);
    return () => cancel();
  }, [iconMovement, resolvedSize, speed]);// eslint-disable-next-line react-hooks/exhaustive-deps

  const cancel = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  };

  const tick = (ts) => {
    const s = stateRef.current;
    const el = iconRef.current;
    if (!el) return;

    const dt = clamp((ts - (s.lastTs || ts)) / 1000, 0, 0.05);// dt in seconds clamped to avoid jumps
    s.lastTs = ts;
    const size = resolvedSize;// bounds based on resolved size
    const m = s.margin;
    const maxX = Math.max(0, s.w - size - m * 2);
    const maxY = Math.max(0, s.h - size - m * 2);
    const t = ts * 0.00008 * Math.max(0.05, speed);//smoothly varying target using sin/cos
    const nx =
      0.5 +
      0.25 * Math.sin(t + s.phaseA) +
      0.25 * Math.sin(t * 0.61 + s.phaseB);
    const ny =
      0.5 +
      0.25 * Math.cos(t * 0.83 + s.phaseC) +
      0.25 * Math.sin(t * 0.47 + s.phaseD);// speed controls how fast phases advance (lower = slower drift)

    const tx = m + clamp(nx, 0, 1) * maxX;
    const ty = m + clamp(ny, 0, 1) * maxY;
    const follow = clamp(dt * 0.9 * Math.max(0.15, speed), 0.0015, 0.02);// smooth chase lerp factor depends on dt and speed, still very slow
    s.x += (tx - s.x) * follow;
    s.y += (ty - s.y) * follow;

    el.style.transform = `translate3d(${s.x}px, ${s.y}px, 0)`;

    rafRef.current = requestAnimationFrame(tick);
  };

  return (
    <Shell ref={shellRef} aria-label="Trend submitted">
      <IconWrap
        ref={iconRef}
        style={{ width: resolvedSize, height: resolvedSize }}
        $hasIcon={Boolean(resolvedIcon)}
      >
        {resolvedIcon ? (
          <img src={resolvedIcon} alt="" draggable={false} />
        ) : (
          <FallbackDot aria-hidden="true" />
        )}
      </IconWrap>

      <Caption>
        <span className="title">Submitted</span>
        <span className="sub">Waiting for approval</span>
      </Caption>
    </Shell>
  );
};

export default TrendFallbackSuccess;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

const pop = keyframes`
  0%   { transform: scale(0.96); opacity: 0.0; }
  60%  { transform: scale(1.02); opacity: 1.0; }
  100% { transform: scale(1.00); opacity: 1.0; }
`;//animations

const breathe = keyframes`
  0%   { filter: drop-shadow(0 10px 18px rgba(0,0,0,0.10)); }
  50%  { filter: drop-shadow(0 14px 26px rgba(0,0,0,0.16)); }
  100% { filter: drop-shadow(0 10px 18px rgba(0,0,0,0.10)); }
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
`;

const IconWrap = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 18px;
  animation: ${pop} 420ms ease-out, ${breathe} 3.6s ease-in-out infinite;
  will-change: transform;
  pointer-events: none;
  display: grid;
  place-items: center;

  img {
    width: 72%;
    height: 72%;
    object-fit: contain;
    user-select: none;
    -webkit-user-drag: none;
    opacity: ${({ $hasIcon }) => ($hasIcon ? 0.96 : 0.0)};
  }
`;

const FallbackDot = styled.div`
  width: 42%;
  height: 42%;
  border-radius: 999px;
  background: rgba(120, 128, 160, 0.35);
`;

const Caption = styled.div`
  position: absolute;
  left: 14px;
  bottom: 12px;
  z-index: 2;
  pointer-events: none;

  .title {
    display: block;
    font-weight: 700;
    letter-spacing: 0.2px;
    color: var(--grey-90);
  }

  .sub {
    display: block;
    font-size: 0.92rem;
    color: var(--grey-70);
    margin-top: 2px;
  }
`;