const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const getFullIconUrl = (iconUrl) => `${API_BASE_URL}${iconUrl}`;
// export const getFullIconUrl = (iconUrl) =>
//   `${import.meta.env.VITE_API_BASE_URL}${iconUrl}`;
export const getFullTrendUrl = (slug) =>
  `${API_BASE_URL}/dashboard/trend/${slug}`;
