import styled from 'styled-components';

const Container = styled.article`
  
  header {
    padding: 0rem;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
  }
  .info {
    h5 {
      margin-bottom: 0.5rem;
    }
    p {
      margin: 0;
      text-transform: capitalize;
      letter-spacing: var(--letter-spacing);
      color: var(--text-secondary-color);
    }
  }
  .content {
    padding: 1rem 1.5rem;
  }
  .content-center {
    display: flex;
    flex-direction: column;
    margin-top: 0.1;
    margin-bottom: 1.5rem;
    row-gap: 1rem; // Adjusted to manage space between rows
  }
  .info-section {
    display: flex;
    align-items: center;
    .icon {
      font-size: 1rem;
      margin-right: 1rem;
      display: flex;
      align-items: center;
    }
    .text {
      text-transform: capitalize;
      letter-spacing: var(--letter-spacing);
      margin-bottom: 0;
    }
  }
  .actions {
    margin-top: 1rem;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.5rem; // Provides spacing between buttons when wrapped
  }
  .info-btn,
  .delete-btn {
    height: 30px;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
  }
  .info-btn {
    margin-right: 0.5rem;
  }
  .loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--white-overlay); /* white with low opacity */
  display: flex;
  justify-content: center;
  align-items: center;
 /* Make sure it covers all other content inside the container */
  }
  .overlay{

  }
`;

export default Container;
