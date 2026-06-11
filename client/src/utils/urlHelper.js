const ASSET_CDN_BASE = import.meta.env.VITE_ASSET_CDN_BASE || '';// asset cdn base for icons/svgs
const GITHUB_URL = import.meta.env.VITE_GITHUB_URL || '';
const FULL_GITHUB_URL = import.meta.env.VITE_FULL_GITHUB_URL || '';

const isAbsoluteUrl = (value) =>
  /^(https?:)?\/\//i.test(String(value || '')) ||
  String(value || '').startsWith('data:') ||
  String(value || '').startsWith('blob:');
// helper to detect already absolute urls so we do not prepend twice

const joinUrl = (base, path) => {
  const safeBase = String(base || '').replace(/\/+$/, '');
  const safePath = String(path || '').startsWith('/')
    ? String(path || '')
    : `/${String(path || '')}`;

  return `${safeBase}${safePath}`;
};// helper to safely join base + path

export const getFullIconUrl = (iconUrl) => {
  const value = String(iconUrl || '').trim();

  if (!value) return '';
  if (isAbsoluteUrl(value)) return value;// leave absolute urls alone (cloudinary/r2/full urls/data/blob/etc.)

  if (ASSET_CDN_BASE) {
    return joinUrl(ASSET_CDN_BASE, value);// if cdn base exists, use it for icons/assets
  }

  return value.startsWith('/') ? value : `/${value}`;// final fallback keeps assets same-origin for docker/staging/local/prod
};// icons/assets url

export const getFullTrendUrl = (slug) => {
  const safeSlug = String(slug || '').trim();
  return `/dashboard/trend/${safeSlug}`;// trend detail page stays on the current app/domain
};

export const githubUrl = () => {
  return GITHUB_URL;
};// github url

export const githubFullUrl = () => {
  return FULL_GITHUB_URL;
};// https github url

export const normalizeUrlForSend = (raw) => {
  const val = String(raw || '').trim();
  if (!val) return val;
  if (!/^https?:\/\//i.test(val)) return `https://${val}`;
  return val;
};// https validation

export const normalizeUrlForOpen = (raw) => {
  const val = String(raw || '').trim();
  if (!val) return '';
  if (!/^https?:\/\//i.test(val)) return `https://${val}`;

  try {
    new URL(val);
    return val;
  } catch {
    return '';
  }
};