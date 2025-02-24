import styled from 'styled-components';

const Container = styled.div`

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
    .user-bookmarked{
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.3rem 0.6rem;
      border-radius: var(--input-radius-rounded);
      background: var(--grey-50);
      color: var(--black);
      margin-top: 2rem;
      margin-bottom: 0.5rem;
    }
  }

  @media (min-width: 850px) { // Medium screens
    .trends {
      grid-template-columns: repeat(1, 1fr); // Keeps 2 cards for slightly larger screens
      gap: 2rem;
    }
    .user-bookmarked{
    display: none;
  }
  }

  @media (min-width: 1300px) { // Large screens
    .trends {
      grid-template-columns: repeat(2, 1fr); // 3 cards in a row
      gap: 2rem;
    }
    .user-bookmarked{
    display: none;
  }
  }

  @media (min-width: 1740px) { // Extra large screens
    .trends {
      grid-template-columns: repeat(3, 1fr); // 4 cards in a row
      gap: 2rem;
    }
    .user-bookmarked{
    display: none;
  }
  }
`;

export default Container;
