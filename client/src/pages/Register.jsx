import React from 'react';
import { Form, redirect, useNavigation, Link } from 'react-router-dom';
import Container from '../assets/wrappers/RegisterLoginPage';
import { Logo, FormComponent, CustomErrorToast } from '../components';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';
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
    toast.success(<CustomErrorToast message={'Registration Successful'} />);
    return redirect('/login'); //function has to return something in this case a redirect
  } catch (error) {
    toast.error(<CustomErrorToast message={error?.response?.data?.msg} />);
    // console.log(error);
    return error;
  }
};
const Register = () => {
  const navigation = useNavigation(); //navigation hook allows you to interact with the navigation stack in a React
  console.log(navigation);
  //if the navigation state is 'submitting', isSubmitting is true; otherwise, it's false.
  const isSubmitting = navigation.state === 'submitting'; //variable isSubmitting and set its value based on the navigation state.
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
        <button type="submit" className="btn btn-block" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
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
