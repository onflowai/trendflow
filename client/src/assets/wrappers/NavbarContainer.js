import styled from 'styled-components';

const Container = styled.nav`
 position: sticky;  // Apply sticky position universally
  top: 0;
  height: var(--nav-height);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${(props) =>
    props.hasScrolled ? '0 1px 0 0 rgba(0, 0, 0, 0.1)' : 'none'};
  background: var(--background-color);
  .nav-center {
    display: flex;
    width: 90vw;
    align-items: center;
    justify-content: space-between;
  }
  .navbar-link {
    display: flex; // Align links in a row
    align-items: right;
     margin-left: auto;
  }
  .nav-links {
    margin: 0 0.5rem;
    color: var(--text-second-color);
    text-decoration: none;
    text-transform: capitalize;
    letter-spacing: var(--spacing);
    transition: var(--transition);
    cursor: pointer;
    font-size: 0.9rem;
    &:hover {
      color: var(--clr-primary-5); // Change color on hover
    }
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
  .logo-text {
    display: none;
  }
  .logo {
    display: flex;
    align-items: center;
  }
  .btn-container {
    display: flex;
    align-items: center;
  }
  .arrow-btn {
    display: none;
  }
  .menu-btn {
    display: block;
    display: flex;
    align-items: center;
  }
  @media (min-width: 992px) {
    position: sticky;
    top: 0;
    .nav-center {
      width: 90%;
    }
    .logo {
      /* display: none; */
    }
    .logo-text {
      display: block;
    }
    .arrow-btn {
    display: block;
    display: flex;
    align-items: center;
    }
    .menu-btn {
      display: none;
    }
  }
`;
export default Container;
