import styled from 'styled-components';

const Container = styled.section`
  border-radius: var(--border-radius); // set border radius
  background: var(--background-secondary-color); // set background color
  
  .page-layout {
    display: flex; // use flex layout
    flex-direction: column; // stack children vertically
    width: 100%; // full width
    max-width: 100%; // limit width to 100%
    overflow-x: hidden; // prevents horizontal overflow
  }

  .trend {
    padding: 2rem; // add padding
    width: 100%; // full width
    max-width: 100%; // limit width to 100%
    margin-bottom: 2rem; // margin below each trend
  }

  .scroll-spy-sidebar {
    background: inherit; // inherit background color
    z-index: 10; // higher stack order
    width: 250px; // fixed width
    overflow-y: auto; // allows vertical scrolling
    transition: transform 0.3s ease; // smooth transform transition
  }

    .trend {
      width: calc(100% - 25px); // reduce width to fit sidebar
    }
  }

  @media (min-width: 992px) {
    .page-layout {
      display: grid; // switch to grid layout
      grid-template-columns: 4fr 1fr; // proportion between main content and sidebar
      /* grid-template-rows: 1000px 100%; */
    }
  }
  @media (max-width: 991px) {
    .page-layout {
    display: flex;
    flex-direction: column; // Reiterate to ensure stacking
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
    .trend {
      padding-top: 120px; // padding to offset sidebar overlay
    }
    .related-trend {
      order: 3; // Moves to the bottom under the .trend content
      width: 100%; // Takes full width
      position: relative; // Adjusts position in the normal flow
    }
`;

export default Container;
