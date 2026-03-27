const defaultApiBase = import.meta.env.DEV ? "http://localhost:5000" : "/api";
const rawUrl = import.meta.env.VITE_API_URL || defaultApiBase;

const normalizeApiUrl = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return "";

    // Allow relative API base like /api for same-domain deployments.
    if (trimmed.startsWith('/')) {
        return trimmed.replace(/\/+$/, '') || '/';
    }

    // Handle malformed values like ":5000" or "localhost:5000".
    if (trimmed.startsWith(':')) {
        return `http://localhost${trimmed}`.replace(/\/+$/, "");
    }

    if (/^localhost:\d+$/i.test(trimmed)) {
        return `http://${trimmed}`.replace(/\/+$/, "");
    }

    if (/^\d+\.\d+\.\d+\.\d+:\d+$/.test(trimmed)) {
        return `http://${trimmed}`.replace(/\/+$/, "");
    }

    // If protocol is missing, default to http for local/dev use.
    if (!/^https?:\/\//i.test(trimmed)) {
        return `http://${trimmed}`.replace(/\/+$/, "");
    }

    // Strip one OR MORE trailing slashes.
    return trimmed.replace(/\/+$/, "");
};

const API_URL = normalizeApiUrl(rawUrl);

export default API_URL;