import axios from "axios";

// 👇 use your backend port (4400)
const API_URL = "http://localhost:4400";

export async function login(email, password) {
  const res = await axios.post(`${API_URL}/auth/login`, { email, password });
  return res.data; // { token, user }
}

export async function verifyToken(token) {
  try {
    const res = await axios.get(`${API_URL}/auth/verify`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data; // { valid: true, user }
  } catch {
    return { valid: false };
  }
}

export default API_URL;
