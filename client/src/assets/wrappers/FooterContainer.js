import styled from 'styled-components';

const Container = styled.div`
  .footer {
    width: 100%;
    margin: 0;
    background: var(--white);
    color: var(--grey-400);
    text-align: center;
    padding: 1rem 2rem;
    overflow: hidden;

    .footer-links,
    .footer-icons {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      margin-bottom: 1rem;
      position: relative;
    }

    .footer-link,
    .footer-icon {
      color: var(--grey-400);
      font-size: 1rem;
      margin-right: 1rem;
      transition: color 0.3s ease;

      &:hover {
        color: var(--grey-800);
      }
    }

    .copyright {
      color: var(--grey-600);
      font-size: 0.8rem;
      position: relative;
    }
  }
`;

export default Container;
