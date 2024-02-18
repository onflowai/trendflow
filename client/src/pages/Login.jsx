import React from 'react';
import { Link, Form, redirect, useNavigation } from 'react-router-dom';
import Container from '../assets/wrappers/RegisterLoginPage';
import { Logo, FormComponent, CustomErrorToast } from '../components';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';
/**
 * Login page uses react Form with method='post' to collect data in formData and using custom axios API posted to backend
 * @returns
 */
export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  try {
    await customFetch.post('/auth/login', data);
    toast.success(<CustomErrorToast message={'Login Successful'} />);
    return redirect('/dashboard');
  } catch (error) {
    toast.error(<CustomErrorToast message={error?.response?.data?.msg} />);
  }
  return null;
};
const Login = () => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  return (
    <Container>
      <Form method="post" className="form">
        <Logo />
        <h4>Login</h4>
        <FormComponent type="email" name="email" defaultValue="test@test.com" />
        <FormComponent
          type="password"
          name="password"
          defaultValue="password123"
        />
        <button type="submit" className="btn btn-block" disabled={isSubmitting}>
          {isSubmitting ? 'Signing In' : 'Sign In'}
        </button>
        <button type="submit" className="btn btn-color btn-block">
          Create Account Later
        </button>
      </Form>
    </Container>
  );
};

export default Login;
