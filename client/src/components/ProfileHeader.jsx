import React from 'react';
import Container from '../assets/wrappers/ProfileHeaderContainer';

function ProfileHeader({ user }) {
  return (
    <Container>
      <div>
        <header>
          <h3>Welcome Back, {user.name} </h3>
          <h5>Here is the information about all your trends</h5>
        </header>
      </div>
    </Container>
  );
}

export default ProfileHeader;
