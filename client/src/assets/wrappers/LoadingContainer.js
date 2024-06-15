import styled from 'styled-components';

const Container = styled.main`
 

.loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.7); // Light white with opacity for overlay effect
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10; // Ensure overlay is above other content
  }

  .loading {
    width: 10vw; // Default size for large screens
    height: 10vw; // Default size for large screens
    max-width: 10rem; // Set a maximum size
    max-height: 10rem; // Set a maximum size
    border-radius: 50%;
    border: 5px solid transparent;
    animation: spinner 0.6s linear infinite;
    z-index: 11; // Ensure spinner is above the overlay

    &::before {
      content: '';
      position: absolute;
      top: -5px;
      left: -5px;
      right: -5px;
      bottom: -5px;
      border-radius: 50%;
      background: conic-gradient(from 0deg, var(--primary3-600), var(--primary2-600), var(--primary-600), transparent);
      mask: radial-gradient(farthest-side, transparent calc(100% - 5px), black 100%);
    }
  }

  @keyframes spinner {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @media (max-width: 768px) {
    .loading {
      width: 20vw; // Increase size on medium screens
      height: 20vw; // Increase size on medium screens
    }
  }

  @media (max-width: 480px) {
    .loading {
      width: 17vw; // Increase size on small screens
      height: 17vw; // Increase size on small screens
    }
  }
`;
export default Container;
