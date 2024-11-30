import styled from 'styled-components';

const Container = styled.main`
  margin-top: 0rem;
  text-align: left;
  

  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    flex-wrap: wrap; // allowing wrapping in smaller screens
  }

  .logo-trend {
  display: flex;
  align-items: center; /* Vertically align items */
  gap: 0.5rem; /* Space between the image and the title */
  }

  .trend-logo {
    width: 20px;
    height: 20px; /* Ensures a uniform size */
    border-radius: 50%; /* Optional: Makes the logo round */
  }

  .trend-title {
    font-size: 1.5rem;
    font-weight: bold;
  }

  .chart-controls-container {
    display: flex;
    align-items: center;
  }

  .chart-controls {
    display: flex;
    align-items: center;
  }

  .chart-controls-icons {
    display: none; // Hide icon buttons by default
    align-items: center;
  }

  .chart-selector-container {
    width: 200px; // set a fixed width
    margin-left: 1rem;
    .chart-selector {
      border-radius: 8px;
      box-shadow: 0 4px 8px var(--grey-50);
    }
  }

  .chart-selector-container-small {
    display: none; // hiding small screen selector by default
  }

  button {
    background: transparent;
    border: none;
    color: var(--primary-500);
    font-size: 1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    margin-left: 1rem;
    .circle {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--grey-100);
      margin-right: 0.5rem;
    }
    .circle.active {
      background: var(--green);
    }
    &.text-button {
      position: relative;
      &.active {
        color: var(--primary2-600);
        /* border: 1px solid gray; */
        /* background: var(--grey-30); */
      }
    }
    &.icon-button {
      align-items: center;
      justify-content: center;
      padding: 0.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 8px var(--grey-50);
      background: var(--white);
      .icon {
        font-size: 1.5rem;
        color: gray;
      }
      .icon.active {
        color: var(--green);
      }
      &.active {
        box-shadow: 0 2px 4px var(--grey-50); // reduced shadow to indicate active state
      }
    }
  }

    h4 {
    text-align: center;
    margin-bottom: 0.75rem;
  }

  @media (max-width: 780px) {
    .chart-header {
      flex-direction: column; // Stack trend-title and chart-controls
      align-items: center; // Center align in smaller screens
    }
    .trend-title {
      margin-bottom: 1rem; // Add margin below trend title
      text-align: center;
    }
    .chart-controls-container {
      width: 100%;
      justify-content: center; // Center the controls
    }
  }

  @media (max-width: 500px) {
    .chart-header {
      .chart-controls-container {
        display: none; // Hide the text buttons
      }
      .chart-controls-icons {
        display: flex; // Show the icon buttons
        flex-direction: row; // Keep buttons and select in one line
        align-items: center; // Align items center
        justify-content: center; // Center the buttons
        width: auto; // Auto width for the container
        flex-grow: 1; // Allow to grow and take available space
      }
      .chart-selector-container-small {
        display: block; // Show the small screen selector
        width: auto; // Auto width for the selector
        flex-shrink: 0; // Prevent shrinking
        margin-left: auto; // Align to the right
        margin-left: 1rem;
        box-shadow: 0 4px 8px var(--grey-50);
        .chart-selector {
          width: auto; // Auto width for the selector
        }
      }
    }
  }
`;
export default Container;
