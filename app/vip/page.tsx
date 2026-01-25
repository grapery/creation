"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import { vip, VIPPlan } from "@/lib/api/vip";
import { PlanCard } from "@/components/vip/plan-card";
import { useAuth } from "@/providers/auth-provider";
import { useTranslation } from "@/providers/language-provider";
import { Loader2, Crown } from "lucide-react";
import { useRouter } from "next/navigation";

export default function VIPPage() {
    const { t } = useTranslation();
    const { user, refreshUser } = useAuth();
    const router = useRouter();
    const [plans, setPlans] = useState<VIPPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [subscribing, setSubscribing] = useState<string | null>(null);

    useEffect(() => {
        async function load() {
            try {
                const res = await vip.getPlans();
                setPlans(res);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const onSubscribe = async (plan: VIPPlan) => {
        setSubscribing(plan.id);
        try {
            // Mock subscription flow
            await new Promise(r => setTimeout(r, 2000));
            alert(`Successfully subscribed to ${plan.name}!`);
            router.push('/profile');
        } catch (e) {
            console.error(e);
            alert("Subscription failed.");
        } finally {
            setSubscribing(null);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1 container max-w-6xl px-4 py-12 mx-auto">
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
                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {plans.map(plan => (
                            <PlanCard
                                key={plan.id}
                                plan={plan}
                                isCurrent={false} // Would check user.vipLevel/planId here
                                onSubscribe={onSubscribe}
                                loading={!!subscribing}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
