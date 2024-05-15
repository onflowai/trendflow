import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: var(--border-radius);
  border: 1.5px solid var(--grey-50);
  padding: 1rem;
  margin-top: 1rem;
  position: relative;

  .header {
    margin-bottom: 1rem;
  }

  .email-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
  }

  .email-form {
    flex: 1;
    margin-right: 1rem;
  }

  .update-button {
    background: var(--grey-400);
    color: white;
    border: none;
    border-radius: var(--border-radius);
    padding: 0.5rem 1rem;
    cursor: pointer;
    font-size: 0.75rem;
    &:hover {
      background: var(--grey-50);
    }
  }

  .settings-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 1rem;
  }

  .status {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 1rem;
  }

  .status-text {
    font-size: var(--small-text);
    margin-bottom: 0.5rem;
  }

  .privacy-switch {
    display: flex;
    align-items: center;
    margin-right: 1rem;
  }

  .privacy-text {
    font-size: var(--small-text);
    margin-right: 0.5rem;
  }

  .actions {
    display: flex;
    align-items: center;
  }

  .icon {
    margin-left: 0.5rem;
    cursor: pointer;
    font-size: 1.5rem; /* Adjust the size as needed */
  }
`;

export default Container;
