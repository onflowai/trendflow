const API_BASE_URL = import.meta.env.VITE_DEV_API_BASE_URL || '';
const FRONTEND_BASE_URL = import.meta.env.VITE_DEV_BASE_URL || '';
const GITHUB_URL = import.meta.env.VITE_GITHUB_URL || '';
const FULL_GITHUB_URL = import.meta.env.VITE_FULL_GITHUB_URL || '';

//API URL
export const getFullIconUrl = (iconUrl) => `${API_BASE_URL}${iconUrl}`;
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
