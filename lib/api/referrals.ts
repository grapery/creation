import { request } from './client';
import type { ReferralInfo, ReferralStats } from '../types';

export const referrals = {
    getCode: async (): Promise<{ referralCode: string }> =>
        request('/api/v1/referrals/code'),

    getShareContent: async (): Promise<ReferralInfo> =>
        request('/api/v1/referrals/share'),

    getStats: async (): Promise<ReferralStats> =>
        request('/api/v1/referrals/stats'),

    list: async (page = 1, limit = 20): Promise<{ referrals: unknown[]; total: number }> => {
        const offset = (page - 1) * limit;
        return request(`/api/v1/referrals?limit=${limit}&offset=${offset}`);
    },

    useReferralCode: async (code: string): Promise<{ success: boolean; message?: string }> =>
        request('/api/v1/referrals/use', 'POST', { code }),
};
