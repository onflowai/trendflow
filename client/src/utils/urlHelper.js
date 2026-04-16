//const API_BASE_URL = import.meta.env.VITE_DEV_API_BASE_URL || '';
const FRONTEND_BASE_URL = import.meta.env.VITE_DEV_BASE_URL || '';
const GITHUB_URL = import.meta.env.VITE_GITHUB_URL || '';
const FULL_GITHUB_URL = import.meta.env.VITE_FULL_GITHUB_URL || '';

//API URL
//export const getFullIconUrl = (iconUrl) => `${API_BASE_URL}${iconUrl}`;
//export const getFullIconUrl = (iconUrl) => `${iconUrl}`;
export const getFullIconUrl = (iconUrl) => {
  if (import.meta.env.DEV) {
    return `${iconUrl}`; // relative path in development
  } else {
    return `${FRONTEND_BASE_URL}${iconUrl}`; // relative path for production
  }
};
//FRONTEND URL
export const getFullTrendUrl = (slug) =>
  `${FRONTEND_BASE_URL}/dashboard/trend/${slug}`;
//GITHUB URL
export const githubUrl = () => {
  return GITHUB_URL;
};
//HTTPS GITHUB URL
export const githubFullUrl = () => {
  return FULL_GITHUB_URL;
};

//HTTPS VALIDATION
export const normalizeUrlForSend = (raw) => {
  const val = String(raw || '').trim();
  if (!val) return val;
  if (!/^https?:\/\//i.test(val)) return `https://${val}`;
  return val;
};//if no scheme assume https

export const normalizeUrlForOpen = (raw) => {
  const val = String(raw || '').trim();
  if (!val) return '';
  if (!/^https?:\/\//i.test(val)) return `https://${val}`;
  try {
    new URL(val);
    return val;
  } catch {
    return '';
  }// eslint-disable-next-line no-new
};
