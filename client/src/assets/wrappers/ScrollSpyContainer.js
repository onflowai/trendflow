import styled from 'styled-components';

const Container = styled.section`

 .spy-item {
  cursor: pointer;
}
.spy-item.active {
  font-weight: bold;
  color: blue; // Highlight the active section
}
//styling for desktop
@media (min-width: 992px) {

    .spy-scroll-section {
      //HERE
    }
}
//styling for Mobile
 @media (max-width: 991px) {
    position: fixed; // Fixes the component at a specific position
    top: var(--nav-height); // Starts right below the navbar, assuming you have a CSS variable for navbar height
    right: 0;
    width: 100%; // Takes the full width of the viewport
    height: auto; // Height adjusts to content
    background: white; // White background for visibility
    display: flex;
    justify-content: center; // Centers items horizontally
    align-items: center; // Aligns items vertically
    flex-wrap: wrap; // Allows items to wrap to next line if space is insufficient
    padding: 1rem 0; // Padding top and bottom
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); // Soft shadow for aesthetic separation
    // Special handling for very small screens
    flex-direction: column; // Stacks items vertically when screen width is very narrow

    .spy-item {
    display: inline;
    margin: 0.5rem;
    cursor: pointer;
    }
  }

  @media (max-width: 400px) {
    .spy-scroll-section {
      flex-direction: column; // Stacks items vertically on very small screens
    }
  }
`;

export default Container;
