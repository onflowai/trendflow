import styled from 'styled-components';

const Container = styled.article`
    position: relative;
  background: var(--card-background);
  border-radius: var(--border-radius);
  border: 1.5px solid var(--border-color);
  display: grid;
  grid-template-rows: 1fr auto;
  overflow: hidden;
  isolation: isolate;
  background-clip: padding-box;

  /* safari + webKit rounded overflow clipping fix */
  -webkit-mask-image: -webkit-radial-gradient(white, black);
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-size: 100% 100%;

  /* extra compositor stability for safari */
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 21; /* above gradient overlay */
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s ease;
    border-radius: inherit;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;

    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23noise)' opacity='0.8'/%3E%3C/svg%3E");
    background-repeat: repeat;
    background-size: var(--inference-grain-size, 90px) var(--inference-grain-size, 90px);

    mix-blend-mode: soft-light; /* lets the gradient color seep through the grain */
  }

  &::after {
    content: '';
    position: absolute;

    width: var(--inference-overlay-size, 420%);
    height: var(--inference-overlay-size, 420%);

    top: calc((100% - var(--inference-overlay-size, 420%)) / 2);
    left: calc((100% - var(--inference-overlay-size, 420%)) / 2);

    z-index: 20;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s ease;
    will-change: transform;

    background: linear-gradient(
      to top right,

      /* cycle 1 */
      var(--inference-color-1) 0%,
      var(--inference-color-2) calc(var(--inference-color-proximity, 3.8%) * 1),
      var(--inference-color-3) calc(var(--inference-color-proximity, 3.8%) * 2),
      var(--inference-color-4) calc(var(--inference-color-proximity, 3.8%) * 3),
      var(--inference-color-5) calc(var(--inference-color-proximity, 3.8%) * 4),
      var(--inference-color-6) calc(var(--inference-color-proximity, 3.8%) * 5),
      var(--inference-color-7) calc(var(--inference-color-proximity, 3.8%) * 6),
      var(--inference-color-8) calc(var(--inference-color-proximity, 3.8%) * 7),
      var(--inference-color-9) calc(var(--inference-color-proximity, 3.8%) * 8),
      var(--inference-color-1) 33.333%,

      /* cycle 2 */
      var(--inference-color-2) calc(33.333% + (var(--inference-color-proximity, 3.8%) * 1)),
      var(--inference-color-3) calc(33.333% + (var(--inference-color-proximity, 3.8%) * 2)),
      var(--inference-color-4) calc(33.333% + (var(--inference-color-proximity, 3.8%) * 3)),
      var(--inference-color-5) calc(33.333% + (var(--inference-color-proximity, 3.8%) * 4)),
      var(--inference-color-6) calc(33.333% + (var(--inference-color-proximity, 3.8%) * 5)),
      var(--inference-color-7) calc(33.333% + (var(--inference-color-proximity, 3.8%) * 6)),
      var(--inference-color-8) calc(33.333% + (var(--inference-color-proximity, 3.8%) * 7)),
      var(--inference-color-9) calc(33.333% + (var(--inference-color-proximity, 3.8%) * 8)),
      var(--inference-color-1) 66.666%,

      /* cycle 3 */
      var(--inference-color-2) calc(66.666% + (var(--inference-color-proximity, 3.8%) * 1)),
      var(--inference-color-3) calc(66.666% + (var(--inference-color-proximity, 3.8%) * 2)),
      var(--inference-color-4) calc(66.666% + (var(--inference-color-proximity, 3.8%) * 3)),
      var(--inference-color-5) calc(66.666% + (var(--inference-color-proximity, 3.8%) * 4)),
      var(--inference-color-6) calc(66.666% + (var(--inference-color-proximity, 3.8%) * 5)),
      var(--inference-color-7) calc(66.666% + (var(--inference-color-proximity, 3.8%) * 6)),
      var(--inference-color-8) calc(66.666% + (var(--inference-color-proximity, 3.8%) * 7)),
      var(--inference-color-9) calc(66.666% + (var(--inference-color-proximity, 3.8%) * 8)),
      var(--inference-color-1) 100%
    );

    transform: translate3d(-16.666%, 16.666%, 0);
  }//end  &::after

  &.inference-random-mode::after {
    background: linear-gradient(
      to top right,
      transparent 0%,

      color-mix(
        in srgb,
        var(--inference-random-color, var(--inference-color-1))
          var(--inference-random-color-strength, 100%),
        transparent
      ) 12%,

      color-mix(
        in srgb,
        var(--inference-random-color, var(--inference-color-1))
          var(--inference-random-color-strength, 100%),
        transparent
      ) 22%,

      color-mix(
        in srgb,
        var(--inference-random-color, var(--inference-color-1))
          var(--inference-random-color-strength, 100%),
        transparent
      ) 33.333%,

      transparent 44%,

      color-mix(
        in srgb,
        var(--inference-random-color, var(--inference-color-1))
          var(--inference-random-color-strength, 100%),
        transparent
      ) 55%,

      color-mix(
        in srgb,
        var(--inference-random-color, var(--inference-color-1))
          var(--inference-random-color-strength, 100%),
        transparent
      ) 66.666%,

      color-mix(
        in srgb,
        var(--inference-random-color, var(--inference-color-1))
          var(--inference-random-color-strength, 100%),
        transparent
      ) 77%,

      transparent 100%
    );
  }

  &.inference-color-mode:hover::before {
    opacity: var(--inference-grain-opacity, 0.18); /*grain strength */
  }

  &.inference-color-mode:hover::after {
    opacity: var(--inference-color-transparency, 0.18);
    animation: inferenceOneWayFlow var(--inference-mode-speed, 5s) linear infinite;
  }

  &.inference-color-mode.inference-no-animation:hover::after {
  animation: none; /* HERE static overlay with grain */
  }

  &.inference-no-hover-trigger:hover,
  &.inference-no-hover-trigger:hover * {
    cursor: none !important; /* HERE hides cursor only while hovering this card */
  }

  @keyframes inferenceOneWayFlow {
    from {
      transform: translate3d(-16.666%, 16.666%, 0);
    }

    to {
      transform: translate3d(16.666%, -16.666%, 0);
    }
  }

  .loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 50;
    background-color: rgba(255, 255, 255, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .overlay {
  }

  @media (prefers-reduced-motion: reduce) {
  &.inference-color-mode:hover::after {
    animation: none;
  }
}
`;

export default Container;