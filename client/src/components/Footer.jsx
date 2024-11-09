import React from 'react';
import Container from '../assets/wrappers/FooterContainer';

const Footer = () => {
  return (
    <Container>
      <footer className="footer">
        <div className="copyright">
          © {new Date().getFullYear()} <span>trendflow</span>
        </div>
      </footer>
    </Container>
  );
};
export default Footer;
