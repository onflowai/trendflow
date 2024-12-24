import styled from 'styled-components';

const Container = styled.section`
  .html-content {
    display: block;
    padding: 10px 15px;
    text-decoration: none;
    border-radius: 5px;
    overflow-wrap: break-word; // Handle long words or URLs
    word-wrap: break-word; // Ensure long words break correctly
    max-width: 100%; // Ensure it does not exceed container width
    box-sizing: border-box; // Include padding in width calculation

    h1, h2 {
      background: linear-gradient(to right, var(--primary-800), var(--primary-200));
      font-family: Arial, sans-serif;
      background-clip: text; // For non-WebKit browsers
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      color: transparent; 
      margin-bottom: 20px;
    }

    h3 {
      margin-bottom: 10px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }

    p {
      color: var(--grey-700);
      font-size: 16px;
      line-height: 1.6;
      margin-bottom: 10px;
    }

    ol {
      margin-left: 20px;
    }

    li {
      margin-bottom: 10px;
    }

    code {
      background-color: var(--code-box-background); // Light gray background
      border: 1.5px solid var(--code-box-border-color);
      border-radius: 5px; // Rounded corners
      padding: 15px; // Padding inside the code box
      display: block; // Ensure block-level display
      white-space: pre-wrap; // Maintains whitespace formatting
      word-wrap: break-word; // Ensures long lines do not overflow
      margin: 10px 0; // Space above and below the code block
      font-family: 'Menlo', 'Monaco', 'Courier New', monospace; // Monospace font for code
      overflow-x: auto; // Allow horizontal scrolling for long code lines
    }
  }

  .language-none {
    background-color: var(--grey-50);
    border: 1px solid var(--grey-70);
    padding: 10px;
    font-family: monospace;
    color: var(--grey-700);
  }

  .hljs {
  color: var(--code-box-text-color);
  }
`;
export default Container;
