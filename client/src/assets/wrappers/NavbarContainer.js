import styled from 'styled-components';

const Container = styled.nav`
  position: sticky;  // Apply sticky position universally
  top: 0;
  z-index: 10;
  height: var(--nav-height);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${(props) =>
    props.hasScrolled ? '0 1px 0 0 rgba(0, 0, 0, 0.1)' : 'none'};
  background: var(--background-color);

  .nav-center {
    display: flex;
    width: 95vw; /* Adjusted to match the Dashboard layout's width */
    align-items: center;
    justify-content: space-between;
  }

  .toggle-btn {
    background: transparent;
    border-color: transparent;
    font-size: 1.75rem;
    color: var(--primary-500);
    cursor: pointer;
    display: flex;
    align-items: center;
  }

  .arrow-btn {
    display: none;
  }

  .menu-btn {
    display: block;
  }

  .search-input,
  .dark-mode,
  .btn-container {
    display: flex;
    align-items: center;
  }

  .search-input {
    margin-left: auto; /* Pushes the search input to the right */
    position: relative;
    display: flex;
    align-items: center;
    transition: width 0.3s ease;
  }

  .dark-mode {
    margin-left: 1rem; /* Add space between search input and DarkMode */
  }

  .btn-container {
    margin-left: 1rem; /* Add space between DarkMode and UserDropdown */
  }

  @media (max-width: 991px) {
    .search-input {
      width: 35px; /* Initial width */
    }

    .search-input.expanded {
      width: 200px; /* Expanded width */
    }
  }

  @media (min-width: 992px) {
    .nav-center {
      width: 95%;
    }

    .arrow-btn {
      display: block;
    }

    .menu-btn {
      display: none;
    }

    .search-input {
      width: 35px; /* Initial width */
    }

    .search-input.expanded {
      width: 200px; /* Expanded width */
    }
  }
`;
export default Container;
