import styled from 'styled-components';

const Container = styled.section`
  border-radius: var(--border-radius); // set border radius
  background: var(--background-secondary-color); // set background color
  
  .page-layout {
    display: flex; // use flex layout
    flex-direction: column; // stack children vertically
    width: 100%; // full width
    max-width: 100%; // limit width to 100%
    overflow-x: clip; // prevents horizontal overflow
  }

  .trend {
    padding: 1rem 4rem 4rem; // add padding
    width: 100%; // full width
    max-width: 900px; // Limit max width to 800px
    margin: 0 auto 2rem auto; // Center the trend container
  }

  .scroll-spy-sidebar {
    background: inherit; // inherit background color
    z-index: 1; // higher stack order
    width: 250px; // fixed width
    overflow-y: auto; // allows vertical scrolling
    transition: transform 0.3s ease; // smooth transform transition
    right: 0;
    top: var(--nav-height);
    height: 100vh; // Full height
    overflow-y: auto; // Allows scrolling
  }

    .trend {
      width: calc(100% - 25px); // reduce width to fit sidebar
    }
  }
  //Styling for desktops
  @media (min-width: 992px) {
    .page-layout {
      display: grid; // switch to grid layout
      grid-template-columns: 4fr 1fr; // proportion between main content and sidebar
      /* grid-template-rows: 1000px 100%; */
    }
    .scroll-spy-sidebar-aside {
    padding-top: 1rem;
    position: -webkit-sticky; // Make sidebar sticky
    top: var(--nav-height); // Start below the navbar, use a CSS variable or specific value
    position: sticky;
    right: 0;
    width: 250px; // fixed width
    height: calc(100vh - var(--nav-height)); // Full height minus the navbar height
    /* overflow-x: auto; // allows vertical scrolling */
    z-index: 3; // ensure it is stacked properly
  }
    .scroll-spy-sidebar {
    position: sticky; // Maintain sticky positioning
    top: var(--nav-height); // Start below the navbar, adjust this value accordingly
    height: calc(100vh - var(--nav-height)); // Adjust height to account for navbar
    overflow-y: auto; // Allows scrolling within the sidebar
    }
  }
  //Styling for Mobile
  @media (max-width: 991px) {
    .page-layout {
    display: flex;
    flex-direction: column; // Reiterate to ensure stacking

    .trend {
      padding: 7.5rem 0rem 0rem;
      max-width: 100%; // padding to offset sidebar overlay
    }
  }

  .scroll-spy-sidebar {
  position: fixed; // fixed position for sidebar
    width: 100%; // sidebar takes full width
    height: 200px; // fixed height for sidebar
    top: 0; // align to top
    right: 0; // align to right
    transform: translateY(0); // ensure visibility
    order: 1; // Ensures this content is placed at the top
  }
  .related-trend {
    order: 3; // Moves to the bottom under the .trend content
    width: 100%; // Takes full width
    position: relative; // Adjusts position in the normal flow
  }
`;

export default Container;
