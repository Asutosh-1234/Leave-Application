import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api/v1",
});

// Request interceptor to add the auth token header to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle global errors like 401 Unauthorized
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token is invalid/expired - clear local storage and force re-login
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      // Redirect to login only if not already on the login page
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
