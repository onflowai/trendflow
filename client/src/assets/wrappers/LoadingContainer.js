import styled from 'styled-components';

const Container = styled.main`
position: relative;
.loading-overlay {
  position: absolute;
  background-color: white; /* white with low opacity */
}

.loading {
  width: 10rem;
  height: 10rem;
  margin: 0 auto;
  margin-top: 50vh;
  border-radius: 50%;
  border: 5px solid transparent;
  animation: spinner 0.6s linear infinite;

  &::before {
      content: '';
      position: absolute;
      top: -5px; /* Adjust these values to match the border size */
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
`;
export default Container;
