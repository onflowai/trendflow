import styled from 'styled-components';

const Container = styled.div`
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  overflow: hidden;

  .form-btn{
        margin-top: 0.1rem;
  }

  .header {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start; /* Ensure children align correctly */
    padding: 1rem;
    height: auto; /* Adjust height to content */
    min-height: 15rem; /* Ensure consistent minimum height */
    color: white;
    border-radius: 8px;
    box-shadow: 0 0 1px rgba(0, 0, 0, 0.1);
    margin-bottom: 1rem;
    position: relative;
    font-size: 2rem;
    font-weight: bold;
    word-wrap: break-word; /* Ensure long words wrap */
  }

  .header > * {
    flex-shrink: 0; /* Prevent shrinking of children */
  }

  .delete-container {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }

  .delete-icon {
    font-size: 44px;
    color: var(--red);
    cursor: pointer;
  }

  .delete-icon:hover {
    color: var(--red-dark);
  }

  .form-center {
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    grid-template-columns: 1fr;
  }
  .title-input-wrap {
    flex-grow: 1;
    padding-left: 0.5rem;
  }

  .form-controls {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: center;
    width: 100%;
    box-sizing: border-box;
    margin-bottom: 1rem;
  }

  .user-title-wrap {
    display: flex;
    align-items: center;
    box-sizing: border-box;
  }

  .user-img-small {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 0.5rem;
    flex-shrink: 0;
  }

  @media (min-width: 992px) {
    .form-controls {
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
    }

    .form-controls > *:not(.submit-btn-container) {
      flex: 1 1 auto;
    }

    .submit-btn-container {
      flex: 0 0 auto;
    }

    /* .privacy-container > *:not(.privacy-container) {
      flex: 1 1 auto;
    } */

    .privacy-container{
      flex: 0 0 auto;
    }

    .form-btn {
      width: 100px;
      font-size: 0.9rem;
      padding: 0.3rem;
    }
  }

  @media (max-width: 991px) {
    .form-controls {
      flex-direction: column;
      align-items: stretch;
    }

    .user-title-wrap {
      width: 100%;
    }

    .form-controls > :nth-child(2) {
      width: 100%;
    }

    .submit-btn-container .form-btn {
      width: 100%;
    }
  }

  .edit-markdown {
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    overflow-x: auto;
    display: block;
  }
`;

export default Container;
