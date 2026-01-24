"use client";

import { VIPPlan } from "@/lib/api/vip";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, CheckCircle2 } from "lucide-react";

interface PlanCardProps {
    plan: VIPPlan;
    isCurrent?: boolean;
    onSubscribe: (plan: VIPPlan) => void;
    loading?: boolean;
}

export function PlanCard({ plan, isCurrent, onSubscribe, loading }: PlanCardProps) {
    return (
        <Card className={`relative flex flex-col ${isCurrent ? 'border-primary shadow-lg scale-105 z-10' : ''}`}>
            {isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full font-bold">
                    CURRENT PLAN
                </div>
            )}
            <CardHeader className="text-center pb-2">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="text-3xl font-bold mt-2">
                    {plan.currency === 'USD' ? '$' : plan.currency}
                    {plan.price}
                    <span className="text-sm font-normal text-muted-foreground">/{plan.interval}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
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
            </CardContent>
            <CardFooter>
                <Button
                    className="w-full"
                    variant={isCurrent ? "outline" : "default"}
                    onClick={() => onSubscribe(plan)}
                    disabled={isCurrent || loading}
                >
                    {isCurrent ? "Active" : "Subscribe"}
                </Button>
            </CardFooter>
        </Card>
    );
}
