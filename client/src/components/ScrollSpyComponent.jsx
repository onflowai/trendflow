import React, { useState, useEffect } from 'react';
import Container from '../assets/wrappers/ScrollSpyContainer';

const ScrollSpyComponent = ({ sectionIds }) => {
  const [activeSection, setActiveSection] = useState('');

  const onScroll = () => {
    let currentSection = '';
    const offset = 110; // adjusting this value based on other CSS styling
    sectionIds.forEach((sectionId) => {
      const section = document.getElementById(sectionId);
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const scrollPosition = window.scrollY + offset;
      if (sectionTop <= scrollPosition) {
        currentSection = sectionId;
      }
    });
    setActiveSection(currentSection);
  };

  useEffect(() => {
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [sectionIds]);

  const handleClick = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <Container>
      <div className="spy-scroll-section">
        {sectionIds.map((sectionId) => (
          <div
            key={sectionId}
            className={`spy-item ${
              activeSection === sectionId ? 'active' : ''
            }`}
            onClick={() => handleClick(sectionId)}
          >
            {sectionId}
          </div>
        ))}
      </div>
    </Container>
  );
};

export default ScrollSpyComponent;
