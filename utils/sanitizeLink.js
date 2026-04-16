/**
 * sanitizeOfficialLink used to sanitize the official trend link generated but can edited
 * @param {*} input 
 * @returns 
 */
export function sanitizeOfficialLink(input) {
  if (!input) return '';// empty/null/undefined -> store nothing
  const raw = String(input).trim();// force string + remove surrounding whitespace
  if (!raw) return '';// blank string -> store nothing
  if (raw.length > 500) return '';// hard cap to avoid junk payloads

  try {
    const url = new URL(raw);// parse URL using WHATWG URL parser
    const proto = url.protocol.toLowerCase();// normalize protocol for comparison

    if (proto !== 'https:' && proto !== 'http:') return '';// block javascript:, data:, file:, etc.

    url.username = '';// strip credentials if someone tries https://user:pass@site.com
    url.password = '';// strip credentials if present
    url.hash = '';// drop fragments (#section) to reduce tracking junk

    return url.toString();// return normalized safe URL string
  } catch {
    return '';// invalid URL format -> store nothing
  }// URL parsing can throw if invalid
}