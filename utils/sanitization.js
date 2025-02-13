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
}; //end sanitizeHTML

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
}; //end validateAndSanitize

/**
 * Validates a token ensuring it is a string containing only alphanumeric characters and hyphens.
 * Throws a BadRequestError if invalid.
 * @param {any} token The token to validate.
 * @returns {string} The validated token.
 * @throws {BadRequestError} If the token format is invalid.
 */
export const validateToken = (token) => {
  const isValidToken =
    typeof token === 'string' && /^[a-zA-Z0-9-]+$/.test(token);
  if (!isValidToken) {
    throw new BadRequestError('Invalid token format.');
  }
  return token;
}; //end validateToken

/**
 * validates that the provided email is in a proper format
 * @param {any} email email to validate
 * @returns {string} validated email
 * @throws {BadRequestError} if the email format is invalid
 */
export const validateEmail = (email) => {
  if (!validator.isEmail(email)) {
    throw new BadRequestError('Invalid email format.');
  }
  return email;
}; //end validateEmail
