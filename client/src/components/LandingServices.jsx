// src/components/LandingServices.jsx
import React, { useRef, useState, useCallback } from 'react';
import LandingTitle from './LandingTitle';
import { services } from '../assets/utils/data';
//import Container from '../assets/wrappers/LandingServicesContainer';
import styled from 'styled-components';
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
        <LandingTitle  title="services" />
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

const Container = styled.div`
  display: grid;
  gap: 2rem;
  margin: 0rem auto;
  grid-template-columns: 1fr; // default to 1 column

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr); // 2 columns for medium screens
  }

  @media (min-width: 992px) {
    grid-template-columns: repeat(3, 1fr); // 3 columns for large screens
  }

  .services{
    padding: 1rem;
  }

  .feature-card {
    background: var(--background-second-color);
    /* box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); */
    border-radius: 8px;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;

    .icon {
      /* Style for your icons */
      margin-bottom: 1rem;
      font-size: 3rem; // Example size, adjust as needed
    }
    p {
    line-height: 2;
    color: var(--text-second-color);
    margin-bottom: 1.5rem;
    max-width: 35em;
    }

    .title {
      margin: 0.5rem 0;
    }

    .text {
      font-size: 0.9rem;
    }
  }
  
`;

export default LandingServices;
