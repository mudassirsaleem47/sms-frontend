const rawUrl = import.meta.env.VITE_API_URL || "";
const API_URL = rawUrl.replace(/\/$/, "");

export default API_URL;