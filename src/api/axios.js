import axios from "axios";


const axiosClient = axios.create({
    baseURL:`${import.meta.env.VITE_BASE_URL}/api`
})

axiosClient.defaults.withCredentials = true;
axiosClient.defaults.withXSRFToken = true;

axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("auth_token"); // Retrieve token from localStorage
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export {axiosClient};