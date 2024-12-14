import logo from '../assets/images/logo-02.svg';
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
    width: 30px;
    
  }
`;

export default Logo;
