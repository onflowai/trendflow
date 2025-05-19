import React, { useLayoutEffect, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import hljs from 'highlight.js';
//import 'highlight.js/styles/github-dark.css'; // Choose the GitHub style
import styled, { css } from 'styled-components';
import lightThemeCss from 'highlight.js/styles/github.css?raw';
import darkThemeCss from 'highlight.js/styles/github-dark.css?raw';

const DangerousMarkdown = ({ content, small, blogPage, isDarkTheme }) => {
  useLayoutEffect(() => {
    const codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach((block) => {
      block.removeAttribute('data-highlighted');
      hljs.highlightElement(block);
    }); // use useLayoutEffect so highlighting runs immediately after DOM mutations.
  }, [content, small, blogPage]); // re-run if either the content or the layout changes
  console.log('content', content);
  useEffect(() => {
    let style = document.getElementById('hljs-theme-style');
    if (!style) {
      style = document.createElement('style');
      style.id = 'hljs-theme-style';
      document.head.appendChild(style);
    }
    style.textContent = isDarkTheme ? darkThemeCss : lightThemeCss;
  }, [isDarkTheme]);
  return (
    <Container $small={small ? true : undefined} $blogPage={blogPage}>
      <ReactMarkdown
        components={{
          code({ className, children, ...props }) {
            // detect true code blocks by language-*
            const isBlock = /\blanguage-\w+\b/.test(className || '');

            if (isBlock) {
              return (
                <pre>
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
              );
            }

            // everything else is inline
            return (
              <code className="code-inline" {...props}>
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
  /* ---------- blog page ---------- */
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
      blockquote {
        display: inline;
        font-size: inherit;
        background: none;
        padding: 0;
        margin: 0;
        border: none;
        color: inherit;
        font-family: inherit;
      },
      //pre,
      /* code {
        //display: inline;
        font-size: inherit;
        background: none;
        padding: 0;
        margin: 0;
        border: none;
        color: inherit;
        font-family: inherit;
      } */

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
        /* explicitly handle these correctly below, don't inline here */
        display: initial;
      }
    `}
  /* ---------- headings ---------- */
  h1 {
  margin-top: 2rem;
  margin-bottom: 1rem;
  line-height: 1.3;
  color: var(--blog-text-heading-h1-color);
  font-size: 2.2rem;
  font-weight: 700;
}

h2 {
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  line-height: 1.25;
  color: var(--blog-text-headings-color);
  font-size: 1.7rem;
  font-weight: 600;
}

h3 {
  margin-top: 1.2rem;
  margin-bottom: 0.8rem;
  line-height: 1.2;
  color: var(--blog-text-headings-color);
  font-size: 1.3rem;
  font-weight: 600;
}
h4,
h5,
h6 {
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  line-height: 1.2;
  color: var(--blog-text-headings-color);
  font-size: 1.1rem;
  font-weight: 500;
}
  h1 code.code-inline,
  h2 code.code-inline,
  h3 code.code-inline,
  h4 code.code-inline,
  h5 code.code-inline,
  h6 code.code-inline {
  font-size: inherit;
  padding: 0 4px;
}
  /* ---------- lists ---------- */
  ul,
  ol {
    padding-left: 1rem;
    margin-bottom: 1rem;
  }

  li {
    margin-bottom: 0.5rem;
    line-height: 1.5;
  }
  /* .dark-theme pre > code.hljs,
  .dark-theme pre > code.hljs span {
  background: initial !important;
  } */
  /* ---------- inline code ---------- */
    code.code-inline {
    display: inline-block;   
    padding: 2px 6px;
    background-color: var(--code-inline-backtick-background);
    color: var(--code-inline-backtick-color);
    border-radius: 4px;
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
    font-size: 0.875rem;
    white-space: nowrap;
  }
   pre > code {
    display: block;
    background-color: var(--blog-code-block-background);
    padding: 15px;
    border-radius: 5px;
    margin: 10px 0;
    overflow-x: auto;
     white-space: pre !important;
    word-wrap: break-word;
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
  }
  /* ---------- blockquote ---------- */
  blockquote {
    border-left: 4px solid var(--grey-300);
    padding-left: 1rem;
    margin: 1.5rem 0;
    color: var(--grey-600);
    font-style: italic;
    background-color: var(--grey-50);
  }
  /* ---------- links ---------- */
  a {
    color: var(--primary);
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
`;

export default DangerousMarkdown;
