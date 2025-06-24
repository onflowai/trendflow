import LandingTitle from './LandingTitle';
import { majorUpdates, version } from '../assets/utils/data';
import styled from 'styled-components';
//This component is set up right after the Hero to give a little description of trendFlow
const LandingUpdates = () => {
  return (
    <Container>
      <section className="section section-center" id="updates">
        <LandingTitle title="about" subTitle="us" />

        <div className="section-center about-center">
          <article className="about-info">
            <h3>Major Updates:</h3>
            <div className="about-updates">
              <p>{majorUpdates}</p>
              <span className="version">v{version}</span>
            </div>
            <a href="#" className="btn">
              Explore All
            </a>
          </article>
        </div>
      </section>
    </Container>
  );
};

const Container = styled.section`
  padding-bottom: 2rem;
  
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
  .about-updates {
    display: flex;
    flex-direction: column-reverse;
    align-items: flex-start;
  }
   .version {
    background-color: var(--background-second-color);
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.9rem;
    color: var(--text-second-color);
    margin-top: 0.5rem;
  }
  @media (min-width: 992px) {
    .page {
      grid-template-columns: 1fr 400px;
      column-gap: 3rem;
    }
    .main-img {
      display: block;
    }
    .about-updates {
      flex-direction: row;
      align-items: center;
    }
    .version {
      margin-left: auto;
    }
  }
`;

export default LandingUpdates;
