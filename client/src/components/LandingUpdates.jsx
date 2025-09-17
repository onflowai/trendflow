import React, { useState, useRef } from 'react';
import LandingTitle from './LandingTitle';
import { majorUpdates } from '../assets/utils/data';
import styled from 'styled-components';
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';

const LandingUpdates = () => {
  const updates = Array.isArray(majorUpdates) ? [...majorUpdates].reverse() : [];
  const [current, setCurrent] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const [slideDirection, setSlideDirection] = useState(''); // 'left' or 'right'
  const timeoutRef = useRef(null);

  const handleSlide = (dir) => {
    if (isSliding) return; // prevent spam

    setSlideDirection(dir);
    setIsSliding(true);

    timeoutRef.current = setTimeout(() => {
      setIsSliding(false);
      setCurrent((prev) => {
        if (dir === 'right') {
          return (prev + 1) % updates.length;
        } else {
          return (prev - 1 + updates.length) % updates.length;
        }
      });
    }, 330); // matching the CSS animation duration
  };

  React.useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  return (
    <Container>
      <section className="section section-center" id="updates">
        <LandingTitle title="major" subTitle="updates" />
        <div className="section-center about-center">
          <article className="about-info">
            {/* <h3>Major Updates:</h3> */}
            <div className="slider-wrapper">
              <IoIosArrowBack
                className="slider-arrow"
                onClick={() => handleSlide('left')}
                aria-label="Previous update"
                tabIndex={0}
              />
              <div className="about-updates">
                <div
                  className={`update-slide${isSliding ? ` ${slideDirection}` : ''}`}
                  key={updates[current].version}
                >
                  <div className="update-text">
                    {updates[current].text}
                  </div>
                  <div className="version-box">
                    <span className="version">v{updates[current].version}</span>
                  </div>
                </div>
              </div>
              <IoIosArrowForward
                className="slider-arrow"
                onClick={() => handleSlide('right')}
                aria-label="Next update"
                tabIndex={0}
              />
            </div>
            <a href="#" className="btn">
              Explore All
            </a>
          </article>
        </div>
      </section>
    </Container>
  );
};

const Container = styled.section`
  padding-bottom: 2rem;

  .slider-wrapper {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 1.2rem;
    min-height: 90px;
    position: relative;
    margin-bottom: 1rem;
  }

  .slider-arrow {
    font-size: 2.2rem;
    cursor: pointer;
    color: var(--primary-300);
    transition: color 0.15s;
    user-select: none;
    outline: none;
    box-shadow: none;
    background: none;
    border: none;
  }
  .slider-arrow:hover {
    color: var(--primary-800);
    outline: none;
    box-shadow: none;
    background: none;
    border: none;
  }

  .about-updates {
    min-width: 220px;
    min-height: 60px;
    position: relative;
    overflow: hidden;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    margin: 0 0.5rem;
    height: 80px;
  }

  .update-slide {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    position: relative;
    background: transparent;
    transition: transform 0.3s cubic-bezier(0.7, 0, 0.3, 1), opacity 0.3s;
    opacity: 1;
    transform: translateX(0);
  }
  .update-text {
    flex: 5 1 0%;
    text-align: left;
  }
  .version {
    flex: 1 1 0%;
    text-align: right;
    margin-top: 0;  /* Remove margin so it aligns in the row */
  }
  .update-slide.left {
    animation: slideLeft 0.33s forwards;
  }
  .update-slide.right {
    animation: slideRight 0.33s forwards;
  }

  @keyframes slideLeft {
    0% {
      opacity: 1;
      transform: translateX(0);
    }
    70% {
      opacity: 0.3;
      transform: translateX(-60px);
    }
    100% {
      opacity: 0;
      transform: translateX(-120px);
    }
  }

  @keyframes slideRight {
    0% {
      opacity: 1;
      transform: translateX(0);
    }
    70% {
      opacity: 0.3;
      transform: translateX(60px);
    }
    100% {
      opacity: 0;
      transform: translateX(120px);
    }
  }

  .version {
    background-color: var(--background-second-color);
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.9rem;
    color: var(--text-second-color);
    margin-top: 0.5rem;
  }
  .btn {
    padding: 0.75rem 1rem;
  }

  @media (min-width: 992px) {
    .about-updates {
      flex-direction: row;
      align-items: center;
    }
    .version {
      margin-left: auto;
    }
  }
`;

export default LandingUpdates;
