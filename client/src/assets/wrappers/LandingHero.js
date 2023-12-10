import styled from 'styled-components';

const Container = styled.section`
  nav {
    
  }
  .page {
    min-height: calc(60vh - var(--nav-height));
    display: grid;
    align-items: center;
    margin-top: 6rem;
  }
  h1 {
    font-weight: 700;
    span {
      color: var(--primary-700);
    }
    margin-bottom: 1.5rem;
  }
  p {
    line-height: 2;
    color: var(--text-second-color);
    margin-bottom: 1.5rem;
    max-width: 35em;
  }
  .register-link {
    margin-right: 1rem;
  }
  .main-img {
    display: none;
  }
  .btn {
    padding: 0.75rem 1rem;
  }
  @media (min-width: 992px) {
    .page {
      grid-template-columns: 1fr 400px;
      column-gap: 3rem;
    }
    .main-img {
      display: block;
    }
  }
`;
export default Container;
