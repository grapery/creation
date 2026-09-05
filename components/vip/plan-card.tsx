"use client";

import { MembershipPlan, formatPrice } from "@/lib/api/vip";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Star, Tag } from "lucide-react";
import { useTranslation } from "@/providers/language-provider";

interface PlanCardProps {
    plan: MembershipPlan;
    isCurrent?: boolean;
    onSubscribe: (plan: MembershipPlan) => void;
    loading?: boolean;
}

export function PlanCard({ plan, isCurrent, onSubscribe, loading }: PlanCardProps) {
    const { language, t } = useTranslation();

    // Get localized name and description
    const displayName = plan.name[language as keyof typeof plan.name] || plan.name.en;
    const displayDescription = plan.description[language as keyof typeof plan.description] || plan.description.en;

    // Format price
    const formattedPrice = formatPrice(plan.price, plan.currency);

    // Get cycle text
    const cycleText = plan.cycle === 'monthly' ? t('plan_card.monthly') : t('plan_card.yearly');

    return (
        <Card className={`relative flex flex-col ${
            isCurrent ? 'border-primary shadow-lg scale-105 z-10' : ''
        } ${plan.popular ? 'border-2 border-primary/50' : ''}`}>
            {plan.recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    {t('common.vip.recommended')}
                </div>
            )}
            {plan.popular && !plan.recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    {t('common.vip.popular')}
                </div>
            )}
            {isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-600 text-white text-xs px-3 py-1 rounded-full font-bold">
                    {t('common.vip.current_plan')}
                </div>
            )}

            {plan.discountPercent && plan.discountPercent > 0 && (
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                    {t('common.vip.save')} {plan.discountPercent}%
                </div>
            )}

            <CardHeader className="text-center pb-2">
                <CardTitle className="text-xl">{displayName}</CardTitle>
                <div className="text-3xl font-bold mt-2">
                    {formattedPrice}
                    <span className="text-sm font-normal text-muted-foreground">/{cycleText}</span>
                </div>
                {plan.originalPrice && (
                    <div className="text-sm text-muted-foreground line-through">
                        {formatPrice(plan.originalPrice, plan.currency)}
                    </div>
                )}
                <p className="text-sm text-muted-foreground mt-2">{displayDescription}</p>
                {plan.trialDays && (
                    <div className="text-xs text-green-600 font-semibold mt-1">
                        {plan.trialDays} {t('common.vip.trial_days')}
                    </div>
                )}
            </CardHeader>
            <CardContent className="flex-1">
                <ul className="space-y-3 mt-4">
                    {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-green-500 shrink-0" />
                            <span>{t(`common.vip.features.${feature}`, feature)}</span>
                        </li>
                    ))}
                </ul>

                {/* Limits display */}
                <div className="mt-4 pt-4 border-t space-y-2 text-xs">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">
                            {t('common.vip.ai_quota')}:
                        </span>
                        <span className="font-semibold">
                            {plan.limits.aiQuota === -1 ?
                                t('common.vip.unlimited') :
                                plan.limits.aiQuota.toLocaleString()
                            }
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">
                            {t('common.vip.max_roles')}:
                        </span>
                        <span className="font-semibold">
                            {plan.limits.maxRoles === -1 ?
                                t('common.vip.unlimited') :
                                plan.limits.maxRoles
                            }
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">
                            {t('common.vip.export_quality')}:
                        </span>
                        <span className="font-semibold capitalize">
                            {t(`common.vip.export_quality_${plan.limits.exportQuality}`, plan.limits.exportQuality)}
                        </span>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button
                    className="w-full"
                    variant={isCurrent ? "outline" : "default"}
                    onClick={() => onSubscribe(plan)}
                    disabled={isCurrent || loading}
                >
                    {isCurrent ?
                        t('common.vip.active') :
                        t('common.vip.subscribe_button')
                    }
                </Button>
            </CardFooter>
        </Card>
    );
}
