import React, { useState } from 'react';
import {
  Form,
  redirect,
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
/**
 * Register page will have a registration form for the user should they choose to have an account
 * Using From component with 'action' post
 * @returns
 */
export const action = async ({ request }) => {
  const formData = await request.formData(); //react router interface for garbing the data from the form
  const data = Object.fromEntries(formData); //turn array of the arrays into the object
  try {
    await customFetch.post('/auth/register', data); //POST call with data payload
    return { success: true, email: data.email, msg: 'Registration Successful' };
    // toast.success(<CustomErrorToast message={'Registration Successful'} />);
    // return redirect('/login'); //function has to return something in this case a redirect
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
  const actionData = useActionData(); // access the response from our `action`
  const navigation = useNavigation(); //navigation hook allows you to interact with the navigation stack in a React
  //if the navigation state is 'submitting', isSubmitting is true; otherwise, it's false.
  const isSubmitting = navigation.state === 'submitting'; //variable isSubmitting and set its value based on the navigation state.
  const [isModalOpen, setModalOpen] = useState(false); //modal visibility
  const [userEmail, setUserEmail] = useState(''); //user’s email
  return (
    <Container>
      <SEO
        title="TrendFlow - Find Tech Trends"
        description="TrendFlow helps you track the latest trends in tech."
        keywords="AI, Trends, Analytics, TrendFlow"
        url="https://trendflowai.com/register"
        image="https://trendflowai.com/public/og-image.jpg"
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
        <VerifyCode initialEmail={userEmail} />
      </LandingModal>
    </Container>
  );
};

export default Register;
