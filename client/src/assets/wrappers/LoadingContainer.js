import styled from 'styled-components';

const Container = styled.main`
.loading {
  width: 6rem;
  height: 6rem;
  margin: 0 auto;
  margin-top: 10rem;
  border-radius: 50%;
  border: 4px solid #ccc;
  border-top-color: var(--clr-primary-5);
  animation: spinner 0.6s linear infinite;
}
.section {
  padding: 3rem 0;
}
.section-center {
  width: 90vw;
  margin: 0 auto;
  max-width: var(--max-width);
}
@media screen and (min-width: 992px) {
  .section-center {
    width: 95vw;
  }
}

`;
export default Container;
