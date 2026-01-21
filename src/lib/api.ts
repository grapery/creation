import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import type { ApiResponse } from '../types';

// Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Create Axios Instance
export const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Add Auth Token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle API Wrappers & Errors
apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        // If the API returns a standardized wrapper (code, msg, data)
        // We can unwrap it here or just return the data. 
        // For now, let's return the full response data to handle 'code' checks in services.
        return response;
    },
    (error: any) => {
        const status = error.response ? error.response.status : null;
        if (status === 401) {
            console.warn(`[API] 401 Unauthorized from: ${error.config?.url}`);
            // Dispatch event for auth store to handle (logout)
            window.dispatchEvent(new Event('auth:unauthorized'));
        }
        return Promise.reject(error);
    }
);

// Generic Request Helpers
export const api = {
    get: <T>(url: string, config?: AxiosRequestConfig) =>
        apiClient.get<ApiResponse<T>>(url, config).then(res => res.data),

    post: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
        apiClient.post<ApiResponse<T>>(url, data, config).then(res => res.data),

    put: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
        apiClient.put<ApiResponse<T>>(url, data, config).then(res => res.data),

    delete: <T>(url: string, config?: AxiosRequestConfig) =>
        apiClient.delete<ApiResponse<T>>(url, config).then(res => res.data),
};
