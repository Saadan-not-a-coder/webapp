import axios from 'axios';

const api = axios.create({
    // This points to your Express server
    baseURL: 'http://localhost:3000/api', 
});

// This automatically attaches your JWT token to every request if you are logged in
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;