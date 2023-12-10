import styled from 'styled-components';

export const Container = styled.div`
   display: grid;
  gap: 1rem;
  padding-bottom: 3rem;
  
 

  // Large screen layout
  grid-template-areas:
    "title"
    "week week week"
    "week"
    "alltime"
    "month month month month month";
  grid-template-columns: repeat(5, 1fr);

  // Medium screen layout
  @media (min-width: 768px) {
    grid-template-areas:
      "week"
      "week week week week"
      "week"
      "alltime"
      "month month month";
    grid-template-columns: repeat(4, 1fr);
  }

  // Small screen layout
  @media (max-width: 767px) {
    grid-template-areas:
      "title"
      "week week week"
      "title"
      "alltime"
      "month month";
    grid-template-columns: repeat(2, 1fr);
  }
   .title-box {
    border-radius: 8px;
    background-color: var(--grey-50);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
  }

  .project-box {
    border-radius: 8px;
    background: #fff;
    padding: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: background-color 0.3s;
    cursor: pointer;
    &:hover {
      background-color: #ccc;
    }
  }
  a {
    text-decoration: none;
    align-content: center;
    color: black;
    display: block;
   
  }
`;

export default Container;
