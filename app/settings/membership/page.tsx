"use client";

import { useEffect, useState } from "react";
import { Crown, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { vip, MembershipPlan, SubscriptionInfo, TokenUsage } from "@/lib/api/vip";
import { useAuth } from "@/providers/auth-provider";
import { useTranslation } from "@/providers/language-provider";
import { PlanCard } from "@/components/vip/plan-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { showSuccess, showError } from "@/lib/toast-utils";

export default function MembershipSettingsPage() {
    const { language } = useTranslation();
    const { user } = useAuth();
    const router = useRouter();
    const [plans, setPlans] = useState<MembershipPlan[]>([]);
    const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
    const [tokenUsage, setTokenUsage] = useState<TokenUsage | null>(null);
    const [loading, setLoading] = useState(true);
    const [subscribing, setSubscribing] = useState<string | null>(null);

    useEffect(() => {
        async function loadMembershipData() {
            try {
                const [plansData, subscriptionData, tokenUsageData] = await Promise.all([
                    vip.getPlans(),
                    vip.getSubscription().catch(() => null),
                    vip.getTokenUsage().catch(() => null),
                ]);
                setPlans(plansData);
                setSubscription(subscriptionData);
                setTokenUsage(tokenUsageData);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        loadMembershipData();
    }, []);

    const onSubscribe = async (plan: MembershipPlan) => {
        setSubscribing(plan.id);
        try {
            // Mock subscription flow - replace with actual API call
            await new Promise(r => setTimeout(r, 2000));
            showSuccess(`Successfully subscribed to ${plan.name.en}!`);
            router.push('/settings/membership');
        } catch (e) {
            console.error(e);
            showError("Subscription failed.");
        } finally {
            setSubscribing(null);
        }
    };

    const getTierBadgeColor = (tier: string) => {
        switch (tier) {
            case 'ultra': return 'bg-yellow-500 text-white';
            case 'pro': return 'bg-purple-500 text-white';
            case 'basic': return 'bg-blue-500 text-white';
            default: return 'bg-gray-500 text-white';
        }
    };

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-500 text-white';
            case 'expired': return 'bg-red-500 text-white';
            case 'cancelled': return 'bg-gray-500 text-white';
            case 'pending': return 'bg-yellow-500 text-white';
            default: return 'bg-gray-500 text-white';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="animate-spin h-8 w-8" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-foreground">
                    {language === 'zh-Hans' ? '会员设置' : language === 'ja' ? 'メンバーシップ設定' : 'Membership Settings'}
                </h1>
                <p className="text-muted-foreground mt-1">
                    {language === 'zh-Hans' ? '管理您的会员订阅和使用情况' : language === 'ja' ? 'メンバーシップと使用状況を管理' : 'Manage your membership subscription and usage'}
                </p>
            </div>

            {/* Current Membership Status */}
            {subscription && (
                <Card className="mb-8">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                                    <Crown className="h-6 w-6 text-yellow-500" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl">
                                        {language === 'zh-Hans' ? '当前会员' : language === 'ja' ? '現在のメンバーシップ' : 'Current Membership'}
                                    </CardTitle>
                                    <CardDescription>
                                        {subscription.planId}
                                    </CardDescription>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Badge className={getTierBadgeColor(subscription.tier)}>
                                    {subscription.tier.toUpperCase()}
                                </Badge>
                                <Badge className={getStatusBadgeColor(subscription.status)}>
                                    {subscription.status}
                                </Badge>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">
                                    {language === 'zh-Hans' ? '开始日期' : language === 'ja' ? '開始日' : 'Start Date'}
                                </p>
                                <p className="font-semibold">
                                    {new Date(subscription.currentPeriodStart * 1000).toLocaleDateString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">
                                    {language === 'zh-Hans' ? '到期日期' : language === 'ja' ? '有効期限' : 'End Date'}
                                </p>
                                <p className="font-semibold">
                                    {new Date(subscription.currentPeriodEnd * 1000).toLocaleDateString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">
                                    {language === 'zh-Hans' ? '自动续费' : language === 'ja' ? '自動更新' : 'Auto Renew'}
                                </p>
                                <p className="font-semibold">
                                    {subscription.autoRenew ?
                                        (language === 'zh-Hans' ? '已开启' : language === 'ja' ? 'オン' : 'Enabled') :
                                        (language === 'zh-Hans' ? '已关闭' : language === 'ja' ? 'オフ' : 'Disabled')
                                    }
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Token Usage */}
            {tokenUsage && (
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            {language === 'zh-Hans' ? 'AI 配额使用情况' : language === 'ja' ? 'AIクオータ使用状況' : 'AI Quota Usage'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm text-muted-foreground">
                                        {language === 'zh-Hans' ? '已使用' : language === 'ja' ? '使用済み' : 'Used'}
                                    </span>
                                    <span className="text-sm font-semibold">
                                        {tokenUsage.used.toLocaleString()} / {tokenUsage.total.toLocaleString()}
                                    </span>
                                </div>
                                <Progress value={(tokenUsage.used / tokenUsage.total) * 100} />
                            </div>
                            <div className="grid md:grid-cols-2 gap-4 pt-2">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    <span className="text-sm">
                                        {language === 'zh-Hans' ? '剩余' : language === 'ja' ? '残り' : 'Remaining'}: {tokenUsage.remaining.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                                    <span className="text-sm">
                                        {language === 'zh-Hans' ? '重置日期' : language === 'ja' ? 'リセット日' : 'Reset Date'}: {new Date(tokenUsage.resetAt * 1000).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Available Plans */}
            <div className="mb-4">
                <h2 className="text-2xl font-bold mb-2">
                    {language === 'zh-Hans' ? '升级会员' : language === 'ja' ? 'メンバーシップアップグレード' : 'Upgrade Membership'}
                </h2>
                <p className="text-muted-foreground">
                    {language === 'zh-Hans' ? '选择最适合您的会员计划' : language === 'ja' ? '最適なプランを選択' : 'Choose the plan that works best for you'}
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {plans.map(plan => (
                    <PlanCard
                        key={plan.id}
                        plan={plan}
                        isCurrent={subscription?.planId === plan.id}
                        onSubscribe={onSubscribe}
                        loading={!!subscribing}
                    />
                ))}
            </div>

            {/* Manage Subscription Buttons */}
            {subscription && subscription.status === 'active' && (
                <div className="mt-8 flex gap-4 justify-center">
                    <Button variant="outline">
                        {language === 'zh-Hans' ? '取消订阅' : language === 'ja' ? '購読をキャンセル' : 'Cancel Subscription'}
                    </Button>
                    <Button variant="outline">
                        {language === 'zh-Hans' ? '更改计划' : language === 'ja' ? 'プランを変更' : 'Change Plan'}
                    </Button>
                </div>
            )}
        </div>
    );
}
