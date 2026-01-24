import { apiClient, request, setTokens, clearTokens } from './client';
import { User, AuthResponse } from '../types';

export const auth = {
    login: async (email: string, password: string): Promise<AuthResponse> => {
        const response = await request<AuthResponse>('/api/auth/login', 'POST', { email, password });

        // Debug: Log the response structure
        console.log('[Auth] Login response:', response);

        // Check if response has the expected structure
        if (response && 'accessToken' in response && typeof response.accessToken === 'string') {
            console.log('[Auth] Saving tokens:', {
                hasAccessToken: !!response.accessToken,
                accessTokenLength: response.accessToken.length,
                hasRefreshToken: !!response.refreshToken
            });
            setTokens(response.accessToken, response.refreshToken);
        } else {
            console.error('[Auth] Invalid login response structure:', response);
        }

        return response;
    },

    register: async (data: {
        username: string;
        email: string;
        password: string;
        displayName: string;
        agreeTerms: boolean;
        dateOfBirth?: string;
    }): Promise<AuthResponse> => {
        const response = await request<AuthResponse>('/api/auth/register', 'POST', data);

        console.log('[Auth] Register response:', response);

        if (response && 'accessToken' in response && typeof response.accessToken === 'string') {
            console.log('[Auth] Saving tokens from registration');
            setTokens(response.accessToken, response.refreshToken);
        } else {
            console.error('[Auth] Invalid register response structure:', response);
        }

        return response;
    },

    logout: () => {
        clearTokens();
        // Optional: Call server?
        // request('/api/auth/logout', 'POST');
    },

    me: async (): Promise<User> => {
        return request<User>('/api/auth/me');
    },

    requestPasswordReset: async (email: string): Promise<void> => {
        return request<void>('/api/auth/password/request-reset', 'POST', { email });
    },

    resetPassword: async (token: string, password: string): Promise<void> => {
        return request<void>('/api/auth/password/reset', 'POST', { token, password });
    },

    sendEmailVerificationCode: async (email: string): Promise<void> => {
        return request<void>('/api/auth/email/send-verification-code', 'POST', { email });
    },

    verifyEmail: async (email: string, code: string): Promise<void> => {
        return request<void>('/api/auth/email/verify', 'POST', { email, code });
    },

    loginWithGoogle: async (data: {
        idToken: string;
        accessToken?: string;
        refreshToken?: string;
    }): Promise<AuthResponse> => {
        const response = await request<AuthResponse>('/api/auth/oauth/google', 'POST', data);

        // Check if response has expected structure
        if (response && 'accessToken' in response && typeof response.accessToken === 'string') {
            setTokens(response.accessToken, response.refreshToken);
        } else {
            console.error('[Auth] Invalid Google OAuth response structure:', response);
        }

        return response;
    },

    loginWithApple: async (data: {
        identityToken: string;
        authorizationCode?: string;
        user?: string;
        nonce?: string;
    }): Promise<AuthResponse> => {
        const response = await request<AuthResponse>('/api/auth/oauth/apple', 'POST', data);

        // Check if response has expected structure
        if (response && 'accessToken' in response && typeof response.accessToken === 'string') {
            setTokens(response.accessToken, response.refreshToken);
        } else {
            console.error('[Auth] Invalid Apple OAuth response structure:', response);
        }

        return response;
    }
};
