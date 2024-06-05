import styled from 'styled-components';

const Container = styled.section`
  margin-top: 4rem;
  h2 {
    text-transform: none;
  }
  & > h5 {
    font-weight: 700;
    margin-bottom: 1.5rem;
  }
  .toggle-container {
    display: none;
    margin-bottom: 1rem;
  }
  .grid-view-btn{
    border: none;
    outline: none;
    font-size: 2rem;
    background: none;
  }

  .trends {
    display: grid;
    grid-template-columns: 1fr; // Default to 1 card per row
    row-gap: 2rem;
  }

  @media (max-width: 850px) { // Show button for screens 850px and smaller
    .toggle-container {
      display: block; // Show button
    }
    .trends {
      grid-template-columns: ${({ isGridView }) =>
        isGridView ? 'repeat(2, 1fr)' : '1fr'};
      gap: 1rem;
    }
  }

  @media (min-width: 851px) { // Larger screens
    .trends {
      grid-template-columns: repeat(2, 1fr); // Default to 2 cards per row for larger screens
      gap: 2rem;
    }
  }

  @media (min-width: 1300px) { // Large screens
    .trends {
      grid-template-columns: repeat(3, 1fr); // 3 cards in a row
      gap: 2rem;
    }
  }

  @media (min-width: 1740px) { // Extra large screens
    .trends {
      grid-template-columns: repeat(4, 1fr); // 4 cards in a row
      gap: 2rem;
    }
  }
`;

export default Container;
