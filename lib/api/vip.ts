import { paymentClient, request } from './client';
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

// Helper function to make requests to payment service
const paymentRequest = async <T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: any
): Promise<T> => {
    return request(endpoint, method, body, paymentClient);
};

// Backend VIP endpoints (from vippay service):
// GET /api/vippay/vip/info - Get VIP info
// GET /api/vippay/vip/check - Check if user is VIP
// GET /api/vippay/vip/quota - Get quota usage
// GET /api/vippay/vip/max-roles - Get max roles limit
// GET /api/vippay/vip/max-contexts - Get max contexts limit

export const vip = {
    // Get Current VIP Status
    // Note: Using /api/vippay/vip/info endpoint on payment service (8060)
    getStatus: async (): Promise<VIPInfo> => {
        return paymentRequest('/api/vippay/vip/info');
    },

    // Check if user is VIP
    checkIsVip: async (): Promise<{ isVip: boolean }> => {
        return paymentRequest('/api/vippay/vip/check');
    },

    // Get Token/Quota Usage
    // Note: Backend uses /quota not /usage, and returns different field names
    getTokenUsage: async (): Promise<TokenUsage> => {
        const response = await paymentRequest<{
            quota_used: number;
            quota_limit: number;
            remaining: number;
        }>('/api/vippay/vip/quota');
        // Transform to TokenUsage format
        return {
            total: response.quota_limit,
            used: response.quota_used,
            remaining: response.remaining,
            resetAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // Approximate next month
        };
    },

    // Get Max Roles
    getMaxRoles: async (): Promise<{ max_roles: number }> => {
        return paymentRequest('/api/vippay/vip/max-roles');
    },

    // Get Max Contexts
    getMaxContexts: async (): Promise<{ max_contexts: number }> => {
        return paymentRequest('/api/vippay/vip/max-contexts');
    },

    // Get Subscription Info
    // Note: Backend doesn't have this endpoint, use getStatus instead
    getSubscription: async (): Promise<SubscriptionInfo> => {
        const info = await vip.getStatus();
        // Transform VIPInfo to SubscriptionInfo format
        // Note: planId from backend might not match MembershipSKU type
        const planId = (info.planId || 'basic_month') as MembershipSKU;
        return {
            id: info.userId || '',
            userId: info.userId || '',
            planId: planId,
            tier: info.level > 0 ? MembershipTier.PRO : MembershipTier.BASIC,
            status: info.isVip ? 'active' : ('cancelled' as const),
            autoRenew: info.autoRenew,
            currentPeriodStart: Date.now(),
            currentPeriodEnd: info.expiresAt ? new Date(info.expiresAt).getTime() : Date.now(),
            cancelAtPeriodEnd: false,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };
    },

    // Get Available Plans
    // Note: Backend doesn't have this endpoint, use static data
    getPlans: async (): Promise<MembershipPlan[]> => {
        return MEMBERSHIP_PLANS;
    },

    // Get Plans by Tier
    getPlansByTier: async (tier: MembershipTier): Promise<MembershipPlan[]> => {
        const plans = await vip.getPlans();
        return plans.filter(plan => plan.tier === tier);
    },

    // Subscribe to a plan
    // Note: Backend doesn't have direct subscribe endpoint
    // This should be handled via IAP (Apple/Google) or web payment flow
    subscribe: async (_planId: MembershipSKU): Promise<{ success: boolean; subscription?: SubscriptionInfo; paymentUrl?: string }> => {
        console.warn('Direct subscribe not implemented in backend. Use IAP flow instead.');
        return { success: false };
    },

    // Cancel subscription
    // Note: Backend doesn't have this endpoint
    cancelSubscription: async (): Promise<void> => {
        console.warn('Cancel subscription not implemented in backend');
        return Promise.resolve();
    },

    // Update subscription plan
    // Note: Backend doesn't have this endpoint
    updatePlan: async (_newPlanId: MembershipSKU): Promise<{ success: boolean; subscription?: SubscriptionInfo }> => {
        console.warn('Update plan not implemented in backend');
        return { success: false };
    },

    // Toggle auto-renew
    // Note: Backend doesn't have this endpoint
    toggleAutoRenew: async (_enabled: boolean): Promise<void> => {
        console.warn('Toggle auto-renew not implemented in backend');
        return Promise.resolve();
    },

    // Get payment history
    // Note: Backend doesn't have this endpoint
    getPaymentHistory: async (_page = 1, _limit = 20): Promise<{
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
        console.warn('Payment history not implemented in backend');
        return {
            payments: [],
            total: 0,
            page: 1,
            limit: 20,
        };
    },

    // Redeem promo code
    // Note: Backend doesn't have this endpoint
    redeemPromoCode: async (_code: string): Promise<{
        success: boolean;
        discount?: number;
        message?: string;
    }> => {
        console.warn('Promo code redemption not implemented in backend');
        return { success: false, message: 'Not implemented' };
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
