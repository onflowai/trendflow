import styled from 'styled-components';

const Container = styled.section`
  border-radius: var(--border-radius);
  width: 100%;
  background: var(--background-secondary-color);
  .trend-title {
    margin-bottom: 2rem;
  }
  .trend {

  width: 90vw;
  background: var(--background-second-color);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-2);
  padding: 2rem 2.5rem;
  margin: 3rem auto;
  margin: 0;
  max-width: 100%;
  width: 100%;
  }
  .trend-row {
    margin-bottom: 0;
  }
  .trend-center {
    display: grid;
    row-gap: 1rem;
  }

 
  @media (min-width: 992px) {
    .trend-center {
      grid-template-columns: 1fr 1fr;
      align-items: center;
      column-gap: 1rem;
    }
  }
  @media (min-width: 1120px) {
    .trend-center {
      grid-template-columns: 1fr 1fr 1fr;
    }
  }
`;

export default Container;
