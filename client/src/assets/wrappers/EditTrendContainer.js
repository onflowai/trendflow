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
    max-width: 900px; // limit max width to 900px
    margin: 0 auto 2rem auto; // center the trend container
  }

  .trend-edit-icon {
    margin-bottom: 0.5rem;
    font-size: 1.5rem;
  }
  .svg-upload-label {
  display: inline-block;
  cursor: pointer;
  position: relative;
}

.svg-upload-icon {
  width: 24px;
  height: 24px;
}

.svg-upload-input {
  display: none;
}

.svg-upload-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 5px;
}

.svg-upload-button:hover {
  background-color: #0056b3;
}

  .edit-icon {
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }
  .edit-trend-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .edit-trend {
    display: flex; // using flex layout
    align-items: center; // vertically center items
    gap: 0.5rem; // space between icon and input
  }

  .form-center {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .dummy-chart-controls {
    display: flex;
    align-items: center;
    gap: 1rem;
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
    display: none; // hide icon buttons by default
    align-items: center;
  }
  .circle {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--grey-100);
    margin-right: 0.5rem;
  }

  .date-selector {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .selector{
    display: flex; // using flex layout
    align-items: center; // vertically center items
    gap: 0.5rem; // space between icon and input
    flex-grow: 1;
  }
  .form-selector {
  width: 100%;
  }

  .content {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .content-selectors {
    display: flex;
    flex: 1;
    gap: 1rem;
    justify-content: space-between;
    width: 100%;
  }

  .content-selectors > * {
    flex: 1;
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
  }

  .submit-btn {
    display: flex;
    justify-content: flex-end;
  }

   @media (max-width: 991px) {
    .content {
      flex-direction: column;
      align-items: center;
    }

    .content-selectors {
      flex-direction: column;
      width: 100%;
    }

    .selector {
      width: 100%; // full width on smaller screens
    }
  }

  .delete-btn {
    display: flex;
    justify-content: flex-end;
  }

  @media (max-width: 991px) {
    .content {
      flex-direction: column;
      align-items: stretch;
    }
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
    .page-layout {
      display: flex;
      flex-direction: column; // reiterate to ensure stacking
    }

    .trend {
      padding: 7.5rem 0rem 0rem;
      max-width: 100%; // padding to offset sidebar overlay
    }
    .form-selector {
    width: 100%;
    }
  }

  .content-selectors select {
    border-color: purple;
    color: purple;
  }
`;

export default Container;
