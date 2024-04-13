import styled from 'styled-components';

const Container = styled.section`
 border-radius: var(--border-radius);
  background: var(--background-secondary-color);
  .trend-title {
    margin-bottom: 2rem;
  }
  .trend {
  padding: 2rem 2.5rem;
  margin: 3rem auto;
  margin: 0;
  max-width: 80%;
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

  @media (min-width: 992px) {
    .content-area {
      grid-template-columns: 1fr 1fr;
      align-items: center;
      column-gap: 1rem;
    }
  }
  @media (min-width: 1120px) {
    .content-area {
      grid-template-columns: 1fr 1fr 1fr;
    }
  }
`;

export default Container;
