import React, { useState } from 'react';
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { getFullIconUrl, getFullTrendUrl } from '../utils/urlHelper';
import { Tooltip } from '../components';
/**
 * CarouselSlider takes on Trend object takes the url_svg which is in the object puts it into
 * slider with slider controls and adds the slug as a link to the respective trend page
 * @param {*} param0
 * @returns
 */
const CarouselSlider = ({ trends }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % trends.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? trends.length - 1 : prevIndex - 1
    );
  };
  return (
    <SliderContainer>
      <IoIosArrowBack onClick={prevSlide} className="arrow arrow-left" />
      <div className="slider">
        <Tooltip
          description={trends[currentIndex].trend}
          xOffset={-35}
          yOffset={-90}
        >
          <Link to={getFullTrendUrl(trends[currentIndex].slug)}>
            <img
              src={trends[currentIndex].svg_url}
              alt={trends[currentIndex].trend}
              className="trend-icon"
            />
          </Link>
        </Tooltip>
      </div>
      <IoIosArrowForward onClick={nextSlide} className="arrow arrow-right" />
    </SliderContainer>
  );
};

const SliderContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;

  .slider {
    width: 50px;
    height: 50px;
    overflow: visible;
  }

  .trend-icon {
    width: 50px;
    height: 50px;
    transition: transform 0.3s ease-in-out; /* Quick slide animation */
  }

  .arrow {
    cursor: pointer;
    font-size: 1.5rem;
    color: black;
    user-select: none;
  }

  .arrow-left {
    margin-right: 10px;
  }

  .arrow-right {
    margin-left: 10px;
  }
`;

export default CarouselSlider;
