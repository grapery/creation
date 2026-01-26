"use client";

import { MembershipPlan, formatPrice } from "@/lib/api/vip";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, CheckCircle2, Star, Tag } from "lucide-react";
import { useTranslation } from "@/providers/language-provider";

interface PlanCardProps {
    plan: MembershipPlan;
    isCurrent?: boolean;
    onSubscribe: (plan: MembershipPlan) => void;
    loading?: boolean;
}

export function PlanCard({ plan, isCurrent, onSubscribe, loading }: PlanCardProps) {
    const { language } = useTranslation();

    // Get localized name and description
    const displayName = plan.name[language as keyof typeof plan.name] || plan.name.en;
    const displayDescription = plan.description[language as keyof typeof plan.description] || plan.description.en;

    // Format price
    const formattedPrice = formatPrice(plan.price, plan.currency);

    // Get cycle text
    const cycleText = {
        month: language === 'zh-Hans' ? '月' : language === 'ja' ? '月' : 'month',
        quarter: language === 'zh-Hans' ? '季' : language === 'ja' ? '3ヶ月' : 'quarter',
        year: language === 'zh-Hans' ? '年' : language === 'ja' ? '年' : 'year',
    }[plan.cycle];

    return (
        <Card className={`relative flex flex-col ${
            isCurrent ? 'border-primary shadow-lg scale-105 z-10' : ''
        } ${plan.popular ? 'border-2 border-primary/50' : ''}`}>
            {plan.recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    RECOMMENDED
                </div>
            )}
            {plan.popular && !plan.recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    POPULAR
                </div>
            )}
            {isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-600 text-white text-xs px-3 py-1 rounded-full font-bold">
                    CURRENT PLAN
                </div>
            )}

            {plan.discountPercent && plan.discountPercent > 0 && (
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                    SAVE {plan.discountPercent}%
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
                        {plan.trialDays} {language === 'zh-Hans' ? '天免费试用' : language === 'ja' ? '日間無料トライアル' : '-day free trial'}
                    </div>
                )}
            </CardHeader>
            <CardContent className="flex-1">
                <ul className="space-y-3 mt-4">
                    {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-green-500 shrink-0" />
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>

                {/* Limits display */}
                <div className="mt-4 pt-4 border-t space-y-2 text-xs">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">
                            {language === 'zh-Hans' ? 'AI 配额' : language === 'ja' ? 'AIクオータ' : 'AI Quota'}:
                        </span>
                        <span className="font-semibold">
                            {plan.limits.aiQuota === -1 ?
                                (language === 'zh-Hans' ? '无限' : language === 'ja' ? '無制限' : 'Unlimited') :
                                plan.limits.aiQuota.toLocaleString()
                            }
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">
                            {language === 'zh-Hans' ? '角色上限' : language === 'ja' ? 'キャラクター上限' : 'Max Roles'}:
                        </span>
                        <span className="font-semibold">
                            {plan.limits.maxRoles === -1 ?
                                (language === 'zh-Hans' ? '无限' : language === 'ja' ? '無制限' : 'Unlimited') :
                                plan.limits.maxRoles
                            }
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">
                            {language === 'zh-Hans' ? '导出质量' : language === 'ja' ? 'エクスポート品質' : 'Export Quality'}:
                        </span>
                        <span className="font-semibold capitalize">
                            {plan.limits.exportQuality}
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
                        (language === 'zh-Hans' ? '当前计划' : language === 'ja' ? '現在のプラン' : 'Active') :
                        (language === 'zh-Hans' ? '订阅' : language === 'ja' ? '購読する' : 'Subscribe')
                    }
                </Button>
            </CardFooter>
        </Card>
    );
}
