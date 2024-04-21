// utils/sanitization.js
import { JSDOM } from 'jsdom';
import createDOMPurify from 'dompurify';

const { window } = new JSDOM('');
const DOMPurify = createDOMPurify(window);

/**
 * Sanitizes HTML content to prevent XSS attacks.
 * @param {string} html The HTML content to sanitize.
 * @return {string} The sanitized HTML content.
 */
export const sanitizeHTML = (html) => {
  return DOMPurify.sanitize(html);
};
