import { socialLinks } from '../assets/utils/data';
import styled from 'styled-components';
import { CustomIconLink } from '../components';
import LandingNavbarLinks from './LandingNavbarLinks';
import LandingNavbarSocials from './LandingNavbarSocials';
import { Link } from 'react-router-dom';
import { FaBalanceScale } from 'react-icons/fa';

const LandingFooter = () => {
  return (
    <Container>
      <footer className="section footer">
        <LandingNavbarLinks
          parentClass="footer-links"
          itemClass="footer-link"
        />
        <ul className="footer-icons">
          <li className="nav-icon custom-icon">
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
          <li className="nav-icon legal-icon-item">
            <Link
              to="/legal"
              className="footer-icon legal-footer-icon"
              aria-label="Legal Hub"
              title="Legal Hub"
            >
              <FaBalanceScale />
            </Link>
          </li>
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
    position: relative;
    background: var(--background-color);
    text-align: center;
    padding-top: 1rem;
    padding-bottom: 0.5rem;//HERE fixed broken 0%.5rem
    padding-left: 2rem;
    padding-right: 2rem;

    &::before {
      content: '';
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
    align-items: center;//HERE keeps legal icon aligned
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
    display: inline-flex;//HERE makes Link icon behave like other icons
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    margin-right: 1rem;
    color: var(--grey-400);
    transition: var(--transition);
  }

  .footer-icon:hover {
    color: var(--grey-800);
  }

  .legal-footer-icon {
    text-decoration: none;//avoids link underline
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

  .nav-icon {
    margin-right: 1rem;
  }

  .legal-icon-item {
    margin-right: 0; //last icon does not need extra right spacing
  }
`;

export default LandingFooter;
