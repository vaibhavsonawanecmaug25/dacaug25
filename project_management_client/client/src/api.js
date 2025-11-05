// Centralized API base URL for the client.
// Uses Vite env var VITE_API_URL when provided, otherwise defaults to localhost:4400
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4400";

export default API_URL;
