import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,
  withXSRFToken: true,
  headers: { Accept: 'application/json' },
});

export const getCsrfCookie = () =>
  axios.get('http://localhost:8000/sanctum/csrf-cookie', { withCredentials: true });

export default api;