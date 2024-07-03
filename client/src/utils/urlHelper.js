const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

export const getFullIconUrl = (iconUrl) => `${API_BASE_URL}${iconUrl}`;
// export const getFullIconUrl = (iconUrl) =>
//   `${import.meta.env.VITE_API_BASE_URL}${iconUrl}`;
