import { paymentClient, request, setTokens, clearTokens } from './client';
import { User, AuthResponse } from '../types';
import { errorMessage } from "@/lib/utils";

interface OAuthTokenPayload {
    token: string;
    refreshToken?: string;
    user: User;
    expiresIn?: number;
}

/** vippay 信封：paymentClient 拦截器在 code===0 时可能已解包，因此直接 payload 与信封两种形状都接受 */
type OAuthSignInResponse = OAuthTokenPayload | {
    success?: boolean;
    data?: OAuthTokenPayload;
    msg?: string;
    message?: string;
};

function oauthPayload(raw: OAuthSignInResponse | null | undefined): OAuthTokenPayload | null {
    if (!raw || typeof raw !== 'object') return null;
    if ('token' in raw && typeof raw.token === 'string') return raw;
    const env = raw as { success?: boolean; data?: OAuthTokenPayload };
    if (env.success === true && env.data && typeof env.data.token === 'string') return env.data;
    return null;
}

function oauthError(raw: OAuthSignInResponse | null | undefined, fallback: string): Error {
    const env = (raw ?? {}) as { msg?: string; message?: string };
    return new Error(env.msg || env.message || fallback);
}

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
        } catch (error: unknown) {
            // Provide better error messages for common issues
            if (errorMessage(error)?.includes('ECONNREFUSED') || errorMessage(error)?.includes('Network Error')) {
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
        const raw = await request<OAuthSignInResponse>('/api/vippay/google-oauth/signin', 'POST', {
            idToken: data.idToken,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
        }, paymentClient);

        const payload = oauthPayload(raw);
        if (!payload) {
            throw oauthError(raw, 'Google OAuth login failed');
        }

        const { token, refreshToken, user, expiresIn } = payload;
        if (token) {
            setTokens(token, refreshToken);
        }
        return {
            accessToken: token,
            refreshToken,
            user,
            expiresIn,
        };
    },

    loginWithApple: async (data: {
        identityToken: string;
        authorizationCode?: string;
        user?: string;
        nonce?: string;
        givenName?: string;
        familyName?: string;
    }): Promise<AuthResponse> => {
        const raw = await request<OAuthSignInResponse>('/api/vippay/apple-oauth/signin', 'POST', data, paymentClient);

        const payload = oauthPayload(raw);
        if (!payload) {
            throw oauthError(raw, 'Apple OAuth login failed');
        }

        const { token, refreshToken, user, expiresIn } = payload;
        if (token) {
            setTokens(token, refreshToken);
        }
        return {
            accessToken: token,
            refreshToken,
            user,
            expiresIn,
        };
    },

    loginWithWeChat: async (data: {
        code: string;
    }): Promise<AuthResponse> => {
        const raw = await request<OAuthSignInResponse>('/api/vippay/wechat-oauth/signin', 'POST', {
            code: data.code,
        }, paymentClient);

        // paymentClient 拦截器在 code===0 时已解包为 data 字段；兼容未解包信封
        const payload = oauthPayload(raw);
        if (!payload) {
            throw oauthError(raw, 'WeChat OAuth login failed');
        }

        const { token, refreshToken, user, expiresIn } = payload;
        if (token) {
            setTokens(token, refreshToken);
        }
        return {
            accessToken: token,
            refreshToken,
            user,
            expiresIn,
        };
    },

    /** 将微信账号绑定到当前登录用户（需已登录；先走 qrconnect 拿到 code） */
    linkWeChat: async (data: { code: string }): Promise<User> => {
        type LinkResponse = { user?: User } | { success?: boolean; data?: { user?: User }; msg?: string; message?: string };
        const raw = await request<LinkResponse>(
            '/api/vippay/wechat-oauth/link',
            'POST',
            { code: data.code },
            paymentClient
        );
        const payload =
            raw && typeof raw === 'object' && 'user' in raw
                ? raw
                : raw && typeof raw === 'object' && (raw as { data?: { user?: User } }).data
                  ? (raw as { data: { user?: User } }).data
                  : null;
        const user = payload?.user;
        if (!user) {
            const env = (raw ?? {}) as { msg?: string; message?: string };
            throw new Error(env.msg || env.message || 'WeChat link failed');
        }
        return user;
    },

    unlinkWeChat: async (): Promise<void> => {
        await request('/api/vippay/wechat-oauth/unlink', 'POST', undefined, paymentClient);
    },

    // Change password (for authenticated users)
    changePassword: async (oldPassword: string, newPassword: string): Promise<{ message: string }> =>
        request('/api/v1/auth/password/change', 'POST', { oldPassword, newPassword }),

    // Phone verification
    sendPhoneSMSCode: async (phone: string): Promise<void> =>
        request('/api/v1/auth/phone/send-sms-code', 'POST', { phone }),

    verifyPhoneSMSCode: async (phone: string, code: string): Promise<void> =>
        request('/api/v1/auth/phone/verify-sms-code', 'POST', { phone, code }),

    // Account deletion (phased: SMS verify → risk ACK → grace window)
    getAccountDeletionStatus: async (): Promise<{
        isPending: boolean;
        userStatus?: string;
        deletionRequestStatus?: string;
        scheduledDeletionAt?: number;
        gracePeriodEndsAt?: number;
        reason?: string;
    }> => request('/api/v1/auth/account/deletion'),

    sendAccountDeletionSMS: async (): Promise<void> =>
        request('/api/v1/auth/account/deletion/send-sms-code', 'POST'),

    verifyAccountDeletionSMS: async (code: string): Promise<void> =>
        request('/api/v1/auth/account/deletion/verify-sms-code', 'POST', { code }),

    requestAccountDeletion: async (riskAcknowledged: boolean): Promise<{
        isPending: boolean;
        scheduledDeletionAt?: number;
        gracePeriodEndsAt?: number;
    }> =>
        request('/api/v1/auth/account', 'DELETE', { riskAcknowledged }),

    cancelAccountDeletion: async (): Promise<void> =>
        request('/api/v1/auth/account/deletion/cancel', 'POST'),

    /** @deprecated use requestAccountDeletion */
    deleteAccount: async (): Promise<{ message: string }> => {
        await request('/api/v1/auth/account', 'DELETE', { riskAcknowledged: true });
        return { message: 'account deletion requested' };
    },
};
