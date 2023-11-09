import axios from "axios";
const API = axios.create({
    baseURL: import.meta.env.VITE_API_ENDPOINT,
    // baseURL: 'https://cagent.node.azba.in/api',
});

// API.interceptors.request.use()

export { API }
