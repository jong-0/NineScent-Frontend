import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

axios.defaults.baseURL = 'http://localhost:8080'; // 백엔드 API 주소

axios.interceptors.request.use(
    (config) => {
        const authStore = useAuthStore();

        if (authStore.token) {
            config.headers.Authorization = `Bearer ${authStore.token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);
