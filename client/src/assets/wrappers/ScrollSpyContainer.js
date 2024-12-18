import styled from 'styled-components';

const Container = styled.section`



  // Styling for Desktop
  @media (min-width: 992px) {
    .spy-scroll-section {
      padding-top: 1.5rem;
      // Desktop specific styles here if needed
    }
  }

  // Styling for Mobile
  @media (max-width: 991px) {
    .spy-scroll-section {
      z-index: 999;
      position: fixed; // Fixes the component at a specific position
      top: var(--nav-height); // Starts right below the navbar
      right: 0;
      width: 100%; // Takes the full width of the viewport
      height: auto; // Height adjusts to content
      background: var(--white); // White background for visibility
      display: flex;
      justify-content: center; // Centers items horizontally
      align-items: center; // Aligns items vertically
      flex-wrap: wrap; // Allows items to wrap to next line if space is insufficient
      padding: 1rem 0; // Padding top and bottom
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); // Soft shadow for aesthetic separation
    }
  }
  .spy-item {
    display: inline; // Ensures spy items are inline by default
    margin: 0.5rem;
    cursor: pointer;
  }

  .spy-item.active {
    font-weight: bold;
    color: blue; // Highlight the active section
  }

  @media (max-width: 300px) {
    .spy-scroll-section {
      flex-direction: column; // Stacks items vertically on very small screens
    }
  }
`;

export default Container;
