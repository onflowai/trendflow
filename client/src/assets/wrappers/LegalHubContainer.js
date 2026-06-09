import styled from 'styled-components';

const Container = styled.main`
  width: min(1120px, calc(100% - 32px));
  margin: 3rem auto;
  padding: 42px 0 64px;

  .legal-hero {
    display: flex;
    align-items: center;
    gap: 18px;
    margin-bottom: 24px;
    padding: 22px;
    border: 1.5px solid var(--grey-50);
    border-radius: 8px;
  }

  .legal-logo-box {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .legal-logo {
    width: clamp(54px, 7vw, 86px); //about as large as hero text
    height: clamp(54px, 7vw, 86px);
    object-fit: contain;
    display: block;
  }

  .legal-hero-content {
    min-width: 0; //prevents text overflow
  }

  .legal-hero .eyebrow {
    margin: 0 0 8px;
    color: var(--primary-500);
    font-size: 0.85rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .legal-hero h1 {
    margin: 0 0 10px;
    color: var(--text-color);
    font-size: clamp(1.8rem, 4vw, 3rem);
    line-height: 1.1;
  }

  .legal-hero p {
    max-width: 760px;
    margin: 0;
    color: var(--grey-500);
    line-height: 1.6;
  }

  .legal-content-card {
    margin-top: 18px;
    padding: 22px;
    border: 1.5px solid var(--grey-50);
    border-radius: 8px;
  }

  @media (max-width: 768px) {
    width: min(100% - 22px, 1120px);
    padding: 28px 0 46px;

    .legal-hero {
      align-items: flex-start;
      gap: 14px;
      padding: 18px;
      margin-bottom: 18px;
    }

    .legal-logo {
      width: 48px;
      height: 48px;
    }

    .legal-content-card {
      margin-top: 14px;
      padding: 18px;
    }
  }

  @media (max-width: 420px) {
    .legal-hero {
      gap: 12px;
    }

    .legal-logo {
      width: 42px;
      height: 42px;
    }
  }
`;

export default Container;