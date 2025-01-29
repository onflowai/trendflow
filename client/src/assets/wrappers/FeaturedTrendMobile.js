import styled from 'styled-components';

const Container = styled.section`
  margin-top: 1rem;

  h2 {
    text-transform: none;
    text-align: center;
    margin-bottom: 2rem;
  }

  .featured-trends-mobile {
    display: grid;
    grid-template-columns: ${({ isGridView }) =>
      isGridView ? 'repeat(2, 1fr)' : '1fr'};
    gap: 1rem;
    padding: 10px 0px;
  }

  .trend-small-card {
    border-radius: var(--border-radius);
    transition: transform 0.1s ease;
    height: 100%; /* Ensure each trend has the same height */
  }

  .toggle-container, .toggle-container-large {
    display: none;
    margin-bottom: 0rem;
    margin-left: 0rem;
  }

  .view-btn, .grid-view-btn {
    color: var(--grey-400);
    border: none;
    outline: none;
    font-size: 1.8rem;
    background: none;
    margin: 0.1rem; // Add space between buttons
    cursor: pointer;
  }
  .view-btn:hover {
    color: var(--primary-200);
  }

  .view-btn.active, .grid-view-btn.active {
    color: var(--primary-400); // Highlight the active button
  }

  .featured-toggle-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding: 0 0px;
  }

  @media (max-width: 850px) {
    .toggle-container {
      display: flex; /* Show toggle container for small screens */
      justify-content: left; /* Align buttons to the left */
    }

    .featured-trends-mobile {
      grid-template-columns: ${({ isGridView }) =>
        isGridView ? 'repeat(2, 1fr)' : '1fr'}; /* Toggle grid/list view */
      gap: 1rem;
    }
  }

  @media (min-width: 851px) {
    .toggle-container-large {
      display: block; /* Show toggle button for large screens */
    }

    .featured-trends-mobile {
      grid-template-columns: ${({ isGridView }) =>
        isGridView ? 'repeat(2, 1fr)' : '1fr'}; /* Adjust based on grid view */
      gap: 2rem;
    }
  }

  @media (min-width: 1300px) {
    .featured-trends-mobile {
      grid-template-columns: ${({ isGridView }) =>
        isGridView
          ? 'repeat(3, 1fr)'
          : '1fr'}; /* 3 cards per row when grid view is active */
      gap: 2rem;
    }
  }

  @media (min-width: 1740px) {
    .featured-trends-mobile {
      grid-template-columns: ${({ isGridView }) =>
        isGridView
          ? 'repeat(4, 1fr)'
          : '1fr'}; /* 4 cards per row when grid view is active */
      gap: 2rem;
    }
  }
`;

export default Container;
