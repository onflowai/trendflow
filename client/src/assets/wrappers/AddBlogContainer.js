import styled from 'styled-components';

const Container = styled.div`
  /* margin-bottom: 1rem;
  display: flex;
  flex-direction: column; */
.form-center {
    display: grid;
    grid-template-columns: 1fr; /* default to single column layout */
    row-gap: 1rem;
  }

  @media (min-width: 992px) {
    .form-center {
      grid-template-columns: 1fr 1fr; /* two columns on wider screens */
      align-items: start;
      column-gap: 1rem;
    }
  }
  .edit-markdown {
    grid-column: span 2; /* making the markdown editor take up two columns */
    width: 100%; /* take up all the available width */
  }

  .form-btn {
    grid-column: span 2; /* make the submit button take up two columns */
  }
`;
export default Container;
