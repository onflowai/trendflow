import React from 'react';
import Container from '../assets/wrappers/LoadingContainer';
//loading view created using css
const Loading = () => {
  return (
    <Container>
      <div className="loading-overlay">
        <div className="loading"></div>
      </div>
    </Container>
  );
};

export default Loading;
