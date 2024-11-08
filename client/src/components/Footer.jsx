import React from 'react';
import Container from '../assets/wrappers/FooterContainer';

const Footer = () => {
  return (
    <Container>
      <footer className="footer">
        <div className="footer-links">{/*links*/}</div>
        <div className="footer-icons">{/*links*/}</div>
        <div className="copyright">
          © {new Date().getFullYear()} <span>Your Company</span>
        </div>
      </footer>
    </Container>
  );
};
export default Footer;
