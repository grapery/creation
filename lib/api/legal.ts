import { apiClient, request } from './client';

export const legal = {
    getTermsOfService: async (lang?: string): Promise<{ content: string; updatedAt: string }> => {
        const params = lang ? `?lang=${lang}` : '';
        return request(`/api/v1/legal/terms-of-service${params}`, 'GET', undefined, apiClient);
    },

    getPrivacyPolicy: async (lang?: string): Promise<{ content: string; updatedAt: string }> => {
        const params = lang ? `?lang=${lang}` : '';
        return request(`/api/v1/legal/privacy-policy${params}`, 'GET', undefined, apiClient);
    },
};
