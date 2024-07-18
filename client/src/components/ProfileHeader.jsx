import React from 'react';
import Container from '../assets/wrappers/ProfileHeaderContainer';

function ProfileHeader({ user, message }) {
  return (
    <Container>
      <div>
        <header>
          <h3>Welcome Back, {user.name} </h3>
          <h5>{message}</h5>
        </header>
      </div>
    </Container>
  );
}

export default ProfileHeader;
