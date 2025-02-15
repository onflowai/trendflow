import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  position: relative;
  cursor: pointer;
  transition: background-color 0.2s ease; // Smooth transition for background color

  &:hover {
    background-color: var(--card-highlight); // Change background on hover //
  }

  .trend-small-card {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
  }

  .overlay {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-end; // Align children to the bottom
    height: 100%; // Ensure it takes full height
    //overflow: hidden;
  }
  .trend-title {
  margin-top: 1rem; /* Adjust spacing of title */
  text-align: left;
  }

.trend-desc {
  margin-top: 2rem; /* Add some spacing if the description is present */
  }
  
  .trend-desc:empty {
  display: none;
  }

  .info {
    position: relative;
    text-align: left;
    width: 100%;

    h4, h6, p {
      position: absolute;
      width: 100%;
      margin: 0;
      color: var(--text-color);
      padding: 2rem 1rem 1rem;
      border-radius: 0.25rem;
    }

    .underlay-heading {
      backdrop-filter: blur(40px);
      width: auto;
      border-radius: 0.25rem;
      margin-left: 0.8rem;
      padding: 2px 4px;
    } 
    
    h4 {
      top: 149px;
      z-index: 0;
    }

    h6 {
      top: 175px;
      z-index: 0;
    }
    
    p {
      color: var(--grey-600);
      top: 160px;
      z-index: 0;
    }
  }
  .info-mini{
    position: relative;
    text-align: left;
    width: 100%;

    h4, h6, p {
      position: absolute;
      width: 100%;
      margin: 0;
      color: var(--text-color);
      padding: 2rem 1rem 1rem;
      border-radius: 0.25rem;
    }

    .underlay-heading {
      backdrop-filter: blur(40px);
      width: auto;
      border-radius: 0.25rem;
      margin-left: 0.8rem;
      padding: 2px 4px;
    }
    
    h4 {
      top: 60px;
      z-index: 0;
    }

    h6 {
      top: 90px;
      z-index: 0;
    }
    
  }

  .bottom-row {
    display: grid; // Use grid layout
    grid-template-columns: auto 1fr auto; // Define the columns
    align-items: center;
    padding: 0.5rem 0.5rem;
    background: var(--small-card-bottom-row);
    border-top: 1.5px solid var(--grey-50);
    gap: 0.5rem; // Add some space between the items
  }

  .user-icon {
    grid-column: 1; // Place the user image in the first column
    display: flex;
    align-items: center;
  }

  .bottom-info {
    grid-column: 2; // Place the trend tech in the second column
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: nowrap; // Prevent wrapping in mobile view
    flex: 1; // Allow bottom-info to take available space
  }

  .info-item {
    display: flex;
    align-items: center;
    gap: 0.2rem;
    color: var(--grey-400);
    white-space: nowrap;
    font-size: 0.8rem;
  }
  .icon-tech{
    margin-left: 0.2rem;
    align-items: center;
    display: flex;
    gap: 0.1rem;
  }
  .icon-views{
    align-items: center;
    display: flex;
    gap: 0.2rem;
  }
  .actions {
    grid-column: 3; // Place the views in the third column
    display: flex;
    align-items: center;
    gap: 1.2rem;
  }
  .bookmark-btn {
    position: absolute; // Position absolutely within bottom-row
      right: 1rem; // Move to the right with some padding
      top: 0.5rem; // Move it down a bit from the top
      background-color: var(--white); // Add white background
      border-radius: 40%; // Make it round
      padding: 0.4rem; // Add some padding for spacing
  }
  .bookmark-btn svg {
  transform: translateY(2px); // Move the SVG icon 2 pixels down
  }

  @media (max-width: 500px) {
    .info {

      h4{
        top: 100px;//category vertical alignment
      }
      h6{
        top: 120px;//category vertical alignment
      }
      h3 {
        font-size: 1rem;
      }
      p {
        top: 105px;
        font-size: 0.8rem;
      }
      .mono-heading {
    } 
    }
    .info-item {
    font-size: 0.5rem;
    }
    
    .bottom-row {
      grid-template-columns: auto 1fr auto; // Ensure grid layout stays in row direction
      gap: 0.2rem; // Reduce gap for better spacing in mobile
    }

    .bottom-info {
      gap: 0.2rem; // Reduce gap for better spacing in mobile
      flex-wrap: nowrap; // Prevent wrapping in mobile view
    }

    .info-item {
      white-space: nowrap; // Prevent text wrapping
    }
  }
`;

export default Container;
