import axios from 'axios';

const isServer = import.meta.env.SSR;
const baseURL = isServer
  ? import.meta.env.VITE_DEV_API_BASE_URL || 'http://localhost:5100/api/v1'
  : '/api/v1';

const customFetch = axios.create({
  baseURL,
});

export default customFetch;
