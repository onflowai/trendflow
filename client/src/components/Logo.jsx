import logo from '../assets/images/logo-02.svg';
import styled from 'styled-components';

const Logo = ({ size }) => {
  return (
    <Container>
      <img
        src="https://cdn.trendflowai.com/content/logo.svg"
        alt="Tech Trend Flow Logo"
        className="logo"
      />
    </Container>
  );
};

const Container = styled.section`
  .logo{
    width: 30px;
  }
`;

export default Logo;
