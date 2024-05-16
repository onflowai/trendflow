import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: var(--border-radius);
  border: 1.5px solid var(--grey-50);
  /* margin-top: 1rem; */
  position: relative;

  .header {
    margin-bottom: 1rem;
  }

  .email-section {
    /* display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem; */
  }
  .email-form {
  }

  //SETTINGS SECTION
 .settings-section {
    display: grid;
    grid-template-columns: repeat(3, 1fr); /* Three equal columns */
    gap: 1rem; /* Optional: Add some space between columns */
    margin-top: 1rem;
  }

  .settings-item {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .status,
  .privacy-switch,
  .actions {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .status-text,
  .privacy-text {
    font-size: var(--small-text);
    margin-bottom: 0.5rem;
  }

  .icon {
    margin-top: 0.5rem;
    cursor: pointer;
    font-size: 1.5rem; /* Adjust the size as needed */
  }
`;

export default Container;
