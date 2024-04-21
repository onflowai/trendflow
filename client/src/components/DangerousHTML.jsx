import React from 'react';
import Container from '../assets/wrappers/DangerousHTMLContainer';

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
