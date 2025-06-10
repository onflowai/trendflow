import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getFullIconUrl, getFullTrendUrl } from '../utils/urlHelper';
import { BsCircleFill } from 'react-icons/bs';

const isValidUrl = (url) =>
  url && url !== 'undefined' && url !== 'null' && url.trim() !== '';

function getTrendIconUrl({ svg_url, trend, trendTech, techIconUrl }) {
  // 1) svg_url
  if (isValidUrl(svg_url)) {
    return svg_url;
  }

  // 2) If the trend name matches or includes trendTech
  const trendLower = trend?.toLowerCase() || '';
  const trendTechLower = trendTech?.toLowerCase() || '';
  if (
    isValidUrl(techIconUrl) &&
    (trendLower === trendTechLower ||
      trendLower.includes(trendTechLower) ||
      trendTechLower.includes(trendLower))
  ) {
    return getFullIconUrl(techIconUrl);
  }

  // 3) Fallback (null => gradient circle)
  return null;
}

const TrendIconList = ({ trends, guestUser }) => {
  const navigate = useNavigate();
  const trendsArray = Array.isArray(trends) ? trends : [];

  // Intercept guest user clicks
  const handleGuestClick = async (slug) => {
    if (typeof guestUser === 'function') {
      const result = await guestUser();
      if (result) {
        navigate(`/dashboard/trend/${slug}`);
      }
    }
  };

  return (
    <Container>
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="gradient" x1="100%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="var(--primary2-300)" />
            <stop offset="100%" stopColor="var(--primary-300)" />
          </linearGradient>
        </defs>
      </svg>
      {trendsArray.map((trendItem, index) => {
        const iconUrl = getTrendIconUrl(trendItem);

        return guestUser ? (
          <button
            key={index}
            className="trend-link"
            onClick={() => handleGuestClick(trendItem.slug)}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              margin: 0,
              cursor: 'pointer',
              width: '100%',
              textAlign: 'left',
            }}
            aria-label={`Sign in as guest and view ${trendItem.trend}`}
            type="button"
          >
            <div className="trend-item">
              {iconUrl ? (
                <img
                  src={iconUrl}
                  alt={trendItem.trend}
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
              <div className="trend-title">{trendItem.trend}</div>
            </div>
          </button>
        ) : (
          <Link
            key={index}
            to={getFullTrendUrl(trendItem.slug)}
            className="trend-link"
          >
            <div className="trend-item">
              {iconUrl ? (
                <img
                  src={iconUrl}
                  alt={trendItem.trend}
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
              <div className="trend-title">{trendItem.trend}</div>
            </div>
          </Link>
        );
      })}
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
