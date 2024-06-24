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

  .submit-container {
    width: 100%;
    max-width: 1200px; /* Max width for large screens */
  }

  .filter-app {
    display: grid;
    gap: 20px; /* Space between grid items */

    @media (min-width: 1024px) {
      grid-template-columns: repeat(7, 1fr); /* 7 equal columns for large screens */
    }

    @media (min-width: 812px) and (max-width: 1023px) {
      grid-template-columns: repeat(10, 1fr); /* 10 equal columns for medium screens */
    }

    @media (max-width: 811px) {
      grid-template-columns: 1fr; /* Single column for small screens */
    }
  }

  .filter-header {
    grid-column: span 7; /* Header spans across all columns on large screens */
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
  }

  .filter-icons .icon {
    margin-left: 10px;
    cursor: pointer; /* Pointer cursor for clickable icons */
  }

  .checkbox-group {
    display: contents; /* Grid children will be directly in the grid */

    .checkbox {
      grid-column: span 1; /* Each checkbox takes 1 column on large screens */
      
      @media (min-width: 812px) and (max-width: 1023px) {
        grid-column: span 1; /* Each checkbox takes 1 column on medium screens */
      }
      
      @media (max-width: 811px) {
        grid-column: span 1; /* Each checkbox takes full width on small screens */
      }
    }
  }

  .select-group-one, .select-group-two {
    display: contents; /* Grid children will be directly in the grid */

    .select {
      grid-column: span 2; /* Each select takes 2 columns on large screens */

      @media (min-width: 812px) and (max-width: 1023px) {
        grid-column: span 1; /* Each select takes 1 column on medium screens */
      }
      
      @media (max-width: 811px) {
        grid-column: span 1; /* Each select takes full width on small screens */
      }
    }
  }

  .btn {
    grid-column: span 7; /* Button spans across all columns on large screens */
    margin-top: 20px;
    align-self: center;
    
    @media (min-width: 812px) and (max-width: 1023px) {
      grid-column: span 10; /* Button spans across all columns on medium screens */
    }

    @media (max-width: 811px) {
      grid-column: span 1; /* Button takes full width on small screens */
    }
  }

`;

export default Container;
