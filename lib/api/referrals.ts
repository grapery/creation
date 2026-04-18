import { request } from './client';
import type { ReferralInfo, ReferralStats } from '../types';

export const referrals = {
    getCode: async (): Promise<{ referralCode: string }> =>
        request('/api/referrals/code'),

    getShareContent: async (): Promise<ReferralInfo> =>
        request('/api/referrals/share'),

    getStats: async (): Promise<ReferralStats> =>
        request('/api/referrals/stats'),

    list: async (page = 1, limit = 20): Promise<{ referrals: any[]; total: number }> => {
        const offset = (page - 1) * limit;
        return request(`/api/referrals?limit=${limit}&offset=${offset}`);
    },

    useReferralCode: async (code: string): Promise<{ success: boolean; message?: string }> =>
        request('/api/referrals/use', 'POST', { code }),
};
