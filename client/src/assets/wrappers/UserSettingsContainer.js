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
    display: grid;
    grid-template-columns: 1fr; /* Ensure single column layout */
    gap: 1rem; /* Add space between the components */
    margin-bottom: 1rem;
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
  //STATUS:
  .settings-item .status,
  .settings-item .privacy-switch,
  .settings-item .actions {
    display: flex;
    flex-direction: row; /* Arrange items in a row */
    align-items: center; /* Center items vertically */
    justify-content: center;
  }

.status-text {
  
}

.status-box {
  padding: 5px 10px;
  border-radius: 12px;
  display: inline-block;
}

.status-box.verified {
  background-color: var(--green-light);
  color: var(--green);
  border: 1px solid var( --green-light);
}

.status-box.not-verified {
  background-color: var(--grey-50);
  color: var(--red-dark);
  border: 1px solid var(--red);
}

  .status,
  .privacy-switch,
  .actions {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .status-text,
  .privacy-text,
  .actions-text {
    font-size: var(--small-text);
    margin-bottom: 0.5rem;
  }

  .icon {
    cursor: pointer;
    font-size: 1.5rem; /* Adjust the size as needed */
    display: flex;
    align-items: center;
  }
  //DROPDOWN
  .dropdown {
  transform: translate(-20%, -20%);
  z-index: 10;
  }
`;

export default Container;
