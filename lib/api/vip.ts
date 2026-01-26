import { apiClient, request } from './client';
import {
    VIPInfo,
    MembershipPlan,
    MembershipSKU,
    SubscriptionInfo,
    TokenUsage,
    MembershipTier,
    BillingCycle
} from '../types';

// Re-export types for convenience
export type { MembershipPlan, MembershipSKU, SubscriptionInfo, TokenUsage, MembershipTier, BillingCycle };

// Legacy VIPPlan interface for backward compatibility
export interface VIPPlan {
    id: string;
    name: string;
    description: string;
    price: number;
    currency: string;
    interval: 'month' | 'year';
    features: string[];
}

// Product SKU definitions
// These must match the iOS app's In-App Purchase product IDs
export const MEMBERSHIP_SKUS: Record<MembershipSKU, MembershipSKU> = {
    // Basic tier
    basic_month: 'basic_month',
    basic_quarter: 'basic_quarter',
    basic_year: 'basic_year',

    // Pro tier
    pro_month: 'pro_month',
    pro_quarter: 'pro_quarter',
    pro_year: 'pro_year',

    // Ultra tier
    ultra_month: 'ultra_month',
    ultra_quarter: 'ultra_quarter',
    ultra_year: 'ultra_year',
} as const;

// Membership plans data (could also come from backend)
export const MEMBERSHIP_PLANS: MembershipPlan[] = [
    // Basic tier plans
    {
        id: 'basic_month',
        tier: MembershipTier.BASIC,
        cycle: BillingCycle.MONTHLY,
        name: {
            en: 'Basic Monthly',
            zh: '基础会员 - 月付',
            ja: 'ベーシック月額',
        },
        description: {
            en: 'Perfect for getting started',
            zh: '适合入门用户',
            ja: '初心者に最適',
        },
        price: 499,  // $4.99
        currency: 'USD',
        features: ['basic_ai_quota', 'basic_roles', 'standard_export'],
        limits: {
            aiQuota: 100,
            maxRoles: 5,
            maxContexts: 3,
            maxStoryboards: 10,
            exportQuality: 'standard',
            prioritySupport: false,
            advancedFeatures: false,
        },
        trialDays: 7,
    },
    {
        id: 'basic_quarter',
        tier: MembershipTier.BASIC,
        cycle: BillingCycle.QUARTERLY,
        name: {
            en: 'Basic Quarterly',
            zh: '基础会员 - 季付',
            ja: 'ベーシック3ヶ月',
        },
        description: {
            en: 'Save 16% compared to monthly',
            zh: '季付节省16%',
            ja: '3ヶ月で16%お得',
        },
        price: 1299,  // $12.99
        originalPrice: 1497,  // $14.97 (3 months)
        currency: 'USD',
        discountPercent: 13,
        features: ['basic_ai_quota', 'basic_roles', 'standard_export'],
        limits: {
            aiQuota: 100,
            maxRoles: 5,
            maxContexts: 3,
            maxStoryboards: 10,
            exportQuality: 'standard',
            prioritySupport: false,
            advancedFeatures: false,
        },
    },
    {
        id: 'basic_year',
        tier: MembershipTier.BASIC,
        cycle: BillingCycle.YEARLY,
        name: {
            en: 'Basic Yearly',
            zh: '基础会员 - 年付',
            ja: 'ベーシック年額',
        },
        description: {
            en: 'Best value - save 50%',
            zh: '超值选择 - 年付省50%',
            ja: '最もお得 - 50%オフ',
        },
        price: 2999,  // $29.99
        originalPrice: 5988,  // $59.88 (12 months)
        currency: 'USD',
        discountPercent: 50,
        features: ['basic_ai_quota', 'basic_roles', 'standard_export'],
        limits: {
            aiQuota: 100,
            maxRoles: 5,
            maxContexts: 3,
            maxStoryboards: 10,
            exportQuality: 'standard',
            prioritySupport: false,
            advancedFeatures: false,
        },
    },

    // Pro tier plans
    {
        id: 'pro_month',
        tier: MembershipTier.PRO,
        cycle: BillingCycle.MONTHLY,
        name: {
            en: 'Pro Monthly',
            zh: '专业会员 - 月付',
            ja: 'プロ月額',
        },
        description: {
            en: 'For serious creators',
            zh: '专业创作者首选',
            ja: 'クリエイター向け',
        },
        price: 999,  // $9.99
        currency: 'USD',
        features: ['pro_ai_quota', 'pro_roles', 'high_export', 'priority_support'],
        limits: {
            aiQuota: 500,
            maxRoles: 20,
            maxContexts: 10,
            maxStoryboards: 50,
            exportQuality: 'high',
            prioritySupport: true,
            advancedFeatures: true,
        },
        popular: true,
        trialDays: 14,
    },
    {
        id: 'pro_quarter',
        tier: MembershipTier.PRO,
        cycle: BillingCycle.QUARTERLY,
        name: {
            en: 'Pro Quarterly',
            zh: '专业会员 - 季付',
            ja: 'プロ3ヶ月',
        },
        description: {
            en: 'Save 25% compared to monthly',
            zh: '季付节省25%',
            ja: '3ヶ月で25%お得',
        },
        price: 2499,  // $24.99
        originalPrice: 2997,  // $29.97
        currency: 'USD',
        discountPercent: 17,
        features: ['pro_ai_quota', 'pro_roles', 'high_export', 'priority_support'],
        limits: {
            aiQuota: 500,
            maxRoles: 20,
            maxContexts: 10,
            maxStoryboards: 50,
            exportQuality: 'high',
            prioritySupport: true,
            advancedFeatures: true,
        },
        popular: true,
    },
    {
        id: 'pro_year',
        tier: MembershipTier.PRO,
        cycle: BillingCycle.YEARLY,
        name: {
            en: 'Pro Yearly',
            zh: '专业会员 - 年付',
            ja: 'プロ年額',
        },
        description: {
            en: 'Best value - save 58%',
            zh: '超值选择 - 年付省58%',
            ja: '最もお得 - 58%オフ',
        },
        price: 4999,  // $49.99
        originalPrice: 11988,  // $119.88
        currency: 'USD',
        discountPercent: 58,
        features: ['pro_ai_quota', 'pro_roles', 'high_export', 'priority_support'],
        limits: {
            aiQuota: 500,
            maxRoles: 20,
            maxContexts: 10,
            maxStoryboards: 50,
            exportQuality: 'high',
            prioritySupport: true,
            advancedFeatures: true,
        },
        popular: true,
    },

    // Ultra tier plans
    {
        id: 'ultra_month',
        tier: MembershipTier.ULTRA,
        cycle: BillingCycle.MONTHLY,
        name: {
            en: 'Ultra Monthly',
            zh: '旗舰会员 - 月付',
            ja: 'ウルトラ月額',
        },
        description: {
            en: 'Unlimited everything',
            zh: '无限制体验',
            ja: '無制限の体験',
        },
        price: 1999,  // $19.99
        currency: 'USD',
        features: ['unlimited_ai', 'unlimited_roles', 'ultra_export', 'vip_support'],
        limits: {
            aiQuota: -1,  // -1 means unlimited
            maxRoles: -1,
            maxContexts: -1,
            maxStoryboards: -1,
            exportQuality: 'ultra',
            prioritySupport: true,
            advancedFeatures: true,
        },
        recommended: true,
    },
    {
        id: 'ultra_quarter',
        tier: MembershipTier.ULTRA,
        cycle: BillingCycle.QUARTERLY,
        name: {
            en: 'Ultra Quarterly',
            zh: '旗舰会员 - 季付',
            ja: 'ウルトラ3ヶ月',
        },
        description: {
            en: 'Save 25% compared to monthly',
            zh: '季付节省25%',
            ja: '3ヶ月で25%お得',
        },
        price: 4999,  // $49.99
        originalPrice: 5997,  // $59.97
        currency: 'USD',
        discountPercent: 17,
        features: ['unlimited_ai', 'unlimited_roles', 'ultra_export', 'vip_support'],
        limits: {
            aiQuota: -1,
            maxRoles: -1,
            maxContexts: -1,
            maxStoryboards: -1,
            exportQuality: 'ultra',
            prioritySupport: true,
            advancedFeatures: true,
        },
        recommended: true,
    },
    {
        id: 'ultra_year',
        tier: MembershipTier.ULTRA,
        cycle: BillingCycle.YEARLY,
        name: {
            en: 'Ultra Yearly',
            zh: '旗舰会员 - 年付',
            ja: 'ウルトラ年額',
        },
        description: {
            en: 'Best value - save 58%',
            zh: '超值选择 - 年付省58%',
            ja: '最もお得 - 58%オフ',
        },
        price: 9999,  // $99.99
        originalPrice: 23988,  // $239.88
        currency: 'USD',
        discountPercent: 58,
        features: ['unlimited_ai', 'unlimited_roles', 'ultra_export', 'vip_support'],
        limits: {
            aiQuota: -1,
            maxRoles: -1,
            maxContexts: -1,
            maxStoryboards: -1,
            exportQuality: 'ultra',
            prioritySupport: true,
            advancedFeatures: true,
        },
        recommended: true,
    },
];

