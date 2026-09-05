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

export type { MembershipPlan, MembershipSKU, SubscriptionInfo, TokenUsage, MembershipTier, BillingCycle };

export interface VIPPlan {
    id: string;
    name: string;
    description: string;
    price: number;
    currency: string;
    interval: 'month' | 'year';
    features: string[];
}

export const MEMBERSHIP_SKUS: Record<MembershipSKU, MembershipSKU> = {
    free_monthly: 'free_monthly',
    free_yearly: 'free_yearly',
    basic_monthly: 'basic_monthly',
    basic_yearly: 'basic_yearly',
    premium_monthly: 'premium_monthly',
    premium_yearly: 'premium_yearly',
} as const;

export const MEMBERSHIP_PLANS: MembershipPlan[] = [
    {
        id: 'basic_monthly',
        tier: MembershipTier.BASIC,
        cycle: BillingCycle.MONTHLY,
        name: { en: 'Basic Monthly', zh: '基础会员 - 月付', ja: 'ベーシック月額' },
        description: { en: 'For serious creators', zh: '专业创作者首选', ja: 'クリエイター向け' },
        price: 999,
        currency: 'USD',
        features: ['basic_ai_quota', 'basic_roles', 'high_export', 'priority_support'],
        limits: { aiQuota: 500, maxRoles: 20, maxContexts: 10, maxStoryboards: 50, exportQuality: 'high', prioritySupport: true, advancedFeatures: true },
        popular: true,
        trialDays: 14,
    },
    {
        id: 'basic_yearly',
        tier: MembershipTier.BASIC,
        cycle: BillingCycle.YEARLY,
        name: { en: 'Basic Yearly', zh: '基础会员 - 年付', ja: 'ベーシック年額' },
        description: { en: 'Best value - save 58%', zh: '超值选择 - 年付省58%', ja: '最もお得 - 58%オフ' },
        price: 4999,
        originalPrice: 11988,
        currency: 'USD',
        discountPercent: 58,
        features: ['basic_ai_quota', 'basic_roles', 'high_export', 'priority_support'],
        limits: { aiQuota: 500, maxRoles: 20, maxContexts: 10, maxStoryboards: 50, exportQuality: 'high', prioritySupport: true, advancedFeatures: true },
        popular: true,
    },
    {
        id: 'premium_monthly',
        tier: MembershipTier.PREMIUM,
        cycle: BillingCycle.MONTHLY,
        name: { en: 'Premium Monthly', zh: '高级会员 - 月付', ja: 'プレミアム月額' },
        description: { en: 'Unlimited everything', zh: '无限制体验', ja: '無制限の体験' },
        price: 1999,
        currency: 'USD',
        features: ['unlimited_ai', 'unlimited_roles', 'ultra_export', 'vip_support'],
        limits: { aiQuota: -1, maxRoles: -1, maxContexts: -1, maxStoryboards: -1, exportQuality: 'ultra', prioritySupport: true, advancedFeatures: true },
        recommended: true,
    },
    {
        id: 'premium_yearly',
        tier: MembershipTier.PREMIUM,
        cycle: BillingCycle.YEARLY,
        name: { en: 'Premium Yearly', zh: '高级会员 - 年付', ja: 'プレミアム年額' },
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

const paymentRequest = async <T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: unknown
): Promise<T> => {
    return request(endpoint, method, body, paymentClient);
};

interface BackendMembershipPlan {
    id: string;
    tier: string;
    period: string;
    iapProductId?: string;
    price: number;
    perMonth?: number;
    aiQuota?: number;
    features?: string[];
    isActive?: boolean;
    sortOrder?: number;
    name?: string;
    description?: string;
    currency?: string;
}

function mapTier(tier: string): MembershipTier {
    const t = (tier || '').toLowerCase();
    if (t === 'premium' || t === 'prime' || t === 'ultra') return MembershipTier.PREMIUM;
    if (t === 'basic' || t === 'pro') return MembershipTier.BASIC;
    return MembershipTier.FREE;
}

function mapCycle(period: string): BillingCycle {
    return period === 'yearly' ? BillingCycle.YEARLY : BillingCycle.MONTHLY;
}

/** Backend stores major units (e.g. 29.90); UI/Stripe use smallest unit. */
function toCents(price: number): number {
    if (!Number.isFinite(price)) return 0;
    // Already looks like cents for typical USD plans
    if (Number.isInteger(price) && price >= 100 && price % 1 === 0 && price > 200) {
        // Heuristic: integer >= 100 could be cents OR yuan without decimals — prefer major*100 when < 1000
    }
    // Seed data uses major units like 29.90
    return Math.round(price * 100);
}

function localizePlanName(tier: MembershipTier, cycle: BillingCycle): MembershipPlan['name'] {
    const names: Record<MembershipTier, MembershipPlan['name']> = {
        [MembershipTier.FREE]: {
            en: cycle === BillingCycle.YEARLY ? 'Free Yearly' : 'Free Monthly',
            zh: cycle === BillingCycle.YEARLY ? '免费 - 年付' : '免费 - 月付',
            ja: cycle === BillingCycle.YEARLY ? '無料年額' : '無料月額',
        },
        [MembershipTier.BASIC]: {
            en: cycle === BillingCycle.YEARLY ? 'Basic Yearly' : 'Basic Monthly',
            zh: cycle === BillingCycle.YEARLY ? '基础会员 - 年付' : '基础会员 - 月付',
            ja: cycle === BillingCycle.YEARLY ? 'ベーシック年額' : 'ベーシック月額',
        },
        [MembershipTier.PREMIUM]: {
            en: cycle === BillingCycle.YEARLY ? 'Premium Yearly' : 'Premium Monthly',
            zh: cycle === BillingCycle.YEARLY ? '高级会员 - 年付' : '高级会员 - 月付',
            ja: cycle === BillingCycle.YEARLY ? 'プレミアム年額' : 'プレミアム月額',
        },
    };
    return names[tier];
}

function mapBackendPlan(p: BackendMembershipPlan): MembershipPlan {
    const tier = mapTier(p.tier);
    const cycle = mapCycle(p.period || 'monthly');
    const fallbackId = `${tier}_${cycle}` as MembershipSKU;
    return {
        id: (p.id || fallbackId) as MembershipSKU,
        tier,
        cycle,
        name: localizePlanName(tier, cycle),
        description: {
            en: p.description || '',
            zh: p.description || '',
            ja: p.description || '',
        },
        price: toCents(Number(p.price)),
        currency: p.currency || 'CNY',
        features: p.features || [],
        limits: {
            aiQuota: p.aiQuota ?? 0,
            maxRoles: 0,
            maxContexts: 0,
            maxStoryboards: 0,
            exportQuality: tier === MembershipTier.PREMIUM ? 'ultra' : 'high',
            prioritySupport: tier !== MembershipTier.FREE,
            advancedFeatures: tier === MembershipTier.PREMIUM,
        },
        popular: tier === MembershipTier.BASIC,
        recommended: tier === MembershipTier.PREMIUM,
    };
}

export const vip = {
    getStatus: async (): Promise<VIPInfo> => {
        const raw = await paymentRequest<Record<string, unknown>>('/api/vippay/vip/info');
        const expires =
            (raw.expiresAt as string | undefined) ??
            (raw.expires_at as string | undefined) ??
            undefined;
        const starts =
            (raw.startsAt as string | undefined) ??
            (raw.starts_at as string | undefined) ??
            undefined;
        const planRaw = raw.planId ?? raw.plan_id;
        return {
            userId: String(raw.userId ?? raw.user_id ?? ''),
            isVip: Boolean(raw.isVip ?? raw.is_vip),
            level: Number(raw.level ?? 0),
            status: Number(raw.status ?? 0),
            autoRenew: Boolean(raw.autoRenew ?? raw.auto_renew),
            quotaUsed: Number(raw.quotaUsed ?? raw.quota_used ?? 0),
            quotaLimit: Number(raw.quotaLimit ?? raw.quota_limit ?? 0),
            maxRoles: Number(raw.maxRoles ?? raw.max_roles ?? 0),
            maxContexts: Number(raw.maxContexts ?? raw.max_contexts ?? 0),
            startsAt: starts ?? undefined,
            expiresAt: expires ?? undefined,
            planId: planRaw != null && planRaw !== '' ? String(planRaw) : undefined,
            subscriptionId: (raw.subscriptionId ?? raw.subscription_id) as string | undefined,
        };
    },

    checkIsVip: async (): Promise<{ isVip: boolean }> => {
        const raw = await paymentRequest<Record<string, unknown>>('/api/vippay/vip/check');
        return { isVip: Boolean(raw.isVip ?? raw.is_vip) };
    },

    getTokenUsage: async (): Promise<TokenUsage> => {
        const [response, status] = await Promise.all([
            paymentRequest<{
                quota_used?: number;
                quota_limit?: number;
                remaining?: number;
                quotaUsed?: number;
                quotaLimit?: number;
            }>('/api/vippay/vip/quota'),
            vip.getStatus().catch(() => null),
        ]);
        const used = response.quota_used ?? response.quotaUsed ?? 0;
        const total = response.quota_limit ?? response.quotaLimit ?? 0;
        const remaining = response.remaining ?? Math.max(0, total - used);
        const periodEndsAt = status?.expiresAt ? new Date(status.expiresAt).getTime() : 0;
        return {
            total,
            used,
            remaining,
            resetAt: periodEndsAt,
            periodEndsAt: periodEndsAt || undefined,
        };
    },

    getMaxRoles: async (): Promise<{ max_roles: number }> => {
        return paymentRequest('/api/vippay/vip/max-roles');
    },

    getMaxContexts: async (): Promise<{ max_contexts: number }> => {
        return paymentRequest('/api/vippay/vip/max-contexts');
    },

    getSubscription: async (): Promise<SubscriptionInfo> => {
        const info = await vip.getStatus();
        const planId = (info.planId || 'free_monthly') as MembershipSKU;
        const periodStart = info.startsAt ? new Date(info.startsAt).getTime() : 0;
        const periodEnd = info.expiresAt ? new Date(info.expiresAt).getTime() : 0;
        const now = Date.now();

        let status: SubscriptionInfo['status'] = 'expired';
        if (info.isVip) {
            // Backend status: 1 active, 2 expired, 3 canceled, 4 pending, ...
            if (info.status === 3) status = 'cancelled';
            else if (info.status === 4) status = 'pending';
            else if (periodEnd > 0 && periodEnd < now) status = 'expired';
            else status = 'active';
        } else if (info.status === 3) {
            status = 'cancelled';
        } else if (periodEnd > 0 && periodEnd < now) {
            status = 'expired';
        }

        return {
            id: info.subscriptionId || info.userId || '',
            userId: info.userId || '',
            planId: planId,
            tier: info.level >= 2 ? MembershipTier.PREMIUM : info.level >= 1 ? MembershipTier.BASIC : MembershipTier.FREE,
            status,
            autoRenew: info.autoRenew,
            currentPeriodStart: periodStart,
            currentPeriodEnd: periodEnd,
            cancelAtPeriodEnd: status === 'cancelled',
            createdAt: periodStart || now,
            updatedAt: now,
        };
    },

    getPlans: async (): Promise<MembershipPlan[]> => {
        try {
            const data = await request<{ plans?: BackendMembershipPlan[] } | BackendMembershipPlan[]>(
                '/api/v1/membership/plans'
            );
            const list = Array.isArray(data)
                ? data
                : Array.isArray(data?.plans)
                    ? data.plans
                    : [];
            const mapped = list
                .filter((p) => p.isActive !== false)
                .map(mapBackendPlan)
                .filter((p) => p.tier !== MembershipTier.FREE);
            if (mapped.length > 0) return mapped;
        } catch {
            // Fallback to static data
        }
        return MEMBERSHIP_PLANS;
    },

    getPlansByTier: async (tier: MembershipTier): Promise<MembershipPlan[]> => {
        const plans = await vip.getPlans();
        return plans.filter(plan => plan.tier === tier);
    },

    /** Backend SubscribeRequest: { tier, period } — not planId */
    subscribe: async (
        planOrId: MembershipPlan | MembershipSKU
    ): Promise<{ success: boolean; subscription?: SubscriptionInfo; paymentUrl?: string; orderId?: string; status?: string }> => {
        let tier: string;
        let period: string;
        if (typeof planOrId === 'string') {
            const [t, p] = planOrId.split('_');
            tier = t;
            period = p === 'yearly' ? 'yearly' : 'monthly';
        } else {
            tier = planOrId.tier;
            period = planOrId.cycle;
        }
        const res = await request<{ orderId?: string; paymentUrl?: string; status?: string }>(
            '/api/v1/membership/subscribe',
            'POST',
            { tier, period }
        );
        return {
            success: true,
            paymentUrl: res?.paymentUrl,
            orderId: res?.orderId,
            status: res?.status,
        };
    },

    cancelSubscription: async (): Promise<void> => {
        return request('/api/v1/membership/cancel', 'POST');
    },

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
        return request('/api/v1/membership/usage');
    },

    getCurrentMembership: async (): Promise<unknown> => {
        return request('/api/v1/membership/current');
    },
};

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
    return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: currency || 'USD',
    }).format(dollars);
}

export function getSavingsPercent(plan: MembershipPlan): number {
    return plan.discountPercent || 0;
}
