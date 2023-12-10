import LandingTitle from './LandingTitle';
import Container from '../assets/wrappers/LandingAbout';
//This component is set up right after the Hero to give a little description of trendFlow
const LandingAbout = () => {
  return (
    <Container>
      <section className="section section-center" id="about">
        <LandingTitle title="about" subTitle="us" />

        <div className="section-center about-center">
          <article className="about-info">
            <h3>Major Updates:</h3>
            <p>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit.
              Aspernatur quisquam harum nam cumque temporibus explicabo dolorum
              sapiente odio unde dolor?
            </p>
            <a href="#" className="btn">
              Explore All
            </a>
          </article>
        </div>
      </section>
    </Container>
  );
};

export default LandingAbout;
