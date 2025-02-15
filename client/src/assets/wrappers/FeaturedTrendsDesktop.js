// FeaturedTrendsDesktop styled-component
import styled from 'styled-components';

const Container = styled.section`
  margin-top: 1rem;

  h2 {
    text-transform: none;
    text-align: center;
    margin-bottom: 2rem;
  }

  .featured-trends-desktop {
    display: grid;
    grid-template-columns: 1fr; // default 1 card per row
    row-gap: 2rem;
    column-gap: 1rem;
  }

  @media (max-width: 850px) {
    .featured-trends-desktop {
      grid-template-columns: repeat(2, 1fr); // 2 cards per row on small screens
      gap: 2rem;
    }
  }

  @media (min-width: 851px) and (max-width: 1299px) {
    .featured-trends-desktop {
      grid-template-columns: repeat(3, 1fr); // 3 cards per row on medium screens
      gap: 1rem;
    }
  }

  @media (min-width: 1300px) and (max-width: 1739px) {
    .featured-trends-desktop {
      grid-template-columns: repeat(4, 1fr); // 4 cards per row on large screens
      gap: 1rem;
    }
  }

  @media (min-width: 1740px) {
    .featured-trends-desktop {
      grid-template-columns: repeat(4, minmax(0, 1fr)); // maintaining 4 cards per row on extra-large screens
      gap: 1rem;
    }
  }

  .trend-small-card {
    border-radius: var(--border-radius);
    transition: transform 0.1s ease;
    height: 150px;
  }

  .trend-desc {
    margin-top: 0rem;
  }

  .trend-desc:empty {
    display: none;
  }

  .trend-title h4 {
    top: 25px;
    z-index: 0;
  }

  .trend-title h6 {
    top: 50px;
    z-index: 0;
  }

  .bottom-row {
    border-bottom-left-radius: var(--border-radius);
    border-bottom-right-radius: var(--border-radius);
  }
`;

export default Container;
