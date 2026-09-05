import { paymentClient, request } from './client';
import type { BadgeDefinition, UserBadge, BadgeProgress } from '../types';

const paymentRequest = async <T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: unknown
): Promise<T> => request(endpoint, method, body, paymentClient);

export const badges = {
    getAll: async (): Promise<BadgeDefinition[]> =>
        paymentRequest('/api/vippay/badges'),

    getByCategory: async (category: string): Promise<BadgeDefinition[]> =>
        paymentRequest(`/api/vippay/badges/category/${category}`),

    getUserBadges: async (): Promise<UserBadge[]> =>
        paymentRequest('/api/vippay/badges/user'),

    getPinned: async (): Promise<UserBadge[]> =>
        paymentRequest('/api/vippay/badges/pinned'),

    getProfile: async (): Promise<{ badges: UserBadge[]; stats: Record<string, number> }> =>
        paymentRequest('/api/vippay/badges/profile'),

    getStats: async (): Promise<Record<string, number>> =>
        paymentRequest('/api/vippay/badges/stats'),

    getProgress: async (): Promise<BadgeProgress[]> =>
        paymentRequest('/api/vippay/badges/progress'),

    pin: async (badgeId: string): Promise<{ message: string }> =>
        paymentRequest('/api/vippay/badges/pin', 'POST', { badgeId }),

    unpin: async (badgeId: string): Promise<{ message: string }> =>
        paymentRequest(`/api/vippay/badges/unpin/${badgeId}`, 'POST'),

    markViewed: async (badgeIds: string[]): Promise<{ message: string }> =>
        paymentRequest('/api/vippay/badges/mark-viewed', 'POST', { badgeIds }),

    checkAndAward: async (): Promise<{ awarded: UserBadge[] }> =>
        paymentRequest('/api/vippay/badges/check', 'POST'),

    syncStats: async (): Promise<{ message: string }> =>
        paymentRequest('/api/vippay/badges/sync-stats', 'POST'),
};
