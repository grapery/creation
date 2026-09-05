import { request } from './client';
import type { PlazaResponse } from '@/lib/types';

export const plaza = {
    // Get all plaza sections for discovery page
    getSections: async (): Promise<PlazaResponse> => {
        return request('/api/v1/plaza');
    },
};
