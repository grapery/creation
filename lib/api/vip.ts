import { apiClient, request } from './client';
import { VIPInfo } from '../types';

export interface VIPPlan {
    id: string;
    name: string;
    description: string;
    price: number;
    currency: string;
    interval: 'month' | 'year';
    features: string[];
}

export const vip = {
    // Get Current VIP Status
    getStatus: async (): Promise<VIPInfo> => {
        return request('/api/vip/status');
    },

    // Get Available Plans
    getPlans: async (): Promise<VIPPlan[]> => {
        // Mock plans for now
        return [
            {
                id: 'monthly',
                name: 'Pro Monthly',
                description: 'Unlock all creative tools.',
                price: 9.99,
                currency: 'USD',
                interval: 'month',
                features: ['Unlimited AI Generation', 'Exclusive Styles', 'Priority Support', 'No Ads']
            },
            {
                id: 'yearly',
                name: 'Pro Yearly',
                description: 'Best value for creators.',
                price: 99.99,
                currency: 'USD',
                interval: 'year',
                features: ['Unlimited AI Generation', 'Exclusive Styles', 'Priority Support', 'No Ads', '2 Months Free']
            }
        ];
    },

    // Subscribe
    subscribe: async (planId: string): Promise<{ success: boolean, url?: string }> => {
        return request('/api/vip/subscribe', 'POST', { planId });
    },

    // Cancel
    cancel: async (): Promise<void> => {
        return request('/api/vip/cancel', 'POST');
    }
};
