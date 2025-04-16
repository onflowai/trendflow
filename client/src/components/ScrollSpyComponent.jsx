import React, { useState, useEffect } from 'react';
import Container from '../assets/wrappers/ScrollSpyContainer';
import useWindowSize from '../hooks/useWindowSize';

const ScrollSpyComponent = ({ sectionIds }) => {
  const [activeSection, setActiveSection] = useState('');
  const { isMobile } = useWindowSize();

  const onScroll = () => {
    let currentSection = '';
    const offset = 200;

    sectionIds.forEach((sectionId) => {
      const section = document.getElementById(sectionId);
      if (!section) {
        return; // skipping iteration if the element is not found
      }
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
    if (!isMobile && sectionId === 'Related') {
      return; // preventing scroll in desktop for the "Related" section
    }
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