export const vip = {
    // Get Current VIP Status
    getStatus: async (): Promise<VIPInfo> => {
        return request('/api/vip/status');
    },

    // Get Token Usage
    getTokenUsage: async (): Promise<TokenUsage> => {
        return request('/api/vip/usage');
    },

    // Get Subscription Info
    getSubscription: async (): Promise<SubscriptionInfo> => {
        return request('/api/vip/subscription');
    },

    // Get Available Plans
    getPlans: async (): Promise<MembershipPlan[]> => {
        // Return plans from backend, fallback to static data
        try {
            return await request('/api/vip/plans');
        } catch {
            return MEMBERSHIP_PLANS;
        }
    },

    // Get Plans by Tier
    getPlansByTier: async (tier: MembershipTier): Promise<MembershipPlan[]> => {
        const plans = await vip.getPlans();
        return plans.filter(plan => plan.tier === tier);
    },

    // Subscribe to a plan
    subscribe: async (planId: MembershipSKU): Promise<{ success: boolean; subscription?: SubscriptionInfo; paymentUrl?: string }> => {
        return request('/api/vip/subscribe', 'POST', { planId });
    },

    // Cancel subscription
    cancelSubscription: async (): Promise<void> => {
        return request('/api/vip/subscription/cancel', 'POST');
    },

    // Update subscription plan
    updatePlan: async (newPlanId: MembershipSKU): Promise<{ success: boolean; subscription?: SubscriptionInfo }> => {
        return request('/api/vip/subscription/update', 'POST', { planId: newPlanId });
    },

    // Toggle auto-renew
    toggleAutoRenew: async (enabled: boolean): Promise<void> => {
        return request('/api/vip/subscription/auto-renew', 'PUT', { enabled });
    },

    // Get payment history
    getPaymentHistory: async (page = 1, limit = 20): Promise<{
        payments: Array<{
            id: string;
            date: number;
            amount: number;
            currency: string;
            status: string;
            planId: MembershipSKU;
        }>;
        total: number;
        page: number;
        limit: number;
    }> => {
        const offset = (page - 1) * limit;
        return request(`/api/vip/payments?limit=${limit}&offset=${offset}`);
    },

    // Redeem promo code
    redeemPromoCode: async (code: string): Promise<{
        success: boolean;
        discount?: number;
        message?: string;
    }> => {
        return request('/api/vip/promo/redeem', 'POST', { code });
    },
};

// Helper functions
export function getPlanById(planId: MembershipSKU): MembershipPlan | undefined {
    return MEMBERSHIP_PLANS.find(plan => plan.id === planId);
}

export function getPlansByTier(tier: MembershipTier): MembershipPlan[] {
    return MEMBERSHIP_PLANS.filter(plan => plan.tier === tier);
}

export function getPlansByCycle(cycle: BillingCycle): MembershipPlan[] {
    return MEMBERSHIP_PLANS.filter(plan => plan.cycle === cycle);
}

export function formatPrice(priceInCents: number, currency = 'USD'): string {
    const dollars = priceInCents / 100;
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
    }).format(dollars);
}

export function getSavingsPercent(plan: MembershipPlan): number {
    return plan.discountPercent || 0;
}
