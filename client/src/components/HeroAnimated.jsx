
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';

// Local SVG fallbacks - imported as asset URLs, not React components
import light01 from '../assets/images/logo-hero-01.svg?no-inline';
import light02 from '../assets/images/logo-hero-02.svg?no-inline';
import light03 from '../assets/images/logo-hero-03.svg?no-inline';
import light04 from '../assets/images/logo-hero-04.svg?no-inline';

import dark01 from '../assets/images/logo-hero-01-dark.svg?no-inline';
import dark02 from '../assets/images/logo-hero-02-dark.svg?no-inline';
import dark03 from '../assets/images/logo-hero-03-dark.svg?no-inline';
import dark04 from '../assets/images/logo-hero-04-dark.svg?no-inline';

const CDN_BASE = 'https://cdn.trendflowai.com/content';
const SESSION_KEY = 'heroLogoIndex';

// Each design has a matching light/dark variant
const LOGOS = [
  {
    light: { cdn: `${CDN_BASE}/logo-hero-01.svg`, local: light01 },
    dark: { cdn: `${CDN_BASE}/logo-hero-01-dark.svg`, local: dark01 },
  },
  {
    light: { cdn: `${CDN_BASE}/logo-hero-02.svg`, local: light02 },
    dark: { cdn: `${CDN_BASE}/logo-hero-02-dark.svg`, local: dark02 },
  },
  {
    light: { cdn: `${CDN_BASE}/logo-hero-03.svg`, local: light03 },
    dark: { cdn: `${CDN_BASE}/logo-hero-03-dark.svg`, local: dark03 },
  },
  {
    light: { cdn: `${CDN_BASE}/logo-hero-04.svg`, local: light04 },
    dark: { cdn: `${CDN_BASE}/logo-hero-04-dark.svg`, local: dark04 },
  },
];

// Generate a random index once per browser tab session
const getSessionLogoIndex = () => {
  try {
    const saved = sessionStorage.getItem(SESSION_KEY);

    if (saved !== null) {
      const index = Number(saved);

      if (Number.isInteger(index) && index >= 0 && index < LOGOS.length) {
        return index;
      }
    }

    const index = Math.floor(Math.random() * LOGOS.length);
    sessionStorage.setItem(SESSION_KEY, String(index));

    return index;
  } catch {
    return Math.floor(Math.random() * LOGOS.length);
  }
};

const HeroAnimated = () => {
  const { isDarkTheme } = useTheme();

  const [logoIndex, setLogoIndex] = useState(null);
  const [displayedSrc, setDisplayedSrc] = useState(null);

  // Select after mounting to avoid SSR hydration mismatches
  useEffect(() => {
    setLogoIndex(getSessionLogoIndex());
  }, []);

  // Determine the selected CDN image and its local fallback
  const asset =
    logoIndex === null
      ? null
      : LOGOS[logoIndex][isDarkTheme ? 'dark' : 'light'];

  useEffect(() => {
    if (!asset) return;

    let cancelled = false;

    // Preload and decode before replacing the visible image
    const loadImage = async (src, useFallback = false) => {
      const image = new Image();
      image.decoding = 'async';
      image.src = src;

      try {
        await image.decode();

        if (!cancelled) {
          setDisplayedSrc(src);
        }
      } catch {
        if (!cancelled && !useFallback) {
          await loadImage(asset.local, true);
        }
      }
    };

    loadImage(asset.cdn);

    // Ignore previous loads if theme or component changes
    return () => {
      cancelled = true;
    };
  }, [asset]);

  return (
    <Container>
      <div className="svg-container">
        <StyledSVGWrapper>
          {displayedSrc && (
            <img
              src={displayedSrc}
              alt="TrendFlow AI Hero"
              decoding="async"
            />
          )}
        </StyledSVGWrapper>
      </div>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  width: 700.68px; /* Match SVG viewBox width */
  height: 432.56px; /* Match SVG viewBox height */
  display: flex; /* Add flexbox */
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */

  .svg-container {
    position: relative;
    width: 100%;
    height: 100%;
    position: center;
    z-index: 2;
  }
`;

const StyledSVGWrapper = styled.div`
  width: 80%;
  height: auto;

  img {
    display: block;
    width: 100%;
    height: auto;
  }
`;

export default HeroAnimated;
