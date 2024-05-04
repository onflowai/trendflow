import React, { useEffect } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/default.css'; // Choose a style that suits your application
import Container from '../assets/wrappers/DangerousHTMLContainer';
import 'highlight.js/styles/github.css';

const DangerousHTML = ({ html }) => {
  useEffect(() => {
    // Initialize highlight.js to highlight code blocks
    hljs.highlightAll();
  }, [html]); // Re-run effect when HTML content changes

  return (
    <Container>
      <div
        className="html-content"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </Container>
  );
};

export default DangerousHTML;
