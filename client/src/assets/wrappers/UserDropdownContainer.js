import styled from 'styled-components';

const Container = styled.div`
  position: relative;

  .user-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0 0.5rem;
    background: transparent;
    border: none;
    cursor: pointer;
  }

  .username {
    margin-right: 0.5rem;
  }

  .arrow-icon {
    transition: transform 0.3s ease;
  }

  .dropdown {
    position: absolute;
    top: 45px;
    right: 1px;
    box-shadow: var(--shadow-2);
    text-align: center;
    visibility: hidden;
    border-radius: 1rem;
    background: var(--primary-500);
  }

  .show-dropdown {
    visibility: visible;
  }

  .dropdown-btn {
    border-radius: var(--border-radius);
    padding: 0.5rem;
    background: transparent;
    border-color: transparent;
    color: var(--white);
    letter-spacing: var(--letter-spacing);
    text-transform: capitalize;
    cursor: pointer;
    width: 100%;
    height: 100%;
  }

  @media (max-width: 991px) {
    .username,
    .arrow-icon {
      display: none; /* Hide username and arrow icon on small screens */
    }

    .user-btn {
      justify-content: center; /* Center the image in the button */
    }
  }
`;

export default Container;
