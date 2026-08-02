"use client";

import { useEffect, useState } from "react";
import { Crown, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { vip, MembershipPlan, SubscriptionInfo, TokenUsage } from "@/lib/api/vip";
import { useAuth } from "@/providers/auth-provider";
import { useTranslation } from "@/providers/language-provider";
import { PlanCard } from "@/components/vip/plan-card";
import { PaymentDialog } from "@/components/payment/payment-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { showSuccess, showError } from "@/lib/toast-utils";

export default function MembershipSettingsPage() {
    const { t, language } = useTranslation();
    const { user, refreshUser } = useAuth();
    const router = useRouter();
    const [plans, setPlans] = useState<MembershipPlan[]>([]);
    const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
    const [tokenUsage, setTokenUsage] = useState<TokenUsage | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);
    const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

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

    const onSubscribe = (plan: MembershipPlan) => {
        if (!user) {
            showError("Please sign in to subscribe");
            router.push("/login");
            return;
        }
        setSelectedPlan(plan);
        setPaymentDialogOpen(true);
    };

    const handlePaymentSuccess = async () => {
        await refreshUser?.();
        const subscriptionData = await vip.getSubscription().catch(() => null);
        setSubscription(subscriptionData);
        const planName =
            selectedPlan?.name[language as keyof typeof selectedPlan.name] ||
            selectedPlan?.name.en ||
            "";
        showSuccess(
            t("vip_payment.subscribe_success", "Successfully subscribed to {plan}!").replace(
                "{plan}",
                planName
            )
        );
        setPaymentDialogOpen(false);
    };

    const handlePaymentError = (error: string) => {
        showError(error || "Payment failed");
    };

    const onCancelSubscription = async () => {
        try {
            await vip.cancelSubscription();
            showSuccess("Subscription cancelled.");
            const subscriptionData = await vip.getSubscription().catch(() => null);
            setSubscription(subscriptionData);
        } catch (e: unknown) {
            showError(e instanceof Error ? e.message : "Failed to cancel subscription.");
        }
    };

    const getTierBadgeColor = (tier: string) => {
        switch (tier) {
            case "premium": return "bg-yellow-500 text-white";
            case "basic": return "bg-blue-500 text-white";
            default: return "bg-gray-500 text-white";
        }
    };

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case "active": return "bg-green-500 text-white";
            case "expired": return "bg-red-500 text-white";
            case "cancelled": return "bg-gray-500 text-white";
            case "pending": return "bg-yellow-500 text-white";
            default: return "bg-gray-500 text-white";
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
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-foreground">
                    {t("membership_settings.title")}
                </h1>
                <p className="text-muted-foreground mt-1">
                    {t("membership_settings.subtitle")}
                </p>
            </div>

            {subscription && (subscription.tier !== "free" || subscription.status === "active") && (
                <Card className="mb-8">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                                    <Crown className="h-6 w-6 text-yellow-500" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl">
                                        {t("membership_settings.current_plan")}
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
                                    {t("membership_settings.start_date")}
                                </p>
                                <p className="font-semibold">
                                    {subscription.currentPeriodStart > 0
                                        ? new Date(subscription.currentPeriodStart).toLocaleDateString()
                                        : "—"}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">
                                    {t("membership_settings.expiry_date")}
                                </p>
                                <p className="font-semibold">
                                    {subscription.currentPeriodEnd > 0
                                        ? new Date(subscription.currentPeriodEnd).toLocaleDateString()
                                        : "—"}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">
                                    {t("membership_settings.auto_renew")}
                                </p>
                                <p className="font-semibold">
                                    {subscription.autoRenew
                                        ? t("membership_settings.auto_renew_on")
                                        : t("membership_settings.auto_renew_off")}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {tokenUsage && (
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            {t("membership_settings.ai_usage")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm text-muted-foreground">
                                        {t("membership_settings.used")}
                                    </span>
                                    <span className="text-sm font-semibold">
                                        {tokenUsage.used.toLocaleString()} / {tokenUsage.total.toLocaleString()}
                                    </span>
                                </div>
                                <Progress value={(tokenUsage.used / Math.max(tokenUsage.total, 1)) * 100} />
                            </div>
                            <div className="grid md:grid-cols-2 gap-4 pt-2">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    <span className="text-sm">
                                        {t("membership_settings.remaining")}: {tokenUsage.remaining.toLocaleString()}
                                    </span>
                                </div>
                                {(tokenUsage.periodEndsAt ?? tokenUsage.resetAt) > 0 && (
                                    <div className="flex items-center gap-2">
                                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                                        <span className="text-sm">
                                            {t("membership_settings.expiry_date")}:{" "}
                                            {new Date(tokenUsage.periodEndsAt ?? tokenUsage.resetAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="mb-4">
                <h2 className="text-2xl font-bold mb-2">
                    {t("membership_settings.upgrade_title")}
                </h2>
                <p className="text-muted-foreground">
                    {t("membership_settings.upgrade_desc")}
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {plans.map((plan) => (
                    <PlanCard
                        key={plan.id}
                        plan={plan}
                        isCurrent={subscription?.planId === plan.id}
                        onSubscribe={onSubscribe}
                        loading={false}
                    />
                ))}
            </div>

            {subscription && subscription.status === "active" && (
                <div className="mt-8 flex gap-4 justify-center">
                    <Button variant="outline" onClick={onCancelSubscription}>
                        {t("membership_settings.cancel_subscription")}
                    </Button>
                    <Button variant="outline" onClick={() => router.push("/vip")}>
                        {t("membership_settings.change_plan")}
                    </Button>
                </div>
            )}

            {selectedPlan && (
                <PaymentDialog
                    open={paymentDialogOpen}
                    onOpenChange={setPaymentDialogOpen}
                    planId={selectedPlan.id}
                    planName={
                        selectedPlan.name[language as keyof typeof selectedPlan.name] ||
                        selectedPlan.name.en
                    }
                    amount={selectedPlan.price}
                    currency={selectedPlan.currency}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                />
            )}
        </div>
    );
}
