import styled from 'styled-components';

const Container = styled.div`
  margin-top: 1rem;
  .related-trends-mobile {
    display: flex;
    flex-direction: column; /* ensuring the trends stack vertically */
    gap: 1rem;
    padding: 10px 15px;
  }

  .trend-small-card {
    border-radius: var(--border-radius);
    transition: transform 0.1s ease;
    height: 100%; /* Ensure each trend has the same height */
  }

  h2 {
    text-transform: none;
  }

  & > h5 {
    font-weight: 700;
    margin-bottom: 1.5rem;
  }

  .toggle-container, .toggle-container-large {
    display: none;
    margin-bottom: 0.6rem;
    margin-left: 1rem;
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

  .view-btn.active, .grid-view-btn.active {
    color: var(--grey-100); // Highlight the active button
  }

  .trends {
    display: grid;
    grid-template-columns: 1fr; // Default to 1 card per row
    row-gap: 2rem;
  }

  @media (max-width: 850px) {
    .toggle-container {
      display: flex; // Show toggle container for small screens
      justify-content: left; // Align buttons to the left
    }

    .related-trends-mobile {
      grid-template-columns: ${({ isGridView }) =>
        isGridView ? 'repeat(2, 1fr)' : '1fr'}; /* Toggle grid/list view */
      gap: 1rem;
    }
  }

  @media (min-width: 851px) {
    .toggle-container-large {
      display: block; // Show toggle button for large screens
    }

    .related-trends-mobile {
      grid-template-columns: repeat(2, 1fr); // 2 cards per row by default
      gap: 2rem;
    }
  }

  @media (min-width: 1300px) {
    .related-trends-mobile {
      grid-template-columns: repeat(3, 1fr); // 3 cards per row on larger screens
      gap: 2rem;
    }
  }

  @media (min-width: 1740px) {
    .related-trends-mobile {
      grid-template-columns: repeat(4, 1fr); // 4 cards per row on extra-large screens
      gap: 2rem;
    }
  }
`;

export default Container;
