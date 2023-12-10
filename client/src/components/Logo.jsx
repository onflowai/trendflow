import logo from '../assets/images/test-logo.svg';
import styled from 'styled-components';

const Logo = () => {
  return (
    <Container>
      <img src={logo} alt="Tech Trend Flow Logo" className="logo" />
    </Container>
  );
};

const Container = styled.section`
  .logo{
    width: 40px;
    
  }
`;

export default Logo;
