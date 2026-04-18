import { apiClient, paymentClient, request, setTokens, clearTokens } from './client';
import { User, AuthResponse } from '../types';

export const auth = {
    login: async (email: string, password: string): Promise<AuthResponse> => {
        try {
            const response = await request<AuthResponse>('/api/auth/login', 'POST', { email, password });

            if (response && 'accessToken' in response && typeof response.accessToken === 'string') {
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

        if (response && 'accessToken' in response && typeof response.accessToken === 'string') {
            setTokens(response.accessToken, response.refreshToken);
        }

        return response;
    },

    logout: () => {
        clearTokens();
        // Optional: Call server?
        // request('/api/auth/logout', 'POST');
    },

    me: async (): Promise<User> => {
        return request<User>('/api/v1/auth/me');
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
        // Call vippay API for Google OAuth (uses payment service on port 8060)
        const response = await request<any>('/api/vippay/google-oauth/signin', 'POST', {
            idToken: data.idToken,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
        }, paymentClient);

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
            }

            return authResponse;
        } else {
            throw new Error(response?.msg || response?.message || 'Google OAuth login failed');
        }
    },

    loginWithApple: async (data: {
        identityToken: string;
        authorizationCode?: string;
        user?: string;
        nonce?: string;
    }): Promise<AuthResponse> => {
        const raw = await request<any>('/api/vippay/apple-oauth/signin', 'POST', data, paymentClient);

        const payload =
            raw && typeof raw === 'object' && raw.success === true && raw.data != null
                ? raw.data
                : raw;

        if (!payload || typeof payload.token !== 'string') {
            throw new Error(raw?.msg || raw?.message || 'Apple OAuth login failed');
        }

        const { token, refreshToken, user, expiresIn } = payload;
        const authResponse: AuthResponse = {
            accessToken: token,
            refreshToken: refreshToken,
            user: user,
            expiresIn: expiresIn,
        };

        if (token) {
            setTokens(token, refreshToken);
        }

        return authResponse;
    },

    loginWithWeChat: async (data: {
        code: string;
    }): Promise<AuthResponse> => {
        const raw = await request<any>('/api/vippay/wechat-oauth/signin', 'POST', {
            code: data.code,
        }, paymentClient);

        // paymentClient 拦截器在 code===0 时已解包为 data 字段；兼容未解包信封
        const payload =
            raw && typeof raw === 'object' && raw.success === true && raw.data != null
                ? raw.data
                : raw;

        if (!payload || typeof payload.token !== 'string') {
            throw new Error(raw?.msg || raw?.message || 'WeChat OAuth login failed');
        }

        const { token, refreshToken, user, expiresIn } = payload;

        const authResponse: AuthResponse = {
            accessToken: token,
            refreshToken: refreshToken,
            user: user,
            expiresIn: expiresIn,
        };

        if (token) {
            setTokens(token, refreshToken);
        }

        return authResponse;
    },

    /** 将微信账号绑定到当前登录用户（需已登录；先走 qrconnect 拿到 code） */
    linkWeChat: async (data: { code: string }): Promise<User> => {
        const raw = await request<any>(
            '/api/vippay/wechat-oauth/link',
            'POST',
            { code: data.code },
            paymentClient
        );
        const payload =
            raw && typeof raw === 'object' && raw.success === true && raw.data != null
                ? raw.data
                : raw;
        const user = payload?.user;
        if (!user) {
            throw new Error(raw?.msg || raw?.message || 'WeChat link failed');
        }
        return user;
    },

    unlinkWeChat: async (): Promise<void> => {
        await request('/api/vippay/wechat-oauth/unlink', 'POST', undefined, paymentClient);
    },

    // Change password (for authenticated users)
    changePassword: async (oldPassword: string, newPassword: string): Promise<{ message: string }> =>
        request('/api/v1/auth/password/change', 'POST', { oldPassword, newPassword }),
};
