import styled from 'styled-components';

const Container = styled.main`
  margin: 2rem 0;
  background-color: #fff;
  border-radius: 10px;
  /* box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); */
  /* border: none; */

  header h1,
  header p {
   text-align: left;
    margin: 0;
    padding: 0;
    color: #333;
  }

  header h1 {
    font-size: 2rem; // Adjust for responsive design
    margin-bottom: 0.5rem;
  }

  header p {
    margin-bottom: 2rem;
    font-size: 1.5rem; // Adjust for responsive design
  }

  .stats-container {
   display: flex;
  justify-content: space-around; /* This distributes children with space around them */
  border: 1.5px solid #eee;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  border-radius: var(--border-radius);
  @media (max-width: 868px) {
    flex-direction: column;
    align-items: center;
  }
}

.stat {
display: flex;
flex-direction: column; /* Stacks content-group and change vertically */
align-items: center; /* This centers the flex children, might need adjustment based on your needs */
width: 100%; /* Ensure stat takes full width for spacing to take effect, adjust as needed */
padding: 1rem;
text-align: left;
border-right: 1.5px solid #eee;
  &:last-child {
    border-right: none;
  }
}

.content-group {
  margin-left: 2rem;
  display: flex;
  justify-content: space-between; /* Pushes children to the edges */
  align-items: center; /* Keeps items vertically aligned */
  width: 100%; /* Ensures the group spans the full width of its parent */
}

  .icon-box {
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    margin-right: 2em;
  }

  h3 {
    align-content: left;
    font-size: 2rem;
    font-weight: bold;
    margin: 0;
  }

  p {
    font-size: 1.2rem;
    color: #888;
    margin: 0;
  }

  .change {
    width: 100%;
    text-align: left;
    font-size: 0.8rem;
    font-weight: bold;
    margin-top: 0.5rem;
    margin-left: 2rem;
    &.positive {
      color: #4CAF50;
    }
    &.negative {
      color: #F44336;
    }
  }

  @media (max-width: 768px) {
    .stat {
      flex-direction: column;
      border-bottom: 1px solid #eee;
      &:last-child {
        border-bottom: none;
      }
    }

    .change {
      margin-left: 0;
      margin-top: 0.5rem;
      order: 3; /* Ensure it's placed at the bottom in a column layout */
    width: 100%; /* Full width */
    text-align: center; /* Center text */
    margin-top: 0.5rem; /* Space above */
    }
    stats-container {
    flex-direction: column;
    align-items: center;
  }

  .stat {
    display: flex;
    flex-direction: row; /* Align items horizontally */
    align-items: center; /* Center items vertically */
    justify-content: start; /* Align items to start of the container */
    width: 100%; /* Full width */
    padding: 0.5rem; /* Reduced padding */
    border-bottom: 1px solid #eee; /* Separator */
  }

  .icon-box {
    width: 30px; /* Smaller icon */
    height: 30px; /* Smaller icon */
    margin-right: 0.5rem; /* Adjust spacing */
  }

  h3, p {
    font-size: 1rem; /* Smaller text */
  }
  }

`;
export default Container;
