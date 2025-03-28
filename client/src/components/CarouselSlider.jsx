import React, { useState } from 'react';
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { getFullIconUrl, getFullTrendUrl } from '../utils/urlHelper';
import { Tooltip } from '../components';
import { BsCircleFill } from 'react-icons/bs';
/**
 * CarouselSlider takes on Trend object takes the url_svg which is in the object puts it into
 * slider with slider controls and adds the slug as a link to the respective trend page
 * NOTE: if svg_url present it uses it if `trend` matches `trendTech` (ignoring case), use `techIconUrl`
 * otherwise CarouselSlider returns `null`
 * @param {*} param0
 * @returns
 */

const isValidUrl = (url) =>
  url && url !== 'undefined' && url !== 'null' && url.trim() !== '';

function getTrendIconUrl({ svg_url, trend, trendTech, techIconUrl }) {
  const trendLower = trend?.toLowerCase() || '';
  const trendTechLower = trendTech?.toLowerCase() || '';

  // 1) If `svg_url` is valid, use it
  if (isValidUrl(svg_url)) {
    return svg_url;
  }

  // 2) If `trend` matches or includes `trendTech`, use `techIconUrl` if valid
  if (
    isValidUrl(techIconUrl) &&
    (trendLower === trendTechLower ||
      trendLower.includes(trendTechLower) ||
      trendTechLower.includes(trendLower))
  ) {
    return getFullIconUrl(techIconUrl);
  }

  // 3) Otherwise, fallback to `null` so we display the circle icon
  return null;
}

/**
 * CarouselSlider:
 * Renders a slider of `trends`, each with a link to its trend page
 * and logic for determining which icon (svg_url, techIconUrl, or fallback) to display.
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

  const currentTrend = trends[currentIndex];
  const iconUrl = getTrendIconUrl(currentTrend); // pick the correct icon

  return (
    <SliderContainer>
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="gradient" x1="100%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="var(--primary2-400)" />
            <stop offset="100%" stopColor="var(--primary-400)" />
          </linearGradient>
        </defs>
      </svg>
      <IoIosArrowBack onClick={prevSlide} className="arrow arrow-left" />
      <div className="slider">
        <Tooltip description={currentTrend.trend} xOffset={-35} yOffset={-90}>
          <Link to={getFullTrendUrl(currentTrend.slug)}>
            {iconUrl ? (
              <img
                src={iconUrl}
                alt={currentTrend.trend}
                className="trend-icon"
              />
            ) : (
              <BsCircleFill
                className="trend-icon"
                style={{
                  width: '50px',
                  height: '50px',
                  fill: 'url(#gradient)',
                }}
              />
            )}
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
    transition: transform 0.3s ease-in-out;
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
