import { create } from 'zustand';
import { api } from '../lib/api';
import type { User, AuthResponse } from '../types';

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    login: (credentials: any) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
    isLoading: false,

    login: async (credentials) => {
        set({ isLoading: true });
        try {
            // Direct call to /api/auth/login
            const res = await api.post<AuthResponse>('/auth/login', credentials);
            // Assuming res.data contains { token, user } or res is { data: { token, user } } depending on wrapper
            // Based on my API wrapper, api.post returns res.data which is ApiResponse<AuthResponse>
            // The actual data is in res.data

            // Let's assume the successful response structure is { code: 0, data: { accessToken, user, ... } }
            const data = res.data;

            localStorage.setItem('token', data.accessToken);
            set({
                user: data.user,
                token: data.accessToken,
                isAuthenticated: true,
                isLoading: false
            });
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    register: async (credentials) => {
        set({ isLoading: true });
        try {
            const res = await api.post<AuthResponse>('/auth/register', credentials);
            const data = res.data;

            localStorage.setItem('token', data.accessToken);
            set({
                user: data.user,
                token: data.accessToken,
                isAuthenticated: true,
                isLoading: false
            });
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
    },

    checkAuth: async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const res = await api.get<User>('/auth/me');
            console.log('Checked auth:', res);
            // Response wrapper: res.data is User
            if (res.data) {
                set({ user: res.data, isAuthenticated: true });
            }
        } catch (error: any) {
            // If check fails (401), logout silently
            if (error.response?.status === 401 || error.response?.status === 403) {
                get().logout();
            } else {
                console.error("Auth check failed:", error);
                // Do not logout on temporary errors (network, 500s)
            }
        }
    }
}));
