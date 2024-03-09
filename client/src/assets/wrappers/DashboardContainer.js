import styled from 'styled-components';

const Container = styled.section`
  .dashboard {
    display: grid;
    grid-template-columns: 1fr;
  }
  .dashboard-page {
    width: 90vw;
    margin: 0 auto;
    padding: 1rem 0;
  }
  @media (min-width: 992px) {
    .dashboard {
      grid-template-columns: auto 2fr;
    }
    .dashboard-page {
      width: 95%;
    }
  }
`;
export default Container;
