import axios from 'axios';

const base = import.meta.env.VITE_API_BASE || '/api';

const api = axios.create({
  baseURL: base,
  timeout: 15000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// Normalize errors
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const errMsg = err?.response?.data?.message || err?.message || 'Network error';
    return Promise.reject(new Error(errMsg));
  }
);

// Named helpers that return response.data
export async function get(url, config) {
  const res = await api.get(url, config);
  return res.data;
}

export async function post(url, body, config) {
  const res = await api.post(url, body, config);
  return res.data;
}

export async function put(url, body, config) {
  const res = await api.put(url, body, config);
  return res.data;
}

export async function del(url, config) {
  const res = await api.delete(url, config);
  return res.data;
}

// default export for advanced usage
export default api;
