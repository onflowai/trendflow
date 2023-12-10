import React from 'react';
import { Link } from 'react-router-dom';
import Container from '../assets/wrappers/RegisterLoginPage';
import { Logo, Form } from '../components';
/**
 * Landing page is the first page the user will see
 * @returns
 */
const Login = () => {
  return (
    <Container>
      <form className="form">
        <Logo />
        <h4>Login</h4>
        <Form type="email" name="email" defaultValue="test@test.com" />
        <Form type="password" name="password" defaultValue="password123" />
        <button type="submit" className="btn btn-block">
          Sign In
        </button>
        <button type="submit" className="btn btn-color btn-block">
          Create Account Later
        </button>
      </form>
    </Container>
  );
};

export default Login;
