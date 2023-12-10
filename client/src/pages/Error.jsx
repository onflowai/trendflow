import React from 'react';
import { Link, useRouteError } from 'react-router-dom';
import Container from '../assets/wrappers/ErrorPage';
import img from '../assets/images/test-error.svg';
/**
 * Simple Error page with useRouteError which give simple info about the errors such as "404", "",
 * @returns
 */
const Error = () => {
  const error = useRouteError();
  console.log(error);

  if (error.status === 404) {
    return (
      <Container>
        <div>
          <img src={img} alt="404 Error" />
          <h3>Something Went Wrong</h3>
          <p>The Page You Are Looking For Does not Exist</p>
          <Link to="/dashboard"> Go Back Home</Link>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div>
        <h3>Something Went Wrong</h3>
      </div>
    </Container>
  );
};

export default Error;
