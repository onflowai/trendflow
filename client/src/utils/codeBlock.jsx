import React from 'react';

//simple HTML escape function
const escapeHtml = (unsafe) => {
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

const CodeBlock = ({ node, inline, className, children, ...props }) => {
  if (!inline) {
    const code = children.join(''); // children is an array, so we join it into a string
    const sanitizedCode = escapeHtml(code); // escaping the code so that any HTML is converted to safe entities
    return (
      <pre>
        <code
          className={className}
          {...props}
          dangerouslySetInnerHTML={{ __html: sanitizedCode }} // inserting sanitized code as HTML
        />
      </pre>
    );
  }
  // for inline code can be escaped or just render normally:
  return (
    <code className={className} {...props}>
      {escapeHtml(children.join(''))}
    </code>
  );
};

export default CodeBlock;
