import React from 'react';
import highlightKeywords from '../utils/dangerous_highlight';
import { keywordStyles } from '../utils/dangerous_keywords';
import Container from '../assets/wrappers/DangerousHTMLContainer';

// function highlightKeywords(html) {
//   const keywords = ['@import', 'div', '']; // Add more keywords as needed
//   keywords.forEach((keyword) => {
//     const regex = new RegExp(`(${keyword})`, 'gi');
//     html = html.replace(regex, '<span class="highlight">$1</span>');
//   });
//   return html;
// }
const DangerousHTML = ({ html }) => {
  const processedHtml = highlightKeywords(html, keywordStyles);
  return (
    <Container>
      <div
        className="html-content"
        dangerouslySetInnerHTML={{ __html: processedHtml }}
      />
    </Container>
  );
};

export default DangerousHTML;
