import styled from 'styled-components';

const Container = styled.section`
  border-radius: var(--border-radius);
  border: 1.5px solid var(--grey-50);
  width: 100%;
  background: var(--white);
  padding: 3rem 2rem 4rem;
  .user-info {
    text-align: left; // Ensures the user info aligns to the left
  }
   .submit-container {
    display: grid; // Use grid to manage layout
    grid-template-columns: 1fr; // Default to single column layout
    gap: 2rem; // Gap between rows or columns
    
    @media (min-width: 1120px) { // Adjust this breakpoint as needed
      grid-template-columns: 2fr 1fr; // Creates a two-column layout on larger screens
    }
  }
  .form-title {
    margin-bottom: 2rem;
  }
  
  .form {
    background: var(--white);
    border: 1.5px solid var(--grey-50);
    margin: 0;
    max-width: 100%;
    width: 100%;
  }
  
  .form-center {
    display: grid;
    row-gap: 1rem;
    @media (min-width: 992px) {
      grid-template-columns: 1fr 1fr; // Two columns on wider screens
      align-items: center;
      column-gap: 1rem;
    }
    @media (min-width: 1120px) {
      grid-template-columns: 1fr 1fr; // Three columns on the widest screens
    }
  }
  
  .form-btn {
    align-self: end;
    margin-top: 1rem;
    display: grid;
    place-items: center;
  }
  
  .delete-btn {
    height: 30px;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
  }
  
  .info-btn {
    margin-right: 0.5rem;
  }

  .chart-container {
    border: 1.5px solid var(--grey-50);
    background: var(--white);
    border-radius: var(--border-radius);
  }

`;

export default Container;
