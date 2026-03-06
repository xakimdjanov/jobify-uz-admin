import axios from "axios";

const API_URL = "https://jobify-backend-production-6a97.up.railway.app/api";

const api = axios.create({
  baseURL: API_URL,
});

// --- INTERCEPTORS ---
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;