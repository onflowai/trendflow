import React, { useState, useEffect } from 'react';
import Container from '../assets/wrappers/ScrollSpyContainer';

const ScrollSpyComponent = ({ sectionIds }) => {
  const [activeSection, setActiveSection] = useState('');

  const onScroll = () => {
    let currentSection = '';
    sectionIds.forEach((sectionId) => {
      const section = document.getElementById(sectionId);
      const scrollPosition = window.scrollY + window.innerHeight / 2; // Adjust based on your layout
      if (section.offsetTop <= scrollPosition) {
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

  return (
    <Container>
      <div className="spy-scroll-section">
        {sectionIds.map((sectionId) => (
          <div
            key={sectionId}
            className={`spy-item ${
              activeSection === sectionId ? 'active' : ''
            }`}
          >
            {sectionId}
          </div>
        ))}
      </div>
    </Container>
  );
};

export default ScrollSpyComponent;
