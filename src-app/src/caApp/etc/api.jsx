import axios from "axios";
const API = axios.create({
    baseURL: import.meta.env.VITE_API_ENDPOINT, // Replace with your desired base URL
});

export { API }
