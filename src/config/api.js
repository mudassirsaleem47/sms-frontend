const rawUrl = import.meta.env.VITE_API_URL || "";
// Strip one OR MORE trailing slashes
const API_URL = rawUrl.trim().replace(/\/+$/, "");

console.log("SMS App: Using API_URL ->", API_URL);

export default API_URL;