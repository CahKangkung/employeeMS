import axios from 'axios';

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const api = {
    get: <T>(path: string) => instance.get<T>(path).then((res) => res.data),
    post: <T>(path: string, body: unknown) => instance.post<T>(path, body).then((res) => res.data),
    put: <T>(path: string, body: unknown) => instance.put<T>(path, body).then((res) => res.data),
    del: <T>(path: string) => instance.delete<T>(path).then((res) => res.data),
};

export default api;