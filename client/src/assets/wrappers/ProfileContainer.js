import styled from 'styled-components';

const Container = styled.main`
  position: relative;

  .form-and-trends-container {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }

  .user {
    width: 29px;
    height: 29px;
  }

  .user-image {
    position: relative;
    display: flex;
    gap: 0 0.5rem;
    background: transparent;
    border: none;
  }

  .edit-button-wrapper {
    position: absolute;
    bottom: 0;
    margin-left: 4rem;
  }

  .edit-button {
    background: var(--grey-400);
    color: white;
    border: none;
    border-radius: var(--border-radius);
    padding: 0.5rem 1rem;
    cursor: pointer;
    font-size: 0.75rem;
    z-index: 10;

    &:hover {
      background: var(--grey-50);
    }
  }

  .dropdown {
    position: absolute;
    top: 0px;
    right: -40px;
    background: white;
    border: 1px solid var(--grey-50);
    border-radius: var(--border-radius);
    padding: 0.5rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 10;

    .dropdown-option {
      display: block;
      width: 100%;
      padding: 0.25rem 0.75rem;
      background: transparent;
      border: none;
      cursor: pointer;
      color: var(--text-color);
      text-align: left;
      border-radius: var(--border-radius);

      &:hover {
        background: var(--grey-50);
      }

      &:active {
        background: var(--primary2-400);
      }
    }

    input {
      display: none;
    }

    button {
      color: var(--red-dark);

      &:hover {
        background: var(--primary2-400);
      }

      &:active {
        background: var(--grey-200);
      }
    }
  }

  .user-form-container {
    flex: 1;
    background: var(--white);
    border-radius: var(--border-radius);
    border-top-left-radius: calc(var(--border-radius) * 8);
    border: 1.5px solid var(--grey-50);
    padding: 1rem 1rem;
    margin: 1rem auto;
  }

  .form-user {
    flex: 2;
    background: var(--white);
    border-radius: var(--border-radius);
    border: 1.5px solid var(--grey-50);
    padding: 1rem 1rem;
    margin-top: 1rem;
    min-height: 300px;
    max-height: 500px;
  }

  .form-user-settings {
    flex: 2;
    background: var(--grey-50);
    border-radius: var(--border-radius);
    border: 1.5px solid var(--grey-50);
    padding: 1rem 1rem;
    margin-top: 1rem;
    width: 100%; 
  }
  .input-wrapper {
  width: 100%; /* Ensure the input wrapper spans the full width */
  display: flex;
  align-items: center;
  }

  .form-input-btn {
    flex: 1;
    width: 100%; /* Ensure the input spans the full width */
  }

  .form-label-user {
    display: block;
    font-size: var(--small-text);
    margin-bottom: 0.75rem;
    text-transform: capitalize;
    letter-spacing: var(--letter-spacing);
    line-height: 1.5;
  }

  .form-input,
  .form-textarea,
  .form-select {
    width: 100%;
    padding: 0.375rem 0.75rem;
    border-radius: var(--input-radius-rounded);
    background: var(--background-color);
    border: 1px solid var(--grey-50);
    color: var(--text-color);
  }

  .form-input,
  .form-select,
  .form-btn {
    height: 35px;
  }

  .form-row {
    margin-bottom: 1rem;
  }

  .form-textarea {
    height: 7rem;
  }

  ::placeholder {
    font-family: inherit;
    color: var(--grey-400);
  }

  .form-alert {
    color: var(--red-dark);
    letter-spacing: var(--letter-spacing);
    text-transform: capitalize;
  }

  .trends-container {
    flex: 5;
    max-width: 75%;
    background: var(--white);
    border-radius: var(--border-radius);
    border: 1.5px solid var(--grey-50);
    padding: 1rem 1rem;
    margin: 1rem;
  }

  @media (max-width: 868px) {
    .form-and-trends-container {
      flex-direction: column;
    }

    .form-user,
    .trends-container {
      flex: 1 1 100%;
      max-width: 100%;
    }
    
    .trends-container {
      background: none;
      border: none;
      padding: 0;
      margin: 0;
      max-width: none;
    }
  }

  @media (min-width: 869px) {
    .form-user {
      flex-basis: 400px;
      min-width: 350px; /* This is only applied on larger screens */
      max-width: 500px;
    }
  }
`;

export default Container;
