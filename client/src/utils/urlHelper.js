const FRONTEND_BASE_URL = import.meta.env.VITE_DEV_BASE_URL || '';// frontend website base
const ASSET_CDN_BASE = import.meta.env.VITE_ASSET_CDN_BASE || '';// asset cdn base for icons/svgs
const GITHUB_URL = import.meta.env.VITE_GITHUB_URL || '';
const FULL_GITHUB_URL = import.meta.env.VITE_FULL_GITHUB_URL || '';
const isAbsoluteUrl = (value) => /^(https?:)?\/\//i.test(String(value || ''));// helper to detect already absolute urls so we do not prepend twice

const joinUrl = (base, path) => {
  const safeBase = String(base || '').replace(/\/+$/, '');
  const safePath = String(path || '').startsWith('/') ? String(path || '') : `/${String(path || '')}`;
  return `${safeBase}${safePath}`;
};// helper to safely join base + path

export const getFullIconUrl = (iconUrl) => {
  const value = String(iconUrl || '').trim();
  if (!value) return '';
  if (isAbsoluteUrl(value)) return value;//leave absolute urls alone (cloudinary/r2/full urls/etc.)

  if (import.meta.env.DEV && !ASSET_CDN_BASE) {
    return value;//in dev keep local relative assets unless you explicitly set a cdn base
  }
  if (ASSET_CDN_BASE) {
    return joinUrl(ASSET_CDN_BASE, value);// if cdn base exists, use it in prod (and optionally dev)
  }
  return FRONTEND_BASE_URL ? joinUrl(FRONTEND_BASE_URL, value) : value;// final fallback to frontend base if needed
};// icons/assets url

export const getFullTrendUrl = (slug) =>
  `${FRONTEND_BASE_URL}/dashboard/trend/${slug}`;//trend detail page url stays on the app domain

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