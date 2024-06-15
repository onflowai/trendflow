import styled from 'styled-components';

const Container = styled.article`
  /* background: var(--background-color); */
  position: relative;
  background: var(--white);
  /* background: var(--grey-5); */
  /* background: var(--primary-5); */
  /* background: var(--grey-30); */
  border-radius: var(--border-radius);
  border: 1.5px solid var(--grey-50);
  /* border: 1.5px solid var(--grey-70); */
  display: grid;
  grid-template-rows: 1fr auto;
  overflow: hidden;

  .loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.7); /* white with low opacity */
  display: flex;
  justify-content: center;
  align-items: center;
 /* Make sure it covers all other content inside the container */
  }
  .overlay{
    
  }
`;

export default Container;
