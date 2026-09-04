import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { canRefreshToken, isAuthError, shouldRedirectToLogin } from './error-codes';

// Service Types
export enum ServiceType {
    MAIN = 'main',       // 8080
    PAYMENT = 'payment', // 8060
    CHAT = 'chat',       // 8050
}

const SERVICE_URLS = {
    [ServiceType.MAIN]: process.env.NEXT_PUBLIC_API_URL || '', // Empty string implies relative path (same origin)
    // Same-origin via Next rewrite /api/vippay/* → vippay (avoids browser → :8060)
    [ServiceType.PAYMENT]: process.env.NEXT_PUBLIC_PAYMENT_API_URL || '',
    [ServiceType.CHAT]: process.env.NEXT_PUBLIC_CHAT_API_URL || '',
};

// API Response Wrapper
export interface APIResponse<T = unknown> {
    code: number;
    message: string;
    data?: T;
    msg?: string; // Compatibility
}

// Token Management
const TOKEN_KEY = 'voyager_auth_token';
const REFRESH_TOKEN_KEY = 'voyager_refresh_token';

export const getAuthToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem(TOKEN_KEY);
    }
    return null;
};

// Decode JWT token to get user ID
export const getUserIdFromToken = (): string | null => {
    const token = getAuthToken();
    if (!token) return null;

    try {
        // JWT token has format: header.payload.signature
        const parts = token.split('.');
        if (parts.length !== 3) return null;

        // Decode the payload (base64url)
        const payload = parts[1];
        // Replace base64url characters with base64
        const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
        const decodedPayload = atob(base64);
        const parsed = JSON.parse(decodedPayload);

        // Extract user ID - common claims are 'userId', 'sub', or 'user_id'
        return parsed.userId || parsed.sub || parsed.user_id || null;
    } catch (e) {
        console.error('Failed to decode JWT token:', e);
        return null;
    }
};

export const setTokens = (token: string, refreshToken?: string) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_KEY, token);
        if (refreshToken) {
            localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        }
    }
};

export const clearTokens = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
};

export const getRefreshToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem(REFRESH_TOKEN_KEY);
    }
    return null;
};

// Token刷新状态管理
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
    refreshSubscribers.push(cb);
};

const onTokenRefreshed = (token: string) => {
    refreshSubscribers.forEach(cb => cb(token));
    refreshSubscribers = [];
};

const onRefreshError = () => {
    refreshSubscribers = [];
    clearTokens();
    // 触发全局登出事件
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth:logout', {
            detail: { reason: 'token_refresh_failed' }
        }));
    }
};

