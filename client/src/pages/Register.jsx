import React from 'react';
import { Form, redirect, useNavigation, Link } from 'react-router-dom';
import Container from '../assets/wrappers/RegisterLoginPage';
import { Logo, FormComponent } from '../components';
/**
 * Register page will have a registration form for the user should they choose to have an account
 * Using From component with 'action' post
 * @returns
 */
const Register = () => {
  return (
    <Container>
      <Form method="post" className="form">
        <Logo />
        <h4>Register</h4>
        {/* NAME */}
        <FormComponent type="text" name="name" defaultValue="Steve" />
        <FormComponent
          type="text"
          name="name"
          defaultValue="Brooks"
          labelText="Last Name"
        />
        <FormComponent type="email" name="email" defaultValue="test@test.com" />
        <FormComponent
          type="password"
          name="password"
          defaultValue="password123"
        />
        <button type="submit" className="btn btn-block">
          Submit
        </button>
        <p>
          Already have an Account?
          <Link to="/login" className="member-btn">
            Login
          </Link>
        </p>
      </Form>
    </Container>
  );
};

export default Register;
