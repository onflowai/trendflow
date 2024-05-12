import React, { useState, useEffect } from 'react';
import Container from '../assets/wrappers/LogoCarouselContainer';

const svgModules = import.meta.globEager('../assets/images/logos/*.svg'); // importing all SVG files from the logos directory
const logos = Object.values(svgModules).map((module) => module.default); // Converting imported modules into an array of their default exports (the SVG content)

const LogoCarousel = ({ interval = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % logos.length);
    }, interval);
    return () => clearInterval(timer);
  }, [logos.length, interval]);

  return (
    <Container>
      <div className="carousel-container">
        {logos.map((logo, index) => (
          <img
            src={logo}
            className={`carousel-item ${
              index === currentIndex ? 'active' : ''
            }`}
            alt="logo"
            key={index}
            style={{ height: '17px', width: '17px' }}
          />
        ))}
      </div>
    </Container>
  );
};

export default LogoCarousel;
