import styled from 'styled-components';
import { miniTrademarkDisclaimer } from '../assets/utils/data';

const DisclaimerMini = () => {
  return (
    <Container>
      <p className="mini-disclamer" aria-label="Mini trademark disclaimer">
        {miniTrademarkDisclaimer}
      </p>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;

  .mini-disclamer {
    width: min(100%, 980px);
    margin: 0 auto;
    padding-bottom: 0.5rem;
    color: var(--grey-500);
    background: var(--background-color);
    font-size: 0.68rem;
    line-height: 1.55;
    text-align: center;
  }

  @media (max-width: 600px) {
    .mini-disclamer {
      padding-bottom: 0.5rem;
      padding-left: 1.5rem;
      padding-right: 1.5rem;
      font-size: 0.62rem;
      text-align: left;
    }
  }
`;

export default DisclaimerMini;