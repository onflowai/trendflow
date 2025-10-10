import styled from 'styled-components';

const Container = styled.section`
  min-height: 100vh;
  display: grid;
  align-items: center;
  .logo-login {
    align-items: center;
    display: block;
    margin: 0 auto;
    margin-bottom: 1.38rem;
  }
  .logo-register {
    align-items: center;
    display: block;
    margin: 0 auto;
    margin-bottom: 1.38rem;
  }
  .form {
    max-width: 400px;
  }
  h4 {
    text-align: center;
    margin-bottom: 1.38rem;
  }
  p {
    margin-top: 1rem;
    text-align: center;
    line-height: 1.5;
  }
  .btn {
    margin-top: 1rem;
  }
  .member-btn {
    color: var(--primary-500);
    letter-spacing: var(--letter-spacing);
    margin-left: 0.25rem;
  }
  .fade-in {
  opacity: 0;
  transition: opacity 400ms ease-in;
  }
  .fade-in.visible {
  opacity: 1;
  }
  @media (max-width: 640px) {
    align-items: flex-start;
    justify-items: center;
    padding-top: calc(env(safe-area-inset-top, 0px) + 64px);
    .form {
      margin-top: 0;
    }
  }
`;
export default Container;
