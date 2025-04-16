import React, { useLayoutEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css'; // Choose the GitHub style
import styled, { css } from 'styled-components';

const DangerousMarkdown = ({ content, small, blogPage }) => {
  useLayoutEffect(() => {
    const codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach((block) => {
      block.removeAttribute('data-highlighted');
      hljs.highlightElement(block);
    }); // use useLayoutEffect so highlighting runs immediately after DOM mutations.
  }, [content, small, blogPage]); // re-run if either the content or the layout changes

  return (
    <Container $small={small ? true : undefined} $blogPage={blogPage}>
      <ReactMarkdown
        key={`markdown-${small ? 'small' : 'large'}`}
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

const Container = styled.div`
  ${({ $small }) =>
    $small
      ? css`
          p {
            font-size: 0.875rem;
            line-height: 1.25;
            color: var(--grey-700);
          }
        `
      : css`
          p {
            font-size: 1rem;
            line-height: 1.5;
            color: var(--grey-700);
            margin-bottom: 1rem;
          }
        `}

  ${({ $blogPage }) =>
    $blogPage &&
    css`
      h1,
      h2,
      h3,
      h4,
      h5,
      h6,
      ul,
      ol,
      blockquote,
      pre,
      code {
        display: inline;
        font-size: inherit;
        background: none;
        padding: 0;
        margin: 0;
        border: none;
        color: inherit;
        font-family: inherit;
      }

      p {
        display: inline;
        font-size: inherit;
        line-height: inherit;
        margin: 0;
        color: inherit;
      }

      a {
        color: var(--primary);
        text-decoration: none;
      }

      a:hover {
        text-decoration: underline;
      }
      pre,
        code {
          display: none;
        }
    `}

  h1 {
    margin-top: 2rem;
    margin-bottom: 1rem;
    line-height: 1.3;
    color: var(--blog-text-heading-h1-color);
  }

  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-top: 1rem;
    margin-bottom: 0.5rem;
    line-height: 1.3;
    color: var(--blog-text-headings-color);
  }

  ul,
  ol {
    padding-left: 1rem;
    margin-bottom: 1rem;
  }

  li {
    margin-bottom: 0.5rem;
    line-height: 1.5;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
    background-color: var(--blog-code-block-background);
    border-radius: 5px;
    padding: 15px;
    display: block;
    white-space: pre-wrap;
    word-wrap: break-word;
    margin: 10px 0;
    overflow-x: auto;
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
