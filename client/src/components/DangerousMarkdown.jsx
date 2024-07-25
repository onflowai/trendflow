import React from 'react';
import ReactMarkdown from 'react-markdown';
import styled, { css } from 'styled-components';

const DangerousMarkdown = ({ content, small }) => {
  return (
    <Container small={small}>
      <ReactMarkdown>{content}</ReactMarkdown>
    </Container>
  );
};

const Container = styled.div`
  ${(props) =>
    props.small
      ? css`
          p {
            font-size: 0.875rem;
            line-height: 1.25;
            color: var(--grey-700);
          }
          h1, h2, h3, h4, h5, h6 {
            display: none; /* Hide all header tags when small is true */
          }
        `
      : css`
          p {
            font-size: 1rem;
            line-height: 1.5;
            color: var(--grey-700);
          }
        `}
  pre {
    background: var(--grey-50);
    padding: 1rem;
    border-radius: 5px;
    overflow-x: auto;
  }
  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
  }
  blockquote {
    border-left: 4px solid var(--grey-50);
    padding-left: 1rem;
    color: var(--grey-600);
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
