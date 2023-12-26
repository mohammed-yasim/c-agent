import axios from "axios";
import { getToken, removeUserSession } from "./auth";
const API = axios.create({
    baseURL: import.meta.env.VITE_API_ENDPOINT,
    // baseURL: 'https://cagent.node.azba.in/api',
    // baseURL: `http://${window.location.hostname}:3001/api`,
});

API.interceptors.request.use(
    function (config) {
        // Do something before request is sent
        // console.log('Request Interceptor:', config);
        config['headers']['Authorization'] = getToken();
        return config;
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    }
);

API.interceptors.response.use(
    function (response) {
        // Do something with response data
        // console.log('Response Interceptor:', response);
        return response;
    },
    function (error) {
        // Do something with response error
        if (error.response && error.response.status === 401) {
            // Handle 401 error (e.g., redirect to login page or perform token refresh)
            // console.log('Unauthorized! Redirect to login page or refresh token.');
            removeUserSession();
            window.location.reload();
        }
        return Promise.reject(error);
    }
);


export { API }
