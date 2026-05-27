export const normalizeSpaces = (s = '') => s.trim().replace(/\s+/g, ' ');

export const toKey = (value = '') => {
  const clean = normalizeSpaces(value);
  const alnumSpace = clean.replace(/[^a-zA-Z0-9 ]/g, '');//keep letters/numbers/spaces only, then snake-case it
  return alnumSpace
    .trim()
    .replace(/\s+/g, '_')
    .toUpperCase();
};

export const toFileName = (value = '') => {
  const clean = normalizeSpaces(value);
  // Keep letters/numbers/spaces only, then kebab-case it
  const alnumSpace = clean.replace(/[^a-zA-Z0-9 ]/g, '');
  const kebab = alnumSpace
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-');
  return `${kebab}.svg`;
};