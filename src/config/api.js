const rawUrl = import.meta.env.VITE_API_URL || "";
// Strip one OR MORE trailing slashes
const API_URL = rawUrl.trim().replace(/\/+$/, "");

export default API_URL;