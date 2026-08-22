import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json"
  },
  withCredentials: true
});


API.interceptors.request.use(
  (config) => {
    try {
      const savedUserStr = localStorage.getItem("dayflow_user");
      if (savedUserStr) {
        const savedUser = JSON.parse(savedUserStr);
        if (savedUser?.token) {
          config.headers.Authorization = `Bearer ${savedUser.token}`;
        }
      }
    } catch (e) {
      console.error("Error parsing stored auth token:", e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);


API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      const message = error.response.data?.message || "";
      
      if (message.includes("token") || message.includes("denied") || error.response.status === 401) {
        localStorage.removeItem("dayflow_user");
        if (window.location.pathname !== "/login" && window.location.pathname !== "/register") {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default API;
