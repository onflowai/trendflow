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
            <img src={trend.svg_url} alt={trend.trend} className="trend-icon" />
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
