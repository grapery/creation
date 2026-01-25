import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Service Types
export enum ServiceType {
    MAIN = 'main',       // 8080
    PAYMENT = 'payment', // 8060
    CHAT = 'chat',       // 8050
}

const SERVICE_URLS = {
    [ServiceType.MAIN]: process.env.NEXT_PUBLIC_API_URL || '', // Empty string implies relative path (same origin)
    [ServiceType.PAYMENT]: process.env.NEXT_PUBLIC_PAYMENT_API_URL || 'http://127.0.0.1:8060',
    [ServiceType.CHAT]: process.env.NEXT_PUBLIC_CHAT_API_URL || 'http://127.0.0.1:8050',
};

// API Response Wrapper
export interface APIResponse<T = any> {
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

// Error Class
export class APIError extends Error {
    code: number;
    originalError?: any;

    constructor(message: string, code: number, originalError?: any) {
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
                // Debug: Log token presence (not the token itself for security)
                console.log('[API] Sending request with token:', {
                    url: config.url,
                    hasToken: !!token,
                    tokenLength: token?.length
                });
            } else {
                console.log('[API] Sending request without token:', config.url);
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    // Response Interceptor
    client.interceptors.response.use(
        (response: AxiosResponse<APIResponse>) => {
            const { data, status } = response;

            // Debug: Log response structure for login endpoint
            if (response.config.url?.includes('/auth/login')) {
                console.log('[API] Login response:', {
                    status,
                    data,
                    hasData: 'data' in data,
                    dataValue: (data as any).data
                });
            }

            // Handle standard envelope
            if (data && typeof data.code === 'number') {
                if (data.code === 0 || data.code === 1) {
                    // Success
                    return data.data ?? data; // Return data unwrapped, or raw if data is null but success
                } else {
                    // Business Error
                    return Promise.reject(new APIError(data.message || data.msg || 'Unknown error', data.code));
                }
            }

            return data;
        },
        (error: AxiosError) => {
            if (error.response) {
                const { status, data } = error.response;

                // Only log errors in development or for non-connection errors
                if (process.env.NODE_ENV === 'development' && status !== 0 && status !== 503) {
                    if (status >= 500) {
                        console.warn('[API] Server error:', {
                            url: error.config?.url,
                            status,
                            message: (data as any)?.message || 'Server error'
                        });
                    } else if (status !== 401) {
                        // Don't log 401 errors as they're expected for unauthenticated users
                        console.warn('[API] Request failed:', {
                            url: error.config?.url,
                            status,
                            message: (data as any)?.message || error.message
                        });
                    }
                }

                if (status === 401) {
                    // Unauthorized - emit event or redirect
                    if (typeof window !== 'undefined') {
                        // Optional: clearTokens();
                        // window.location.href = '/login';
                        // Better to handle in AuthContext
                        // Silently handle 401 - don't log
                    }
                }

                const message = (data as any)?.message || (data as any)?.msg || error.message;

                // For authentication endpoints, always throw errors
                const isAuthEndpoint = error.config?.url?.includes('/api/auth/') ||
                                      error.config?.url?.includes('/api/oauth/');

                if (isAuthEndpoint) {
                    return Promise.reject(new APIError(message, status, error));
                }

                // For 500, 503, and connection errors on non-auth endpoints, return a safe empty response
                // This prevents console errors when backend is down
                if (status >= 500 || status === 0) {
                    // Return a safe empty object that matches common response formats
                    return Promise.resolve({ data: [], stories: [], storyboards: [], groups: [], total: 0 } as any);
                }

                return Promise.reject(new APIError(message, status, error));
            }

            // Connection errors (ECONNREFUSED, etc)
            const isConnectionError = error.code === 'ECONNREFUSED' ||
                                    error.code === 'ENOTFOUND' ||
                                    error.message?.includes('Network Error') ||
                                    error.message?.includes('ECONNREFUSED');

            if (isConnectionError) {
                // Check if this is an authentication endpoint
                const isAuthEndpoint = error.config?.url?.includes('/api/auth/') ||
                                      error.config?.url?.includes('/api/oauth/');

                if (isAuthEndpoint) {
                    // For auth endpoints, throw an error with a clear message
                    if (process.env.NODE_ENV === 'development') {
                        console.warn('[API] Backend not available for auth request');
                    }
                    return Promise.reject(new APIError('Unable to connect to server. Please check your connection.', 0, error));
                }

                // Only log in development for non-auth endpoints
                if (process.env.NODE_ENV === 'development') {
                    console.warn('[API] Backend not available - returning empty data');
                }
                // Return empty data instead of throwing error for data endpoints
                return Promise.resolve({ data: [], stories: [], storyboards: [], groups: [], total: 0 } as any);
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

// Helper for changing service on the fly if needed, or just use specific clients
export const request = async <T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: any,
    client: AxiosInstance = apiClient
): Promise<T> => {
    const response = await client.request<any, T>({
        url: endpoint,
        method,
        data: body,
    });
    return response;
};
