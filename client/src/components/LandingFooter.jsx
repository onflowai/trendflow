import { socialLinks } from '../assets/utils/data';
import styled from 'styled-components';
import { CustomIconLink } from '../components';
import LandingNavbarLinks from './LandingNavbarLinks';
import LandingNavbarSocials from './LandingNavbarSocials';

const LandingFooter = () => {
  return (
    <Container>
      <footer className="section footer">
        <LandingNavbarLinks
          parentClass="footer-links"
          itemClass="footer-link"
        />
        <ul className="footer-icons">
          <li className="nav-icon">
            <CustomIconLink size={23} />
          </li>
          {socialLinks.map((link) => {
            return (
              <LandingNavbarSocials
                key={link.id}
                {...link}
                itemClass="footer-icon"
              />
            );
          })}
        </ul>
        <p className="copyright">
          copyright &copy; trendFlow
          <span id="date">{new Date().getFullYear()}</span>. all rights reserved
        </p>
      </footer>
    </Container>
  );
};

const Container = styled.main`
.footer {
    position: relative; /* Required for absolute positioning of the before element */
    background: var(--background-color);
    text-align: center;
    padding-top: 1rem;
    padding-bottom: 1rem;
    padding-left: 2rem;
    padding-right: 2rem;

    &::before {
      content: ""; /* pseudo-element for the line */
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px; 
      background: var(--grey-50);
    }
  }
.footer-links,
.footer-icons {
  display: flex;
  justify-content: center;
  margin-bottom: 1.1rem;
  flex-wrap: wrap;
}
.footer-link {
  color: var(--grey-400);
  text-transform: capitalize;
  font-size: 1rem;
  margin-right: 1rem;
  letter-spacing: var(--spacing);
  transition: var(--transition);
}
.footer-link:hover {
  color: var(--grey-800);
}
.footer-icon {
  font-size: 1.5rem;
  margin-right: 1rem;
  color: var(--grey-400);
  transition: var(--transition);
}
.footer-icon:hover {
  color: var(--grey-800);
}
.copyright {
  text-transform: capitalize;
  letter-spacing: var(--spacing);
  color: var(--grey-600);
  font-size: 0.6rem;
}
.copyright span {
  margin-left: 0.5rem;
}
.nav-icon{
  margin-right: 1rem;
}
`;

export default LandingFooter;
