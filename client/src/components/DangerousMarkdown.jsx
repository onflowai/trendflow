import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css'; // Choose the GitHub style
import styled, { css } from 'styled-components';

const DangerousMarkdown = ({ content, small }) => {
  useEffect(() => {
    // Initialize highlight.js to highlight code blocks
    hljs.highlightAll();
  }, [content]); // Re-run effect when content changes

  return (
    <Container small={small}>
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }) {
            return !inline ? (
              <pre>
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </Container>
  );
};
//Small Prop is passed when used in the
const Container = styled.div`
  ${(props) =>
    props.small
      ? css`
          p {
            font-size: 0.875rem;
            line-height: 1.25;
            color: var(--grey-700);
          }
          h1,
          h2,
          h3,
          h4,
          h5,
          h6 {
            display: none; /* Hide all header tags when small is true */
          }
        `
      : css`
          p {
            font-size: 1rem;
            line-height: 1.5;
            color: var(--grey-700);
            margin-bottom: 1rem
          }
        `}
  h1 {
    margin-top: 2rem;
    margin-bottom: 1rem;
    line-height: 1.3;
    color: var(--blog-text-heading-h1-color);
  }

  h2, h3, h4, h5, h6 {
    margin-top: 1rem;
    margin-bottom: 0.5rem;
    line-height: 1.3;
    color: var(--blog-text-headings-color);
  }

  ul, ol {
    padding-left: 2rem;
    margin-bottom: 1rem;
  }

  li {
    margin-bottom: 0.5rem;
    line-height: 1.5;
  }
  
  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
  }
  code {
      background-color: var(--blog-code-block-background); // background moded dark / light mode
      border-radius: 5px; // Rounded corners
      padding: 15px; // Padding inside the code box
      display: block; // Ensure block-level display
      white-space: pre-wrap; // Maintains whitespace formatting
      word-wrap: break-word; // Ensures long lines do not overflow
      margin: 10px 0; // Space above and below the code block
      overflow-x: auto; // Allow horizontal scrolling for long code lines
    }
  
  blockquote {
    border-left: 4px solid var(--grey-300);
    padding-left: 1rem;
    margin: 1.5rem 0;
    color: var(--grey-600);
    font-style: italic;
    background-color: var(--grey-50);
  }
  a {
    color: var(--primary);
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
`;

export default DangerousMarkdown;
