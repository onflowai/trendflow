import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { getFullIconUrl, getFullTrendUrl } from '../utils/urlHelper';

const TrendIconList = ({ trends }) => {
  return (
    <Container>
      {trends.map((trend, index) => (
        <Link
          key={index}
          to={getFullTrendUrl(trend.slug)}
          className="trend-link"
        >
          <div className="trend-item">
            <img
              src={getFullIconUrl(trend.svg_url)}
              alt={trend.trend}
              className="trend-icon"
            />
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
  align-items: center; /* Center the items horizontally */
  margin-top: 1rem; /* Add margin on top */

  .trend-link {
    text-decoration: none;
    color: var(--black);
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
  }

  .trend-item {
    display: flex;
    align-items: center;
    transition: transform 0.3s ease;
  }

  .trend-icon {
    width: 50px; /* Increase the size of the icons */
    height: 50px; /* Increase the size of the icons */
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
