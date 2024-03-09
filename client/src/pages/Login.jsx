import React, { useState, useEffect } from 'react';
import {
  Link,
  Form,
  redirect,
  useNavigation,
  useActionData,
} from 'react-router-dom';
import Container from '../assets/wrappers/RegisterLoginPageContainer';
import {
  Logo,
  FormComponent,
  CustomErrorToast,
  CustomSuccessToast,
} from '../components';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';
/**
 * Login page uses react Form with method='post' to collect data in formData and using custom axios API posted to backend
 * @returns
 */
export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const errors = { msg: '' }; //setting up custom error for password if it is too short
  if (data.password.length < 3) {
    errors.msg = 'Password is too short';
    return errors;
  }
  try {
    await customFetch.post('/auth/login', data);
    toast.success(<CustomSuccessToast message={'Login Successful'} />);
    return redirect('/dashboard');
  } catch (error) {
    toast.error(<CustomErrorToast message={error?.response?.data?.msg} />);
  }
  return null;
};
const Login = () => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  const errors = useActionData(); //
  const [showError, setShowError] = useState(false);
  useEffect(() => {
    // Automatically reset and potentially trigger the fade-in effect
    // whenever actionData is updated and contains an error message.
    if (errors?.msg) {
      setShowError(false); // reset to ensure the fade-in effect can be re-triggered.
      setTimeout(() => setShowError(true), 10); // Short delay to trigger CSS transition
    }
  }, [errors]);
  return (
    <Container>
      <Form method="post" className="form">
        <Logo />
        <h4>Login</h4>
        {errors?.msg && (
          <p className={`fade-in ${showError ? 'visible' : ''}`}>
            {errors.msg}
          </p>
        )}
        <FormComponent
          type="email"
          name="email"
          defaultValue="steven3@gmail.com"
        />
        <FormComponent
          type="password"
          name="password"
          defaultValue="Sammuel1234"
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
