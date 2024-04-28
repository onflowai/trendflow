const highlightKeywords = (html, keywordStyles) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const codeElements = doc.querySelectorAll('code');

  codeElements.forEach((code) => {
    Object.entries(keywordStyles).forEach(([className, keywords]) => {
      keywords.forEach((keyword) => {
        const regex = new RegExp(`\\b(${keyword})\\b`, 'gi');
        code.innerHTML = code.innerHTML.replace(
          regex,
          `<span class="${className}">$1</span>`
        );
      });
    });
  });

  return doc.body.innerHTML; // Serialize the HTML content of the parsed document back to a string
};

export default highlightKeywords;
