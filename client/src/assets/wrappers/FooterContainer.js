import styled from 'styled-components';

const Container = styled.div`
  .footer {
    position: relative;
    width: 100vw; 
    margin-left: calc(50% - 50vw); 
    background: var(--white);
    color: var(--grey-400);
    text-align: center;
    padding: 1rem 2rem;
    overflow: hidden;
    backdrop-filter: blur(6px);

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: var(--white);
    }

    &::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(
        circle at top left, 
        var(--primary3-900) -90%, 
        transparent 30%
      ),
      radial-gradient(
        circle at top right, 
        var(--primary2-900) 0%, 
        transparent 30%
      );
      opacity: 0.3; 
      backdrop-filter: blur(10px); 
      z-index: 1;
    }

    .footer-links,
    .footer-icons {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      margin-bottom: 1rem;
      position: relative;
      z-index: 2; 
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
      z-index: 2; 
    }
  }
`;

export default Container;
