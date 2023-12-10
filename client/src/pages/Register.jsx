import React from 'react';
import { Link } from 'react-router-dom';
import Container from '../assets/wrappers/RegisterLoginPage';
import { Logo, Form } from '../components';
/**
 * Register page will have a registration form for the user should they choose to have an account
 * Using From component
 * @returns
 */
const Register = () => {
  return (
    <Container>
      <form className="form">
        <Logo />
        <h4>Register</h4>
        {/* NAME */}
        <Form type="text" name="name" defaultValue="Steve" />
        <Form
          type="text"
          name="name"
          defaultValue="Brooks"
          labelText="Last Name"
        />
        <Form type="email" name="email" defaultValue="test@test.com" />
        <Form type="password" name="password" defaultValue="password123" />
        <button type="submit" className="btn btn-block">
          Submit
        </button>
        <p>
          Already have an Account?
          <Link to="/login" className="member-btn">
            Login
          </Link>
        </p>
      </form>
    </Container>
  );
};

export default Register;
