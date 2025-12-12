import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

const api = axios.create({
    baseURL: API_URL,
});

// interceptors : hook that runs before requests or after responses so i can adjust headers
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const login = async (credentials) => {
    const { data } = await api.post('/login', credentials);
    return data.data;
};

export const register = async (userData) => {
    const { data } = await api.post('/register', userData);
    return data.data;
};

export const getProfile = async () => {
    const { data } = await api.get('/profile');
    return data.data;
};
