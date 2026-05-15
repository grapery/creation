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
export const MEMBERSHIP_SKUS: Record<MembershipSKU, MembershipSKU> = {
    // Free tier
    free_monthly: 'free_monthly',
    free_quarterly: 'free_quarterly',
    free_yearly: 'free_yearly',

    // Pro tier
    pro_monthly: 'pro_monthly',
    pro_quarterly: 'pro_quarterly',
    pro_yearly: 'pro_yearly',

    // Prime tier
    prime_monthly: 'prime_monthly',
    prime_quarterly: 'prime_quarterly',
    prime_yearly: 'prime_yearly',

    // Ultra tier
    ultra_monthly: 'ultra_monthly',
    ultra_quarterly: 'ultra_quarterly',
    ultra_yearly: 'ultra_yearly',
} as const;

// Membership plans data — fallback when backend is unavailable
export const MEMBERSHIP_PLANS: MembershipPlan[] = [
    // Pro tier plans
    {
        id: 'pro_monthly',
        tier: MembershipTier.PRO,
        cycle: BillingCycle.MONTHLY,
        name: { en: 'Pro Monthly', zh: '专业会员 - 月付', ja: 'プロ月額' },
        description: { en: 'For serious creators', zh: '专业创作者首选', ja: 'クリエイター向け' },
        price: 999,
        currency: 'USD',
        features: ['pro_ai_quota', 'pro_roles', 'high_export', 'priority_support'],
        limits: { aiQuota: 500, maxRoles: 20, maxContexts: 10, maxStoryboards: 50, exportQuality: 'high', prioritySupport: true, advancedFeatures: true },
        popular: true,
        trialDays: 14,
    },
    {
        id: 'pro_quarterly',
        tier: MembershipTier.PRO,
        cycle: BillingCycle.QUARTERLY,
        name: { en: 'Pro Quarterly', zh: '专业会员 - 季付', ja: 'プロ3ヶ月' },
        description: { en: 'Save 25% compared to monthly', zh: '季付节省25%', ja: '3ヶ月で25%お得' },
        price: 2499,
        originalPrice: 2997,
        currency: 'USD',
        discountPercent: 17,
        features: ['pro_ai_quota', 'pro_roles', 'high_export', 'priority_support'],
        limits: { aiQuota: 500, maxRoles: 20, maxContexts: 10, maxStoryboards: 50, exportQuality: 'high', prioritySupport: true, advancedFeatures: true },
        popular: true,
    },
    {
        id: 'pro_yearly',
        tier: MembershipTier.PRO,
        cycle: BillingCycle.YEARLY,
        name: { en: 'Pro Yearly', zh: '专业会员 - 年付', ja: 'プロ年額' },
        description: { en: 'Best value - save 58%', zh: '超值选择 - 年付省58%', ja: '最もお得 - 58%オフ' },
        price: 4999,
        originalPrice: 11988,
        currency: 'USD',
        discountPercent: 58,
        features: ['pro_ai_quota', 'pro_roles', 'high_export', 'priority_support'],
        limits: { aiQuota: 500, maxRoles: 20, maxContexts: 10, maxStoryboards: 50, exportQuality: 'high', prioritySupport: true, advancedFeatures: true },
        popular: true,
    },

    // Prime tier plans
    {
        id: 'prime_monthly',
        tier: MembershipTier.PRIME,
        cycle: BillingCycle.MONTHLY,
        name: { en: 'Prime Monthly', zh: '尊享会员 - 月付', ja: 'プライム月額' },
        description: { en: 'Advanced creator tools', zh: '高级创作工具', ja: '高度なクリエイターツール' },
        price: 1499,
        currency: 'USD',
        features: ['prime_ai_quota', 'prime_roles', 'ultra_export', 'priority_support'],
        limits: { aiQuota: 1000, maxRoles: 50, maxContexts: 20, maxStoryboards: 100, exportQuality: 'ultra', prioritySupport: true, advancedFeatures: true },
    },
    {
        id: 'prime_quarterly',
        tier: MembershipTier.PRIME,
        cycle: BillingCycle.QUARTERLY,
        name: { en: 'Prime Quarterly', zh: '尊享会员 - 季付', ja: 'プライム3ヶ月' },
        description: { en: 'Save 25% compared to monthly', zh: '季付节省25%', ja: '3ヶ月で25%お得' },
        price: 3999,
        originalPrice: 4497,
        currency: 'USD',
        discountPercent: 11,
        features: ['prime_ai_quota', 'prime_roles', 'ultra_export', 'priority_support'],
        limits: { aiQuota: 1000, maxRoles: 50, maxContexts: 20, maxStoryboards: 100, exportQuality: 'ultra', prioritySupport: true, advancedFeatures: true },
    },
    {
        id: 'prime_yearly',
        tier: MembershipTier.PRIME,
        cycle: BillingCycle.YEARLY,
        name: { en: 'Prime Yearly', zh: '尊享会员 - 年付', ja: 'プライム年額' },
        description: { en: 'Best value - save 50%', zh: '超值选择 - 年付省50%', ja: '最もお得 - 50%オフ' },
        price: 7999,
        originalPrice: 17988,
        currency: 'USD',
        discountPercent: 56,
        features: ['prime_ai_quota', 'prime_roles', 'ultra_export', 'priority_support'],
        limits: { aiQuota: 1000, maxRoles: 50, maxContexts: 20, maxStoryboards: 100, exportQuality: 'ultra', prioritySupport: true, advancedFeatures: true },
    },

    // Ultra tier plans
    {
        id: 'ultra_monthly',
        tier: MembershipTier.ULTRA,
        cycle: BillingCycle.MONTHLY,
        name: { en: 'Ultra Monthly', zh: '旗舰会员 - 月付', ja: 'ウルトラ月額' },
        description: { en: 'Unlimited everything', zh: '无限制体验', ja: '無制限の体験' },
        price: 1999,
        currency: 'USD',
        features: ['unlimited_ai', 'unlimited_roles', 'ultra_export', 'vip_support'],
        limits: { aiQuota: -1, maxRoles: -1, maxContexts: -1, maxStoryboards: -1, exportQuality: 'ultra', prioritySupport: true, advancedFeatures: true },
        recommended: true,
    },
    {
        id: 'ultra_quarterly',
        tier: MembershipTier.ULTRA,
        cycle: BillingCycle.QUARTERLY,
        name: { en: 'Ultra Quarterly', zh: '旗舰会员 - 季付', ja: 'ウルトラ3ヶ月' },
        description: { en: 'Save 25% compared to monthly', zh: '季付节省25%', ja: '3ヶ月で25%お得' },
        price: 4999,
        originalPrice: 5997,
        currency: 'USD',
        discountPercent: 17,
        features: ['unlimited_ai', 'unlimited_roles', 'ultra_export', 'vip_support'],
        limits: { aiQuota: -1, maxRoles: -1, maxContexts: -1, maxStoryboards: -1, exportQuality: 'ultra', prioritySupport: true, advancedFeatures: true },
        recommended: true,
    },
    {
        id: 'ultra_yearly',
        tier: MembershipTier.ULTRA,
        cycle: BillingCycle.YEARLY,
        name: { en: 'Ultra Yearly', zh: '旗舰会员 - 年付', ja: 'ウルトラ年額' },
        description: { en: 'Best value - save 58%', zh: '超值选择 - 年付省58%', ja: '最もお得 - 58%オフ' },
        price: 9999,
        originalPrice: 23988,
        currency: 'USD',
        discountPercent: 58,
        features: ['unlimited_ai', 'unlimited_roles', 'ultra_export', 'vip_support'],
        limits: { aiQuota: -1, maxRoles: -1, maxContexts: -1, maxStoryboards: -1, exportQuality: 'ultra', prioritySupport: true, advancedFeatures: true },
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
        const planId = (info.planId || 'free_monthly') as MembershipSKU;
        return {
            id: info.userId || '',
            userId: info.userId || '',
            planId: planId,
            tier: info.level > 0 ? MembershipTier.PRO : MembershipTier.FREE,
            status: info.isVip ? 'active' : ('cancelled' as const),
            autoRenew: info.autoRenew,
            currentPeriodStart: Date.now(),
            currentPeriodEnd: info.expiresAt ? new Date(info.expiresAt).getTime() : Date.now(),
            cancelAtPeriodEnd: false,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };
    },

    // Get Available Plans — now fetches from backend
    getPlans: async (): Promise<MembershipPlan[]> => {
        try {
            const backendPlans = await request<any[]>('/api/membership/plans');
            if (backendPlans && backendPlans.length > 0) {
                return backendPlans;
            }
        } catch {
            // Fallback to static data
        }
        return MEMBERSHIP_PLANS;
    },

    // Get Plans by Tier
    getPlansByTier: async (tier: MembershipTier): Promise<MembershipPlan[]> => {
        const plans = await vip.getPlans();
        return plans.filter(plan => plan.tier === tier);
    },

    // Subscribe to a plan — now calls backend
    subscribe: async (planId: MembershipSKU): Promise<{ success: boolean; subscription?: SubscriptionInfo; paymentUrl?: string }> => {
        return request('/api/membership/subscribe', 'POST', { planId });
    },

    // Cancel subscription — now calls backend
    cancelSubscription: async (): Promise<void> => {
        return request('/api/membership/cancel', 'POST');
    },

    // Get membership usage
    getUsage: async (): Promise<{
        aiUsedThisMonth: number;
        aiLimit: number;
        isUnlimited: boolean;
        remainingQuota: number;
        storyboardsCreated: number;
        storyboardsLimit: number;
        charactersCreated: number;
        charactersLimit: number;
    }> => {
        return request('/api/membership/usage');
    },

    // Get current membership status
    getCurrentMembership: async (): Promise<any> => {
        return request('/api/membership/current');
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
