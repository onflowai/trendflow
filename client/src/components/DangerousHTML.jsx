import React from 'react';
import Container from '../assets/wrappers/CustomErrorToastContainer';

function DangerousHTML({ html }) {
  return (
    <Container>
      <div
        className="html-content"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </Container>
  );
}

export default DangerousHTML;
