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

    .trend-use-container {
      width: 100%; // ensure the container takes full width
    }
  }
  .trend-items{
    padding: 0rem 2rem; 
  }
    
  .trend {
    padding: 1rem 4rem 4rem; // add padding
    width: 100%; // full width
    max-width: 900px; // Limit max width to 800px
    margin: 0 auto 2rem auto; // Center the trend container
  }

  .trend-use-container {
  width: 100%; // ensure the container takes full width
  box-sizing: border-box; // ensure the padding is included in the width

  @media (max-width: 991px) {
    padding: 0; // remove outer padding on small screens
    width: 100%; // make container full width
    box-sizing: border-box; // include padding and border in the element's total width
  }
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

  @media (min-width: 992px) {
    .page-layout {
      display: grid; // switch to grid layout
      grid-template-columns: 4fr 1fr; // proportion between main content and sidebar
    }
    
    .scroll-spy-sidebar-aside {
      padding-top: 1rem;
      position: -webkit-sticky; // Make sidebar sticky
      top: var(--nav-height); // Start below the navbar
      position: sticky;
      right: 0;
      width: 250px; // fixed width
      height: calc(100vh - var(--nav-height)); // Full height minus the navbar height
      z-index: 3; // ensure it is stacked properly
    }
    
    .scroll-spy-sidebar {
      position: sticky; // Maintain sticky positioning
      top: var(--nav-height); // Start below the navbar
      height: calc(100vh - var(--nav-height)); // Adjust height to account for navbar
      overflow-y: auto; // Allows scrolling within the sidebar
    }
  }

  @media (max-width: 991px) {
    .trend-page-layout {
      display: flex;
      flex-direction: column; // Reiterate to ensure stacking
    }
    .page-layout {
      display: flex;
      flex-direction: column; // Reiterate to ensure stacking
    }

    .trend {
      padding: 7.5rem 0rem 0rem;
      max-width: 100%; // padding to offset sidebar overlay
    }

    .trend-items{
      padding: 0rem 0rem; 
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
    .dashboard-page {
      width: 100vw; // full width on small screens
      padding: 0; // remove padding on small screens
      margin: 0; // remove margin on small screens
    }
  }
`;

export default Container;
