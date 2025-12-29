import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi, userApi } from '../lib/api';

export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatar?: string;
  background?: string;
  bio?: string;
  location?: string;
  website?: string;
  joinedDate?: string;
  createdAt?: string;
  followers?: number;
  following?: number;
  isVerified?: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; username: string; displayName: string }) => Promise<void>;
  logout: () => void;
  getCurrentUser: () => Promise<void>;
  updateUser: (id: string, data: Partial<User>) => Promise<void>;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.login({ email, password });
          const token = response.data.token || response.data.accessToken;
          const user = response.data.user || response.data;
          
          if (token) {
            localStorage.setItem('authToken', token);
          }
          
          set({
            token,
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || error.message || 'Login failed',
          });
          throw error;
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.register(data);
          const token = response.data.token || response.data.accessToken;
          const user = response.data.user || response.data;
          
          if (token) {
            localStorage.setItem('authToken', token);
          }
          
          set({
            token,
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || error.message || 'Registration failed',
          });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem('authToken');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      getCurrentUser: async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
          set({ isAuthenticated: false, user: null });
          return;
        }

        set({ isLoading: true, error: null });
        try {
          const response = await authApi.getCurrentUser();
          const user = response.data.user || response.data;
          
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          // Token might be invalid
          if (error.response?.status === 401) {
            localStorage.removeItem('authToken');
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
            });
          } else {
            set({
              isLoading: false,
              error: error.response?.data?.message || error.message || 'Failed to get user',
            });
          }
        }
      },

      updateUser: async (id: string, data: Partial<User>) => {
        set({ isLoading: true, error: null });
        try {
          const response = await userApi.updateUserProfile(id, data);
          const updatedUser = response.data.user || response.data;
          
          set((state) => ({
            user: state.user?.id === id ? { ...state.user, ...updatedUser } : state.user,
            isLoading: false,
            error: null,
          }));
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || error.message || 'Failed to update user',
          });
          throw error;
        }
      },

      setUser: (user: User | null) => {
        set({ user, isAuthenticated: !!user });
      },

      setToken: (token: string | null) => {
        if (token) {
          localStorage.setItem('authToken', token);
        } else {
          localStorage.removeItem('authToken');
        }
        set({ token, isAuthenticated: !!token });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

