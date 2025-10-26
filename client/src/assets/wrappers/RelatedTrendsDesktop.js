import styled from 'styled-components';

const Container = styled.div`
border-radius: var(--border-radius);
 .related-trends-desktop {
    display: flex;
    flex-direction: column;
    margin-top: 0.6rem;
    margin-right: 0.6rem;
    margin-bottom: 0.6rem;
    gap: 1rem;
  }

  .trend-small-card {
    background: var(--card-background);
    border-radius: var(--border-radius);
    transition: transform 0.1s ease;
    height: 150px;
  }
  .trend-desc {
    margin-top: 0rem;
  }
  .trend-desc:empty {
    display: none;
  }
  .trend-title h4 {
    top: 25px;
    z-index: 0;
  }
  .trend-title h6 {
    top: 50px;
    z-index: 0;
  }
  .bottom-row {
    border-bottom-left-radius: var(--border-radius);
    border-bottom-right-radius: var(--border-radius);
  }
`;

export default Container;
