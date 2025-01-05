import { JSDOM } from 'jsdom';
import createDOMPurify from 'dompurify';
import validator from 'validator';

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

/**
 * Validates and sanitizes a string input.
 * @param {string} input The input string to validate and sanitize.
 * @return {string|null} The sanitized input or null if invalid.
 */
export const validateAndSanitize = (input) => {
  if (
    input &&
    typeof input === 'string' &&
    validator.isLength(input, { min: 1, max: 100 })
  ) {
    return sanitizeHTML(input);
  }
  return null;
};
