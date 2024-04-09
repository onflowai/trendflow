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
  .trends {
    display: grid;
    grid-template-columns: 1fr; // Default to 1 card per row for small screens
    row-gap: 2rem;
  }

  @media (min-width: 480px) { // Adjust for small screens
    .trends {
      grid-template-columns: repeat(1, 1fr); // 2 cards in a row
      gap: 1rem;
    }
  }

  @media (min-width: 850px) { // Medium screens
    .trends {
      grid-template-columns: repeat(2, 1fr); // Keeps 2 cards for slightly larger screens
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
