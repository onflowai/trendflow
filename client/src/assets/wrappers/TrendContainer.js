import styled from 'styled-components';

const Container = styled.article`
  /* background: var(--background-color); */
  position: relative;
  background: var(--white);
  border-radius: var(--border-radius);
  border: 1px solid var(--grey-70);
  display: grid;
  grid-template-rows: 1fr auto;
  overflow: hidden;

  .loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--white-overlay); /* white with low opacity */
  display: flex;
  justify-content: center;
  align-items: center;
 /* Make sure it covers all other content inside the container */
  }
  .overlay{

  }
`;

export default Container;
