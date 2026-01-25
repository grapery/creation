import { apiClient, request, setTokens, clearTokens } from './client';
import { User, AuthResponse } from '../types';

export const auth = {
    login: async (email: string, password: string): Promise<AuthResponse> => {
        try {
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
                // Throw an error with a user-friendly message
                throw new Error('Invalid response from server. Please try again.');
            }

            return response;
        } catch (error: any) {
            // Provide better error messages for common issues
            if (error.message?.includes('ECONNREFUSED') || error.message?.includes('Network Error')) {
                throw new Error('Unable to connect to server. Please check your connection and try again.');
            }
            throw error;
        }
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
        // Call vippay API for Google OAuth
        const response = await request<any>('/api/vippay/google-oauth/signin', 'POST', {
            idToken: data.idToken,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
        });

        console.log('[Auth] Google OAuth response:', response);

        // Handle vippay API response format
        if (response && response.success && response.data) {
            const { token, refreshToken, user } = response.data;

            // Transform to AuthResponse format
            const authResponse: AuthResponse = {
                accessToken: token,
                refreshToken: refreshToken,
                user: user,
                expiresIn: response.data.expiresIn,
            };

            // Save tokens
            if (token && typeof token === 'string') {
                setTokens(token, refreshToken);
            } else {
                console.error('[Auth] Invalid Google OAuth token in response');
            }

            return authResponse;
        } else {
            console.error('[Auth] Google OAuth failed:', response);
            throw new Error(response?.msg || response?.message || 'Google OAuth login failed');
        }
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
