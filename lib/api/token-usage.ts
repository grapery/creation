import { paymentClient, request } from './client';
import type {
    TokenUsageStats,
    TokenUsageLog,
    TokenUsageLimits,
    TokenUsageByType,
    UsageBillingSummary,
} from '../types';

const paymentRequest = async <T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: any
): Promise<T> => request(endpoint, method, body, paymentClient);

export const tokenUsage = {
    getStats: async (): Promise<TokenUsageStats> =>
        paymentRequest('/api/vippay/usage/stats'),

    getByType: async (): Promise<TokenUsageByType[]> =>
        paymentRequest('/api/vippay/usage/by-type'),

    checkLimit: async (type: string): Promise<TokenUsageLimits> =>
        paymentRequest(`/api/vippay/usage/limit/${type}`),

    getLogs: async (params: {
        page?: number;
        limit?: number;
        entityType?: string;
        startDate?: number;
        endDate?: number;
    } = {}): Promise<{ logs: TokenUsageLog[]; total: number }> => {
        const { page = 1, limit = 20, entityType, startDate, endDate } = params;
        const offset = (page - 1) * limit;
        const queryParams = new URLSearchParams();
        queryParams.append('limit', limit.toString());
        queryParams.append('offset', offset.toString());
        if (entityType) queryParams.append('entityType', entityType);
        if (startDate) queryParams.append('startDate', startDate.toString());
        if (endDate) queryParams.append('endDate', endDate.toString());
        return paymentRequest(`/api/vippay/usage/logs?${queryParams.toString()}`);
    },

    getLogSummary: async (): Promise<TokenUsageStats> =>
        paymentRequest('/api/vippay/usage/logs/summary'),

    getLogSummaryByType: async (): Promise<TokenUsageByType[]> =>
        paymentRequest('/api/vippay/usage/logs/summary/by-type'),

    getLogsByEntity: async (entityType: string, entityId: string): Promise<TokenUsageLog[]> =>
        paymentRequest(`/api/vippay/usage/logs/by-entity/${entityType}/${entityId}`),

    getBilling: async (params: { period?: string } = {}): Promise<UsageBillingSummary> => {
        const queryParams = new URLSearchParams();
        if (params.period) queryParams.append('period', params.period);
        const qs = queryParams.toString();
        return paymentRequest(`/api/vippay/usage/logs/billing${qs ? `?${qs}` : ''}`);
    },

    exportLogs: async (params: { format?: string; startDate?: number; endDate?: number } = {}): Promise<Blob> => {
        const queryParams = new URLSearchParams();
        if (params.format) queryParams.append('format', params.format);
        if (params.startDate) queryParams.append('startDate', params.startDate.toString());
        if (params.endDate) queryParams.append('endDate', params.endDate.toString());
        return paymentRequest(`/api/vippay/usage/logs/export?${queryParams.toString()}`);
    },

    markBilled: async (logIds: string[]): Promise<{ message: string }> =>
        paymentRequest('/api/vippay/usage/logs/mark-billed', 'POST', { logIds }),
};
