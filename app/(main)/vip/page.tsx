"use client";

import { useEffect, useState } from "react";
import { vip, VIPPlan, MembershipPlan } from "@/lib/api/vip";
import { PlanCard } from "@/components/vip/plan-card";
import { PaymentDialog } from "@/components/payment/payment-dialog";
import { useAuth } from "@/providers/auth-provider";
import { useTranslation } from "@/providers/language-provider";
import { Loader2, Crown } from "lucide-react";
import { useRouter } from "next/navigation";
import { showSuccess, showError } from "@/lib/toast-utils";

export default function VIPPage() {
    const { t, language } = useTranslation();
    const { user, refreshUser } = useAuth();
    const router = useRouter();
    const [plans, setPlans] = useState<MembershipPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);
    const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
    const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);

    useEffect(() => {
        async function load() {
            try {
                const [res, sub] = await Promise.all([
                    vip.getPlans(),
                    vip.getSubscription().catch(() => null),
                ]);
                setPlans(res);
                if (sub?.planId) {
                    setCurrentPlanId(sub.planId);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const onSubscribe = (plan: MembershipPlan) => {
        setSelectedPlan(plan);
        setPaymentDialogOpen(true);
    };

    const handlePaymentSuccess = async (paymentId: string) => {
        // Refresh user data to get updated membership status
        await refreshUser?.();

        const planName = selectedPlan?.name[language as keyof typeof selectedPlan.name] || selectedPlan?.name.en;
        const successMessage = language === 'zh-Hans'
            ? `成功订阅 ${planName}！`
            : language === 'ja'
            ? `${planName}に正常に購読されました！`
            : `Successfully subscribed to ${planName}!`;

        showSuccess(successMessage);
        router.push('/profile');
    };

    const handlePaymentError = (error: string) => {
        const errorMessage = language === 'zh-Hans'
            ? `支付失败: ${error}`
            : language === 'ja'
            ? `支払いに失敗しました: ${error}`
            : `Payment failed: ${error}`;
        showError(errorMessage);
    };

    return (
        <main className="flex-1 container max-w-6xl px-4 py-6 md:px-6 mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
                <div className="mx-auto h-16 w-16 rounded-full bg-yellow-500/10 flex items-center justify-center mb-6">
                    <Crown className="h-8 w-8 text-yellow-500" />
                </div>
                <h1 className="text-4xl font-bold">{t("vip.upgrade_title")}</h1>
                <p className="text-xl text-muted-foreground">{t("vip.upgrade_subtitle")}</p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map(plan => (
                        <PlanCard
                            key={plan.id}
                            plan={plan}
                            isCurrent={currentPlanId === plan.id}
                            onSubscribe={onSubscribe}
                            loading={false}
                        />
                    ))}
                </div>
            )}

            {/* Payment Dialog */}
            {selectedPlan && (
                <PaymentDialog
                    open={paymentDialogOpen}
                    onOpenChange={setPaymentDialogOpen}
                    planId={selectedPlan.id}
                    planName={selectedPlan.name[language as keyof typeof selectedPlan.name] || selectedPlan.name.en}
                    amount={selectedPlan.price}
                    currency={selectedPlan.currency}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                />
            )}
        </main>
    );
}
