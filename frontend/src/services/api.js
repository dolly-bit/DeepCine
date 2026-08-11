import axios from "axios";

console.log(
  "API BASE URL:",
  import.meta.env.VITE_API_BASE_URL
);

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
  timeout: 60000,
});

// Automatically attach JWT token (after login)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;