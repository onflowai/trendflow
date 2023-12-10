import { socialLinks } from '../assets/utils/data';
import LandingNavbarLinks from './LandingNavbarLinks';
import LandingNavbarSocials from './LandingNavbarSocials';
import Container from '../assets/wrappers/Footer';

const Footer = () => {
  return (
    <Container>
      <footer className="section footer">
        <LandingNavbarLinks
          parentClass="footer-links"
          itemClass="footer-link"
        />
        <ul className="footer-icons">
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
export default Footer;
