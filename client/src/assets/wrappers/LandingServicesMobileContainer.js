import styled from 'styled-components';

const MobileCarousel = styled.div`
  --card-h: 250px;
  --peek: 56px;
  --gap: 10px;

  position: relative;
  margin: 0 0rem 1.5rem;

  .carousel-viewport {
    height: calc(var(--card-h) + var(--peek));
    overflow: hidden;
    border-radius: 12px;
    touch-action: pan-y;
    background: transparent;
  }

  .carousel-track {
    display: flex;
    flex-direction: column;
    gap: var(--gap);
    transition: transform 280ms ease;
    will-change: transform;
    padding-bottom: calc(var(--peek) + var(--gap));//preserves spacing after last card
    padding-top: var(--gap);//prevents first card from “mashing” at top
  }

  .carousel-item {
    height: var(--card-h);
    display: flex;
    align-items: stretch;//make children stretch the full height
  }

  .carousel-item > .feature-card {
    flex: 1 1 auto;//take all available space
    min-height: 100%;//ensure full slot height
    width: 100%;//no accidental shrink
    box-sizing: border-box;
  }

  .feature-card {
    background: var(--background-second-color);
    border-radius: 8px;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    box-shadow: 0 6px 14px rgba(0,0,0,0.02);
  }

  .feature-card .icon {
    margin-bottom: 1rem;
    font-size: 3rem;
  }
  .feature-card p {
    line-height: 2;
    color: var(--text-second-color);
    margin-bottom: 1.5rem;
    max-width: 35em;
  }
  .feature-card .title {
    margin: 0.5rem 0;
  }
  .feature-card .text {
    font-size: 0.9rem;
  }

  .carousel-controls {
    position: absolute;
    right: 0px;
    bottom: -38px;
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(0,0,0,0.06);
    padding: 4px 4px;
    border-radius: 10px;
    backdrop-filter: saturate(120%) blur(2px);
  }

  .btn-nav {
    cursor: pointer;
    border: 0;
    border-radius: 8px;
    padding: 4px 8px;
    background: var(--brand, #222);
    color: #fff;
  }
  .btn-nav:disabled { opacity: 0.4; }
  .counter { font-size: 0.85rem; }
`;

export default MobileCarousel;
