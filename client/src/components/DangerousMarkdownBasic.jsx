import React, { useLayoutEffect, useEffect, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import hljs from 'highlight.js';
import styled, { css } from 'styled-components';
import lightThemeCss from 'highlight.js/styles/github.css?raw';
import darkThemeCss from 'highlight.js/styles/github-dark.css?raw';

const cleanMarkdown = (content = '') => {
  return String(content)
    .replace(/\r\n/g, '\n')
    .replace(/^\n+/, '')
    .replace(/\n+$/, '');
};

const DangerousMarkdownBasic = ({
  content,
  small,
  blogPage,
  legalPage,
  isDarkTheme,
}) => {
  const cleanedContent = useMemo(() => {
    return cleanMarkdown(content); //keeping markdown structure stable
  }, [content]);

  useLayoutEffect(() => {
    const codeBlocks = document.querySelectorAll('pre code');

    codeBlocks.forEach((block) => {
      block.removeAttribute('data-highlighted');
      hljs.highlightElement(block);
    });
  }, [cleanedContent, small, blogPage, legalPage]);

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
    <Container
      $small={small ? true : undefined}
      $blogPage={blogPage}
      $legalPage={legalPage}
    >
      <ReactMarkdown
        components={{
          code({ className, children, ...props }) {
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

            return (
              <code className="code-inline" {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {cleanedContent}
      </ReactMarkdown>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  color: var(--text-color);
  line-height: 1.75;

  h1,
  h2,
  h3,
  h4 {
    color: var(--text-color);
    line-height: 1.25;
    margin: 1.4rem 0 0.75rem;
  }

  h1:first-child,
  h2:first-child,
  h3:first-child {
    margin-top: 0;
  }

  h1 {
    font-size: clamp(1.7rem, 4vw, 2.4rem);
  }

  h2 {
    font-size: clamp(1.25rem, 3vw, 1.65rem);
    padding-top: 0.75rem;
    border-top: 1.5px solid var(--grey-50); //separates legal sections
  }

  h2:first-child {
    border-top: none;
    padding-top: 0;
  }

  p {
    margin: 0 0 1rem;
    color: var(--grey-500);
  }

  ul,
  ol {
    margin: 0 0 1rem 1.25rem;
    color: var(--grey-500);
  }

  li {
    margin-bottom: 0.45rem;
  }

  strong {
    color: var(--text-color);
  }

  a {
    color: var(--primary-500);
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  pre {
    overflow-x: auto;
    padding: 1rem;
    border-radius: 8px;
    border: 1.5px solid var(--grey-50);
  }

  code.code-inline {
    padding: 0.15rem 0.35rem;
    border-radius: 4px;
    background: var(--grey-50);
    color: var(--text-color);
  }

  ${({ $legalPage }) =>
    $legalPage &&
    css`
      max-width: 850px;

      p {
        font-size: 0.96rem;
      }

      h1 {
        margin-bottom: 0.9rem;
      }

      h2 {
        margin-top: 2rem;
      }
    `}
`;

export default DangerousMarkdownBasic;