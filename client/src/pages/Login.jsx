import React, { useState, useEffect } from 'react';
import {
  Form,
  redirect,
  useNavigation,
  useActionData,
  useNavigate,
  Link,
} from 'react-router-dom';
import Container from '../assets/wrappers/RegisterLoginPageContainer';
import {
  SEO,
  Logo,
  FormComponent,
  CustomErrorToast,
  CustomSuccessToast,
} from '../components';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';
const FRONTEND_BASE_URL = import.meta.env.VITE_DEV_BASE_URL;

/**
 * Login page uses react Form with method='post' to collect data in formData and using custom axios API posted to backend
 * @returns
 */
const getCsrfToken = async () => {
  try {
    const response = await customFetch.get('/csrf-token');
    return response.data.csrfToken;
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
    throw error;
  }
};

export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const errors = { msg: '' }; // Setting up custom error for password if it is too short
  if (data.password.length < 3) {
    errors.msg = 'Password is too short';
    return errors;
  }
  try {
    const csrfToken = await getCsrfToken();

    // Then, include the token in the headers of your POST request.
    const response = await customFetch.post('/auth/login', data, {
      headers: {
        'X-CSRF-Token': csrfToken,
      },
    });
    toast.success(<CustomSuccessToast message={'Login Successful'} />);
    // No need to store the token manually since it's handled via HTTP Only cookies
    return redirect('/dashboard');
  } catch (error) {
    toast.error(<CustomErrorToast message={error?.response?.data?.msg} />);
  }
  return null;
};

const Login = () => {
  const navigate = useNavigate();
  const guestUser = async () => {
    try {
      const csrfToken = await getCsrfToken();
      await customFetch.post(
        '/auth/guest-login',
        {},
        {
          headers: {
            'X-CSRF-Token': csrfToken,
          },
        }
      ); // calling guest login endpoint
      toast.success(
        <CustomSuccessToast message={'Welcome to trendFlow as Guest'} />
      );
      return navigate('/dashboard');
    } catch (error) {
      toast.error(<CustomErrorToast message={error?.response?.data?.msg} />);
    }
  }; //guestUser signs in using guestLogin controller
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  const errors = useActionData(); //
  const [showError, setShowError] = useState(false);
  useEffect(() => {
    //automatically reset and potentially trigger the fade-in effect
    //whenever actionData is updated and contains an error message.
    if (errors?.msg) {
      setShowError(false); // reset to ensure the fade-in effect can be re-triggered.
      setTimeout(() => setShowError(true), 10); // Short delay to trigger CSS transition
    }
  }, [errors]);
  return (
    <Container>
      <SEO
        title="TrendFlow - Find Tech Trends"
        description="TrendFlow helps you track the latest trends in tech."
        url={`${FRONTEND_BASE_URL}/login`}
        image={`${FRONTEND_BASE_URL}/public/og-image.jpg`}
      />
      <Form method="post" className="form">
        <Logo />
        <h4>Login</h4>
        {errors?.msg && (
          <p className={`fade-in ${showError ? 'visible' : ''}`}>
            {errors.msg}
          </p>
        )}
        <FormComponent type="email" name="email" />
        <FormComponent type="password" name="password" />
        <button type="submit" className="btn btn-block" disabled={isSubmitting}>
          {isSubmitting ? 'Signing In' : 'Sign In'}
        </button>
        <button
          type="button"
          className="btn btn-color btn-block"
          onClick={guestUser}
        >
          Create Account Later
        </button>
        <p>
          Don't have an Account?
          <Link to="/register" className="member-btn">
            Create
          </Link>
        </p>
      </Form>
    </Container>
  );
};

export default Login;
