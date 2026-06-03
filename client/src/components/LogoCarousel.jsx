import React, { useState, useEffect } from 'react';
//import Container from '../assets/wrappers/LogoCarouselContainer';
import styled from 'styled-components';

const svgModules = import.meta.globEager('../assets/images/icons/*.svg'); // importing all SVG files from the icons directory
const icons = Object.values(svgModules).map((module) => module.default); // Converting imported modules into an array of their default exports (the SVG content)

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
} //randomizing the array

shuffleArray(icons); //shuffling on load

const LogoCarousel = ({ interval = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % icons.length);
    }, interval);
    return () => clearInterval(timer);
  }, [icons.length, interval]);

  return (
    <Container>
      <div className="carousel-container">
        {icons.map((logo, index) => (
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

const Container = styled.div`
.carousel-container {
  position: relative;
  height: 17px;
  overflow: hidden;
}

.carousel-item {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.carousel-item.active {
  opacity: 1;
}
`;

export default LogoCarousel;