// 尝试刷新Token
const attemptRefreshToken = async (): Promise<string | null> => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
        return null;
    }

    try {
        const baseURL = SERVICE_URLS[ServiceType.MAIN];
        const response = await axios.post(`${baseURL}/api/auth/refresh`, {
            refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data?.data || response.data;

        if (accessToken) {
            setTokens(accessToken, newRefreshToken);
            return accessToken;
        }
        return null;
    } catch (error) {
        console.error('[API] Token refresh failed:', error);
        return null;
    }
};

// 全局认证事件监听
export const setupAuthListeners = () => {
    if (typeof window !== 'undefined') {
        window.addEventListener('auth:logout', ((event: CustomEvent) => {
            // 可以在这里触发全局的登录提示
            window.dispatchEvent(new CustomEvent('auth:showLogin', {
                detail: { reason: event.detail?.reason || 'session_expired' }
            }));
        }) as EventListener);
    }
};

// Error Class
export class APIError extends Error {
    code: number;
    originalError?: unknown;

    constructor(message: string, code: number, originalError?: unknown) {
        super(message);
        this.name = 'APIError';
        this.code = code;
        this.originalError = originalError;
    }
}

// Client Factory
const createClient = (serviceType: ServiceType = ServiceType.MAIN): AxiosInstance => {
    const baseURL = SERVICE_URLS[serviceType];

    const client = axios.create({
        baseURL,
        headers: {
            'Content-Type': 'application/json',
        },
        timeout: 30000,
    });

    // Request Interceptor
    client.interceptors.request.use(
        (config) => {
            const token = getAuthToken();
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    // Response Interceptor
    // 解包 grapery {code,message,data} 信封：成功时直接返回业务数据，失败时 reject APIError。
    // axios 1.20 要求 onFulfilled 返回 AxiosResponse，与解包语义不兼容，注册处做一次显式断言。
    const unwrapEnvelope = (response: AxiosResponse<APIResponse>): unknown => {
        const { data } = response;

        // Handle standard envelope
        // Grapery often uses code===1; vippay web payments use code===0 with data (no success bool)
        if (data && typeof data.code === 'number') {
            const isPaymentService = serviceType === ServiceType.PAYMENT;
            const isSuccess = isPaymentService
                ? data.code === 0 || data.code === 1 || (data as { success?: boolean }).success === true
                : data.code === 1 || data.code === 0;

            if (isSuccess) {
                return data.data ?? data;
            }
            return Promise.reject(new APIError(data.message || data.msg || 'Unknown error', data.code));
        }

        return data;
    };

    client.interceptors.response.use(
        unwrapEnvelope as unknown as Parameters<typeof client.interceptors.response.use>[0],
        (error: AxiosError) => {
            if (error.response) {
                const { status, data } = error.response;
                const errBody = (data ?? {}) as { code?: number; message?: string; msg?: string };
                const errorCode = errBody.code ?? status;
                const errorMessage = errBody.message || errBody.msg || error.message;

                // Only log errors in development or for non-connection errors
                if (process.env.NODE_ENV === 'development' && status !== 0 && status !== 503) {
                    if (status >= 500) {
                        console.warn('[API] Server error:', {
                            url: error.config?.url,
                            status,
                            code: errorCode,
                            message: errorMessage
                        });
                    } else if (status !== 401) {
                        console.warn('[API] Request failed:', {
                            url: error.config?.url,
                            status,
                            code: errorCode,
                            message: errorMessage
                        });
                    }
                }

                // 处理401认证错误
                if (status === 401) {
                    const isAuthEndpoint = error.config?.url?.includes('/api/auth/') ||
                                          error.config?.url?.includes('/api/oauth/');

                    // 认证端点的401直接抛出，由调用方处理
                    if (isAuthEndpoint) {
                        return Promise.reject(new APIError(errorMessage, errorCode || status, error));
                    }

                    // 对于需要刷新Token的情况（Token过期）
                    if (canRefreshToken(errorCode)) {
                        if (!isRefreshing) {
                            isRefreshing = true;
                            attemptRefreshToken()
                                .then((newToken) => {
                                    if (newToken) {
                                        onTokenRefreshed(newToken);
                                    } else {
                                        onRefreshError();
                                    }
                                })
                                .catch(() => {
                                    onRefreshError();
                                })
                                .finally(() => {
                                    isRefreshing = false;
                                });
                        }

                        // 返回Promise，等待Token刷新完成后重试
                        return new Promise((resolve, reject) => {
                            subscribeTokenRefresh((newToken) => {
                                // 使用新Token重试原请求
                                if (error.config) {
                                    error.config.headers.Authorization = `Bearer ${newToken}`;
                                    client.request(error.config).then(resolve).catch(reject);
                                } else {
                                    reject(new APIError(errorMessage, errorCode, error));
                                }
                            });
                        });
                    }

                    // 其他401错误（无效Token等）- 触发登出
                    if (shouldRedirectToLogin(errorCode) || isAuthError(errorCode)) {
                        clearTokens();
                        if (typeof window !== 'undefined') {
                            window.dispatchEvent(new CustomEvent('auth:showLogin', {
                                detail: { reason: 'unauthorized', code: errorCode }
                            }));
                        }
                        return Promise.reject(new APIError(errorMessage, errorCode || status, error));
                    }
                }

                const message = errorMessage;

                // For authentication endpoints, always throw errors
                const isAuthEndpoint2 = error.config?.url?.includes('/api/auth/') ||
                                      error.config?.url?.includes('/api/oauth/');

                if (isAuthEndpoint2) {
                    return Promise.reject(new APIError(message, status, error));
                }

                // For navigation endpoints (children, parent), 404 is expected when no data exists
                const isNavigationEndpoint = error.config?.url?.includes('/children');
                if (status === 404 && isNavigationEndpoint) {
                    return Promise.resolve([]);
                }

                return Promise.reject(new APIError(message, status, error));
            }

            // Connection errors (ECONNREFUSED, etc)
            const isConnectionError = error.code === 'ECONNREFUSED' ||
                                    error.code === 'ENOTFOUND' ||
                                    error.message?.includes('Network Error') ||
                                    error.message?.includes('ECONNREFUSED');

            if (isConnectionError) {
                return Promise.reject(new APIError('Unable to connect to server. Please check your connection.', 0, error));
            }

            // For other errors, still throw
            return Promise.reject(new APIError(error.message, 0, error));
        }
    );

    return client;
};

// Singleton Clients
export const apiClient = createClient(ServiceType.MAIN);
export const paymentClient = createClient(ServiceType.PAYMENT);
export const chatClient = createClient(ServiceType.CHAT);

// Default timeout for regular requests
export const DEFAULT_TIMEOUT = 30000;
// Extended timeout for AI generation endpoints
export const AI_TIMEOUT = 120000;

// Helper for changing service on the fly if needed, or just use specific clients
export const request = async <T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: unknown,
    client: AxiosInstance = apiClient,
    timeout?: number
): Promise<T> => {
    // 响应拦截器已把 {code,message,data} 信封解包为业务数据，
    // 这里仅做类型收窄（axios 1.20 的 request 泛型签名与拦截器解包后的运行时形状不一致）。
    const response = await client.request<unknown, T>({
        url: endpoint,
        method,
        data: body,
        timeout: timeout,
    });
    return response as T;
};
