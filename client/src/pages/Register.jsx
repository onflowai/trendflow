import React from 'react';
import { Form, redirect, useNavigation, Link } from 'react-router-dom';
import Container from '../assets/wrappers/RegisterLoginPage';
import { Logo, FormComponent } from '../components';
import customFetch from '../utils/customFetch';
/**
 * Register page will have a registration form for the user should they choose to have an account
 * Using From component with 'action' post
 * @returns
 */
export const action = async ({ request }) => {
  const formData = await request.formData(); //react router interface for garbing the data from the form
  const data = Object.fromEntries(formData); //turn array of the arrays into the object
  // console.log(data);
  try {
    await customFetch.post('/auth/register', data); //POST call with data payload
    return redirect('/login'); //function has to return something in this case a redirect
  } catch (error) {
    console.log(error);
    return error;
  }
};
const Register = () => {
  return (
    <Container>
      <Form method="post" className="form">
        <Logo />
        <h4>Register</h4>
        {/* NAME */}
        <FormComponent type="text" name="username" defaultValue="Steve7" />
        <FormComponent type="email" name="email" defaultValue="test@test.com" />
        <FormComponent type="text" name="name" defaultValue="Steve" />
        <FormComponent
          type="text"
          name="lastName"
          defaultValue="Brooks"
          labelText="Last Name"
        />
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
