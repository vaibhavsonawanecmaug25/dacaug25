import axios from 'axios';
import API_URL from './api';

// Use the same key your AuthContext uses ("token")
const TOKEN_KEY = 'token';

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || '';
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function login(email, password) {
  const res = await axios.post(`${API_URL}/auth/login`, { email, password });
  const { token, user } = res.data;
  setToken(token);
  return { token, user };
}

export async function verify() {
  const token = getToken();
  if (!token) return { valid: false };
  try {
    const res = await axios.get(`${API_URL}/auth/verify`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data; // { valid: true, user }
  } catch (e) {
    return { valid: false };
  }
}

// Attach token to all requests if present
axios.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
