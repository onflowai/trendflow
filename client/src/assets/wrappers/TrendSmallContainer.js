import styled from 'styled-components';

const Container = styled.article`
  position: relative;
  cursor: pointer;
  
  transition: background-color 0.2s ease; // Smooth transition for background color

  &:hover {
    background-color: var(--grey-50); // Change background on hover
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
    
    h4 {
      top: 120px;
      /* font-size: 1.2rem; */
      z-index: 2;
    }

    h6 {
      top: 140px;
      /* font-size: 1.2rem; */
      z-index: 2;
    }
    
    p {
      color: var(--grey-600);
      top: 155px;
      /* font-size: 1rem; */
      z-index: 1;
    }
  }

  .bottom-row {
    display: grid; // Use grid layout
    grid-template-columns: auto 1fr auto auto; // Define the columns
    align-items: center;
    padding: 0.5rem 1rem;
    background: var(--white);
    border-top: 1.5px solid var(--grey-50);
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
    /* font-size: 0.9rem; */
    white-space: nowrap;
  }

  .bookmark-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: none;
    cursor: pointer;
    padding: 0;
    outline: none;
  }
  .bookmark-btn.grid-view{
    position: absolute; // Position absolutely within bottom-row
    right: 1rem; // Move to the right with some padding
    top: 0.5rem; // Move it down a bit from the top
    background-color: var(--white); // Add white background
    border-radius: 50%; // Make it round
    padding: 0.25rem; // Add some padding for spacing
  }
  
  @media (max-width: 500px) {
    .info {
      h3 {
        font-size: 1rem;
      }
      p {
        font-size: 0.8rem;
      }
    }
    
    .bottom-row {
      flex-direction: row; // Ensure it stays in row direction
    }

    .bottom-info {
      flex-direction: row; // Ensure it stays in row direction
      gap: 0.2rem; // Reduce gap for better spacing in mobile
      flex-wrap: nowrap; // Prevent wrapping in mobile view
    }

    .info-item {
      white-space: nowrap; // Prevent text wrapping
    }
  }
`;

export default Container;
