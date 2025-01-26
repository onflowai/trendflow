import styled from 'styled-components';

const Container = styled.main`
  min-height: 100vh;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: var(--background-color);
  h3 {
    margin-bottom: 0.5rem;
  }
  p {
    line-height: 1.5;
    margin-top: 0.5rem;
    margin-bottom: 1rem;
    color: var(--text-second-color);
  }
  a {
    color: var(--primary-500);
    text-transform: capitalize;
  }

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 1000px;
  width: 100%;
  background: var(--background-second-color);
  border-radius: 10px;
  overflow: hidden;
  padding: 2rem;
  gap: 2rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }

  .top-bar {
    width: 100%; /* Spans the full width of the content */
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 1rem;

    .logo {
      height: 40px;
    }

    .close-button {
      cursor: pointer;
      color: var(--primary-color);
      display: flex;
      align-items: center;
    }
  }

  .image-wrapper {
    flex: 1;
    text-align: center;

    .error-emoji {
      width: 90vw;
      max-width: 400px;
      display: block;
      margin: 0 auto;
      transition: all 0.3s ease-in-out;
    }

    @media (max-width: 768px) {
      img {
        max-width: 300px;
      }
    }
  }

  .text-wrapper {
    flex: 1;
    text-align: left;

    h3 {
      margin-bottom: 0.5rem;
      font-size: 2rem;
      color: #333333;
    }

    p {
      line-height: 1.5;
      margin-top: 0.5rem;
      margin-bottom: 1rem;
      color: var(--text-second-color);
      font-size: 1.1rem;
    }

    @media (max-width: 768px) {
      text-align: center;
    }
  }
}
`;

export default Container;
