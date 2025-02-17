import styled from 'styled-components';

const Container = styled.section`
  border-radius: var(--border-radius);
  border: 1.5px solid var(--grey-50);
  width: 100%;
  background: var(--white);
  padding: 2rem 2rem 4rem;

.clearfix::after {
  content: "";
  display: table;
  clear: both;
}
.user-container {
  float:left;
}
.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* Align user-info to the left */
  width: auto; /* Auto width to fit content */
  margin-bottom: 1rem; /* Adds space below user-info */
}

.user-profile {
  display: flex; /* Add flex display to center content inside */
  justify-content: center; /* Center content horizontally */
  width: 100%; /* Full width within its block */
}

.username {
  text-align: center; /* Ensure the text is centered */
  align-self: center; /* Center the username within its parent */
  width: 100%; /* Full width to help center the text */
  margin-top: 1rem; /* Optional: adds some space between the profile and username */
}
  .submit-container {
    clear: both;
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
    margin-top: 0rem;
    display: grid;
    align-items: center;
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

  @media (max-width: 768px) {
    padding: 1rem 1rem 2rem;

    .form {
      padding: 1rem
    }
    .submit-container {
      gap: 1rem; // Gap between rows or columns
    }
  }

  @media (max-width: 768px) {
    /* width: 4rem;
    height: 4rem; */
  }
  svg {
    width: 2rem;
    height: 2rem;
  }

`;

export default Container;
