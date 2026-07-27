import axios from "axios";

const API = axios.create({
    baseURL: "http://127.0.0.1:8000",
});

// ----------------------------
// Request Interceptor
// ----------------------------

API.interceptors.request.use(
    (config) => {

        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// ----------------------------
// Response Interceptor
// ----------------------------

API.interceptors.response.use(
    (response) => response,

    (error) => {

        if (error.response?.status === 401) {

            console.warn("Session expired. Redirecting to login...");

            // Remove expired token
            localStorage.removeItem("token");

            // Prevent redirect loop
            if (window.location.pathname !== "/login") {
                window.location.replace("/login");
            }
        }

        return Promise.reject(error);
    }
);

export default API;