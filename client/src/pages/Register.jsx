import React, { useState, useEffect } from 'react';
import {
  Form,
  redirect,
  useNavigate,
  useNavigation,
  Link,
  useActionData,
} from 'react-router-dom';
import Container from '../assets/wrappers/RegisterLoginPageContainer';
import {
  SEO,
  Logo,
  VerifyCode,
  LandingModal,
  FormComponent,
  CustomErrorToast,
} from '../components';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';
const FRONTEND_BASE_URL = import.meta.env.VITE_DEV_BASE_URL;
/**
 * Register page will have a registration form for the user should they choose to have an account
 * Using From component with 'action' post
 * @returns
 */
//helper to fetch CSRF token hits /api/v1/csrf-token route
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
  const formData = await request.formData(); //react router interface for garbing the data from the form
  const data = Object.fromEntries(formData); //turn array of the arrays into the object
  try {
    const csrfToken = await getCsrfToken(); //getting token
    const response = await customFetch.post('/auth/register', data, {
      headers: {
        'X-CSRF-Token': csrfToken,
      },
    }); // attempt register

    const { msg } = response.data;
    toast.success(msg);

    return { success: true, email: data.email, msg };
  } catch (error) {
    toast.error(
      <CustomErrorToast
        message={error?.response?.data?.msg || 'Registration failed.'}
      />
    );
    return error;
  }
};

const Register = () => {
  const navigate = useNavigate();
  const actionData = useActionData(); // access the response from our `action`
  const navigation = useNavigation(); //navigation hook allows you to interact with the navigation stack in a React
  //if the navigation state is 'submitting', isSubmitting is true; otherwise, it's false.
  const isSubmitting = navigation.state === 'submitting'; //variable isSubmitting and set its value based on the navigation state.
  const [isModalOpen, setModalOpen] = useState(false); //modal visibility
  const [userEmail, setUserEmail] = useState(''); //user’s email

  useEffect(() => {
    // if actionData indicates success, open modal and set email
    if (actionData?.success) {
      setModalOpen(true);
      setUserEmail(actionData.email);
    }
  }, [actionData]);

  //function handles code verification
  const handleVerifyCode = async ({ email, code, onResult }) => {
    try {
      const csrfToken = await getCsrfToken();
      const response = await customFetch.post(
        '/auth/verify-code',
        { email, code },
        { headers: { 'X-CSRF-Token': csrfToken } }
      );
      toast.success(response.data.message);
      onResult(response.data.message); // optional callback to update child
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (error) {
      const errMsg = error?.response?.data?.msg || 'Verification failed.';
      toast.error(errMsg);
      onResult(errMsg);
    }
  }; //end handleVerifyCode

  //resending email
  const handleResendEmail = async ({ email, onResult }) => {
    try {
      const csrfToken = await getCsrfToken();
      const response = await customFetch.post(
        '/auth/resend-email',
        { email },
        { headers: { 'X-CSRF-Token': csrfToken } }
      );
      toast.success(response.data.message || 'Verification email resent.');
      onResult(response.data.message);
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (error) {
      const errMsg = error?.response?.data?.msg || 'Resend failed.';
      toast.error(errMsg);
      onResult(errMsg);
    }
  };

  return (
    <Container>
      <SEO
        title="TrendFlow - Create Account"
        description="Register: TrendFlow and track the latest trends in tech."
        url={`${FRONTEND_BASE_URL}/register`}
        img_large={`${FRONTEND_BASE_URL}/public/og-image-register.jpg`}
        img_small={`${FRONTEND_BASE_URL}/public/og-image-register-twitter.jpg`}
      />
      <Form method="post" className="form">
        <Logo />
        <h4>Register</h4>
        {/* NAME */}
        <FormComponent type="text" name="username" defaultValue="Username" />
        <FormComponent
          type="email"
          name="email"
          defaultValue="email@email.com"
        />
        <FormComponent type="text" name="name" defaultValue="First Name" />
        <FormComponent
          type="text"
          name="lastName"
          defaultValue="Last Name"
          labelText="Last Name"
        />
        <FormComponent type="password" name="password" />
        <button type="submit" className="btn btn-block" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Register'}
        </button>
        <p>
          Already have an Account?
          <Link to="/login" className="member-btn">
            Login
          </Link>
        </p>
      </Form>
      <LandingModal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <VerifyCode
          initialEmail={userEmail}
          onVerify={handleVerifyCode}
          onResend={handleResendEmail}
        />
      </LandingModal>
    </Container>
  );
};

export default Register;
