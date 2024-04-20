import styled from 'styled-components';

const Container = styled.div`

.related-trend {
    padding: 0.5rem 1rem; // Padding for each item
    margin: 0.5rem; // Margin around each item to ensure spacing
    white-space: nowrap; // Prevents wrapping text inside items
    background: #f0f0f0; // Light background color for each item
    border-radius: 5px; // Rounded corners for aesthetic purposes
  }
 /* display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background: var(--background-light-color); // Modify as needed

  div {
    padding: 0.5rem;
    background: var(--color-accent); // Modify as needed
    border: 1px solid var(--border-color); // Modify as needed
  } */
`;

export default Container;
