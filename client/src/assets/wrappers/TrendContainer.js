import styled from 'styled-components';

const Container = styled.article`
  background: var(--background-secondary-color);
  border-radius: var(--border-radius);
  display: grid;
  grid-template-rows: 1fr auto;
  box-shadow: var(--shadow-2);
  header {
    padding: 1rem 1.5rem;
    display: grid;
    grid-template-columns: auto 1fr;
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
    margin-top: 1rem;
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
`;

export default Container;
