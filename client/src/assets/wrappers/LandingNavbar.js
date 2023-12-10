import styled from 'styled-components';

const Container = styled.section`
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: var(--white);
  box-shadow: ${(props) =>
    props.hasScrolled ? '0 1px 0 0 rgba(0, 0, 0, 0.1)' : 'none'};
  background: var(--background-color);
  z-index: 2;
  height: var(--nav-height);
  display: flex;
  align-items: center;
}
.nav-icons {
  display: none;
}
.nav-center {
  width: 90vw;
  max-width: 1170px;
  margin: 0 auto;
}
.nav-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.nav-toggle {
  background: transparent;
  border: none;
  outline: none;
  font-size: 1.5rem;
  color: var(--primary-500);
  cursor: pointer;
  transition: var(--transition);
}
.nav-toggle:hover {
  transform: scale(1.2);
}
.nav-link {
  display: block;
  padding: 1rem 2rem;
  text-transform: capitalize;
  letter-spacing: var(--spacing);
  transition: var(--transition);
  color: var(--grey-600);
  cursor: pointer;
  font-size: 0.9rem;
}
.nav-link:hover {
  color: var(--primary-100);
  background: var(--primary-600);
  padding-left: 2.25rem;
}
/* nav toggle functionality */
.nav-links {
  height: 0;
  overflow: hidden;
  transition: var(--transition);
}
.show-links {
  height: 280px;
}
.vertical-line {
  display: none; /* Hide the line on smaller screens */
}

/* nav at bigger screen size */
@media screen and (min-width: 992px) {
  /* hide nav toggle button */
  .vertical-line {
    display: inline-block; /* Make it an inline-block so you can set width and height */
    height: 25px; /* The height of your line */
    width: 1.5px; /* The width of your line */
    background-color: var(--grey-70); /* The color of your line */
    margin: 0 15px; /* Add some margin to separate the line from adjacent content */
    vertical-align: middle; /* This will vertically center the line with adjacent icons/text */
  }
  .nav-toggle {
    display: none;
  }
  /* show links */
  .nav-links {
    height: auto;
    display: flex;
  }
  .nav-center {
    display: flex;
    justify-content: space-between;
    align-items: center;
    /* optional */
    flex-wrap: wrap;
  }
  .nav-header {
    padding: 0 0;
  }
  .nav-link {
    padding: 0 0;
  }
  .nav-link:hover {
    padding: 0;
    color: var(--primary-600);
    background: transparent;
  }
  .nav-icons {
    display: flex;
  }
  .nav-link {
    margin-right: 0.7rem;
  }
  .nav-icon {
    margin-right: 0.7rem;
    color: var(--grey-500);
    font-size: 1.2rem;
    transition: var(--transition);
  }
  .nav-icon:hover {
    color: var(--grey-800);
  }
  .nav-header {
    flex-grow: 1; /* Allows the logo container to grow and push other elements to the sides */
  }
  .nav-links {
    display: flex; /* Displays links in a row */
    justify-content: flex-start; /* Aligns links to the start */
  }
  .nav-icons {
    display: flex; /* Displays social icons in a row */
    justify-content: flex-end; /* Aligns social icons to the end */
    margin-left: auto; /* Pushes social icons to the right */
  }
}

`;
export default Container;
