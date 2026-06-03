import React from 'react';
import Container from '../assets/wrappers/FooterContainer';
import { DisclaimerMini } from '../components';

const Footer = () => {
  return (
    <Container>
      <footer className="footer">
        <div className="copyright">
          © {new Date().getFullYear()} <span>trendflow</span>
          <DisclaimerMini/>
        </div>

      </footer>
    </Container>
  );
};
export default Footer;
