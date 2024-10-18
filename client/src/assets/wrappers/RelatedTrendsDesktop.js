import styled from 'styled-components';

const Container = styled.div`
 .related-trends-desktop {
    display: flex;
    flex-direction: column;
    margin-top: 0.6rem;
    margin-right: 0.6rem;
    gap: 1rem;
  }

  .trend-small-card {
    border-radius: 0.5rem;
    transition: transform 0.1s ease;
    height: 150px;
    overflow: hidden;
  }
  .trend-title {
    padding-top: 1rem;
  }
  .trend-desc {
    margin-top: 0rem;
  }

`;

export default Container;
