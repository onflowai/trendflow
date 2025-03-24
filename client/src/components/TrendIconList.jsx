import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { getFullIconUrl, getFullTrendUrl } from '../utils/urlHelper';
import { BsCircleFill } from 'react-icons/bs';

const TrendIconList = ({ trends }) => {
  return (
    <Container>
      {/* Hidden SVG definition for the gradient fill */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="gradient" x1="100%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="var(--primary2-300)" />
            <stop offset="100%" stopColor="var(--primary-300)" />
          </linearGradient>
        </defs>
      </svg>
      {trends.map((trend, index) => (
        <Link
          key={index}
          to={getFullTrendUrl(trend.slug)}
          className="trend-link"
        >
          <div className="trend-item">
            {trend.svg_url ? (
              <img
                src={trend.svg_url}
                alt={trend.trend}
                className="trend-icon"
              />
            ) : (
              <BsCircleFill
                className="trend-icon"
                style={{
                  fill: 'url(#gradient)',
                  width: '50px',
                  height: '50px',
                  marginRight: '1rem',
                }}
              />
            )}
            <div className="trend-title">{trend.trend}</div>
          </div>
        </Link>
      ))}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* Ensure the whole column aligns left */
  margin-top: 1rem;

  .trend-link {
    text-decoration: none;
    color: var(--black);
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
  }

  .trend-item {
    display: flex;
    align-items: center; /* Vertically align items */
    justify-content: flex-start; /* Align items to the left */
    transition: transform 0.3s ease;
  }

  .trend-icon {
    width: 50px;
    height: 50px;
    margin-right: 1rem;
    transition: transform 0.3s ease;
  }

  .trend-title {
    font-size: 1rem;
  }

  .trend-link:hover .trend-title {
    text-decoration: underline;
  }

  .trend-link:hover .trend-icon {
    transform: scale(1.1);
  }
`;

export default TrendIconList;
