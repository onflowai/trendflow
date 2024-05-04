import styled from 'styled-components';

const Container = styled.section`
  background-color: transparent; // Ensure no background color if it was gray

  .html-content h1, .html-content h2 {
    color: #333;
    font-family: Arial, sans-serif;
  }

  .html-content p {
    color: #666;
    font-size: 16px;
    line-height: 1.6;
  }

  .html-content ol {
    margin-left: 20px;
  }

  .html-content li {
    margin-bottom: 10px;
  }

  .html-content {
    display: inline-block;
    padding: 10px 15px;
    text-decoration: none;
    border-radius: 5px;
  }
  /* CODE HIGHLIGHTING */
  .highlight-one {
      color: var(--primary2-800);
    font-weight: bold;
  }

  .highlight-two {
      color: var(--primary-800);
    font-weight: bold;
  }

  .highlight-three {
      color: var(--primary3-900);
    font-weight: bold;
  }

  /* CODE ELEMENT STYLING */
  .html-content code {
    background-color: var(--grey-50); // Light gray background
    border-radius: 5px; // Rounded corners
    padding: 15px 15px; // Padding inside the code box
    display: block; // appear on a new line
    white-space: pre-wrap; // Maintains whitespace formatting
    word-wrap: break-word; // Ensures long lines do not overflow
    margin: 10px 0; // Space above and below the code block
    font-family: Menlo; // Monospace font for code
  }
  /* p > code,
  li > code,
  dd > code,
  td > code {
  background: #ffeff0;
  word-wrap: break-word;
  box-decoration-break: clone;
  padding: .1rem .3rem .2rem;
  border-radius: .2rem;
    } */
`;
export default Container;
