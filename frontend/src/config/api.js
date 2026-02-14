// API Configuration
// In Docker, frontend connects to backend via service name
// But browser connects via localhost (port mapping)
const API_URL = import.meta.env.VITE_API_URL || 'http://192.168.10.4:5000';

export default API_URL;