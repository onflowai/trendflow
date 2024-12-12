import styled from 'styled-components';

const Container = styled.main`
  margin: 2rem 0;
  background-color: #fff;
  border-radius: 10px;

  .stats-container {
    display: flex;
    justify-content: space-around; /* distributing items with space around */
    border: 1.5px solid var(--grey-50);
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    border-radius: var(--border-radius);
    @media (max-width: 868px) {
      flex-direction: column; /* stack items in a column */
      align-items: center;
    }
  }

  .stat {
    display: flex;
    flex-direction: column; /* stack content-group vertically */
    align-items: center; /* center items */
    width: 100%; /* full width for spacing */
    padding: 1rem;
    text-align: left;
    border-right: 1.5px solid var(--grey-50); /* divider for larger screens */
    &:last-child {
      border-right: none;
    }

    @media (max-width: 868px) {
      border-right: none; /* remove dividers on smaller screens */
      border-bottom: 1.5px solid var(--grey-50); /* adding bottom border as divider */
      &:last-child {
        border-bottom: none; /* removing bottom border for the last item */
      }
    }
  }

  .content-group {
    margin-left: 2rem;
    display: flex;
    justify-content: space-between; /* Push children to the edges */
    align-items: center; /* Keeps items vertically aligned */
    width: 100%; /* Ensure it spans full width */
  }

  .icon-box {
    width: clamp(30px, 5vw, 50px); /* Gradually scales between 30px and 50px */
    height: clamp(30px, 5vw, 50px);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px var(--grey-50);
    border-radius: 10px;
    margin-right: 2em;
  }

  h3 {
    font-size: clamp(1.5rem, 2vw, 2rem); /* gradually scales between 1.5rem and 2rem */
    font-weight: bold;
    margin: 0;
  }

  p {
    font-size: clamp(1rem, 1vw, 1.2rem); /* gradually scales between 1rem and 1.2rem */
    color: var(--grey-300);
    margin: 0;
  }

  @media (max-width: 768px) {
    .stat {
      flex-direction: column; /* stack content vertically */
      border-bottom: 1.5px solid var(--grey-50); /* add divider between stacked items */
      &:last-child {
        border-bottom: none; /* remove divider for the last item */
      }
    }

    .icon-box {
      width: 30px; /* smaller icon for smaller screens */
      height: 30px;
      margin-right: 1.5rem; /* adjust spacing */
    }

    h3,
    p {
      font-size: 1rem; /* smaller text for smaller screens */
    }
  }
`;
export default Container;
