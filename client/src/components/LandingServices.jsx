// src/components/LandingServices.jsx
import React, { useRef, useState, useCallback } from 'react';
import LandingTitle from './LandingTitle';
import { services } from '../assets/utils/data';
import Container from '../assets/wrappers/LandingServicesContainer';
import MobileCarousel from '../assets/wrappers/LandingServicesMobileContainer';
import useWindowSize from '../hooks/useWindowSize';

const LandingServices = () => {
  const { isMobile } = useWindowSize();

  const [index, setIndex] = useState(0);
  const max = services.length - 1;
  const next = useCallback(() => setIndex((i) => Math.min(i + 1, max)), [max]);
  const prev = useCallback(() => setIndex((i) => Math.max(i - 1, 0)), []);

  const startY = useRef(null);
  const deltaY = useRef(0);
  const onTouchStart = (e) => { startY.current = e.touches[0].clientY; deltaY.current = 0; };
  const onTouchMove = (e) => { if (startY.current == null) return; deltaY.current = e.touches[0].clientY - startY.current; };
  const onTouchEnd = () => {
    if (Math.abs(deltaY.current) > 40) { deltaY.current < 0 ? next() : prev(); }
    startY.current = null; deltaY.current = 0;
  };

  return (
    <>
      <section id="services">
        <LandingTitle title="services" />
      </section>

      {!isMobile && (
        <Container>
          {services.map((service) => (
            <div className="feature-card" key={service.id}>
              <span className="icon">{service.icon}</span>
              <h3 className="title">{service.title}</h3>
              <p className="text">{service.text}</p>
            </div>
          ))}
        </Container>
      )}

      {isMobile && (
        <MobileCarousel role="region" aria-label="Services carousel">
          <div
            className="carousel-viewport"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div
              className="carousel-track"
              style={{ transform: `translateY(calc(-1 * ${index} * (var(--card-h) + var(--gap))))` }}
            >
              {services.map((service) => (
                <div className="carousel-item" key={service.id}>
                  <div className="feature-card">
                    <span className="icon">{service.icon}</span>
                    <h3 className="title">{service.title}</h3>
                    <p className="text">{service.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="carousel-controls">
            <button type="button" className="btn-nav" onClick={prev} disabled={index === 0} aria-label="Previous">▲</button>
            <span className="counter" aria-live="polite">{index + 1}/{services.length}</span>
            <button type="button" className="btn-nav" onClick={next} disabled={index === max} aria-label="Next">▼</button>
          </div>
        </MobileCarousel>
      )}
    </>
  );
};

export default LandingServices;
