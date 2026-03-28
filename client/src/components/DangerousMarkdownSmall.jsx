// File: client/src/components/DangerousMarkdownSmall.jsx

import React, { useLayoutEffect, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import hljs from 'highlight.js';
import styled from 'styled-components';
import lightThemeCss from 'highlight.js/styles/github.css?raw';
import darkThemeCss from 'highlight.js/styles/github-dark.css?raw';

const DangerousMarkdownSmall = ({ content, isDarkTheme }) => {
  const wrapRef = useRef(null);

  useLayoutEffect(() => {
    // Only highlight inside this component, not the entire page
    const root = wrapRef.current;
    if (!root) return;

    const codeBlocks = root.querySelectorAll('pre code');
    codeBlocks.forEach((block) => {
      block.removeAttribute('data-highlighted');
      hljs.highlightElement(block);
    });
  }, [content]);

  useEffect(() => {
    // reuse same style tag id for hljs theme across app (same as your big component)
    let style = document.getElementById('hljs-theme-style');
    if (!style) {
      style = document.createElement('style');
      style.id = 'hljs-theme-style';
      document.head.appendChild(style);
    }
    style.textContent = isDarkTheme ? darkThemeCss : lightThemeCss;
  }, [isDarkTheme]);

  return (
    <Container ref={wrapRef}>
      <ReactMarkdown
        components={{
          a({ href, children, ...props }) {
            const safeHref = safeLink(href);
            if (!safeHref) {
              return <span {...props}>{children}</span>;
            }
            return (
              <a href={safeHref} target="_blank" rel="noopener noreferrer" {...props}>
                {children}
              </a>
            );
          },
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
        {String(content || '')}
      </ReactMarkdown>
    </Container>
  );
};

export default DangerousMarkdownSmall;

// Allow only safe protocols. Blocks javascript:, data:, etc.
const safeLink = (href) => {
  const raw = String(href || '').trim();
  if (!raw) return '';

  // allow relative links
  if (raw.startsWith('/')) return raw;

  // allow anchors
  if (raw.startsWith('#')) return raw;

  try {
    const url = new URL(raw, window.location.origin);
    const protocol = url.protocol.toLowerCase();
    if (protocol === 'http:' || protocol === 'https:' || protocol === 'mailto:') {
      return url.href;
    }
    return '';
  } catch {
    return '';
  }
};

const Container = styled.div`
  border: 1.5px solid var(--primary-400);
  background-color: var(--content-box-highlighted);
  padding: 1rem;
  border-radius: var(--border-radius);
  margin: 1rem;

  @media (max-width: 991px) {
    width: calc(100% - 0rem);
    margin: 0;
    padding: 1rem;
    box-sizing: border-box;
  }

  p {
    font-size: 0.95rem;
    line-height: 1.45;
    color: var(--grey-700);
    margin-bottom: 0.75rem;
  }

  p:last-child {
    margin-bottom: 0;
  }

  /* inline code */
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

  /* code blocks */
  pre > code {
    display: block;
    background-color: var(--blog-code-block-background);
    padding: 12px;
    border-radius: 6px;
    margin: 10px 0;
    overflow-x: auto;
    white-space: pre !important;
    word-wrap: break-word;
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
    font-size: 0.875rem;
  }

  /* links */
  a {
    color: var(--primary);
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }

  /* lists */
  ul,
  ol {
    padding-left: 1.1rem;
    margin-bottom: 0.75rem;
  }

  li {
    margin-bottom: 0.35rem;
    line-height: 1.4;
  }
`;