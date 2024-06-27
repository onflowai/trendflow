import styled from 'styled-components';

const Container = styled.div`
  border-radius: var(--border-radius);
  border: 1.5px solid var(--grey-50);
  background: var(--white);
  padding: 2rem 2rem 4rem;

  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
  width: 100%;

  .submit-container {
    width: 100%;
    max-width: 1200px; /* Max width for large screens */
    display: flex;
    justify-content: center;
  }

  .filter-app {
    display: grid;
    gap: 20px;
    width: 100%;
    position: relative;

    @media (min-width: 1024px) {
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: auto;
      gap: 20px 40px;
    }

    @media (min-width: 812px) and (max-width: 1023px) {
      grid-template-columns: repeat(4, 1fr);
      grid-template-rows: auto;
      gap: 20px;
    }

    @media (max-width: 811px) {
      grid-template-columns: 1fr;
    }
  }

  .action-buttons {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 10px;
  }

  .buttons {
    display: flex;
    gap: 10px;
  }

  .checkbox-group {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;

    @media (max-width: 1023px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 811px) {
      grid-template-columns: 1fr;
    }
  }

  .select-group {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;

    @media (max-width: 1023px) {
      grid-template-columns: 1fr;
    }
  }

  .btn {
    grid-column: span 6;
    margin-top: 20px;
    align-self: center;

    @media (max-width: 1023px) {
      grid-column: span 4;
    }

    @media (max-width: 811px) {
      grid-column: span 1;
    }
  }

`;

export default Container;
