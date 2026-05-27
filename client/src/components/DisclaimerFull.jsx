import styled from 'styled-components';
import { fullTrademarkDisclaimer } from '../assets/utils/data';

const DisclaimerFull = () => {
  return (
    <Container>
      <section className="full-disclamer" aria-label="Trademark disclaimer">
        <p className="full-disclamer-text">{fullTrademarkDisclaimer}</p>
      </section>
    </Container>
  );
};

const Container = styled.main`
  width: 100%;

  .full-disclamer {
    width: min(100%, 980px);
    margin: 0 auto;
    padding: 1.25rem 1.5rem;
    background: var(--background-color);
    border: 1.5px solid var(--grey-50);
    border-radius: var(--border-radius);
    box-shadow: var(--shadow-1);
  }

  .full-disclamer-title {
    margin: 0 0 0.75rem;
    color: var(--grey-800);
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: var(--spacing);
    text-transform: capitalize;
  }

  .full-disclamer-text {
    margin: 0;
    color: var(--grey-500);
    font-size: 0.82rem;
    line-height: 1.65;
    white-space: pre-line;
  }

  @media (max-width: 600px) {
    .full-disclamer {
      padding: 1rem;
    }

    .full-disclamer-title {
      font-size: 0.95rem;
    }

    .full-disclamer-text {
      font-size: 0.78rem;
    }
  }
`;

export default DisclaimerFull;