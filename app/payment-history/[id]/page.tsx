"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft } from "lucide-react";
import { payment } from "@/lib/api/payment";
import { PaymentMethod, PaymentStatus, PaymentRecord } from "@/lib/types/payment";
import { formatDistanceToNow } from "date-fns";

export default function PaymentDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const { user } = useAuth();
    const [record, setRecord] = useState<PaymentRecord | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) {
            router.push("/login");
            return;
        }
        if (!id) return;

        let cancelled = false;
        (async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await payment.getPaymentById(id);
                if (!cancelled) setRecord(data);
            } catch (e: unknown) {
                if (!cancelled) {
                    setError(e instanceof Error ? e.message : "Failed to load payment");
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [user, id, router]);

    const getStatusColor = (status: PaymentStatus) => {
        switch (status) {
            case PaymentStatus.SUCCEEDED:
                return "bg-green-500/10 text-green-500 border-green-500/20";
            case PaymentStatus.PENDING:
            case PaymentStatus.PROCESSING:
                return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
            case PaymentStatus.FAILED:
            case PaymentStatus.CANCELLED:
                return "bg-red-500/10 text-red-500 border-red-500/20";
            case PaymentStatus.REFUNDED:
                return "bg-blue-500/10 text-blue-500 border-blue-500/20";
            default:
                return "bg-gray-500/10 text-gray-500 border-gray-500/20";
        }
    };

    const getMethodLabel = (method: PaymentMethod | string) => {
        switch (method) {
            case PaymentMethod.STRIPE:
                return "Card (Stripe)";
            case PaymentMethod.WECHAT:
                return "WeChat Pay";
            case PaymentMethod.ALIPAY:
                return "Alipay";
            default:
                return String(method);
        }
    };

    const formatAmount = (amount: number, currency: string) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currency || "USD",
        }).format(amount / 100);

    if (!user) return null;

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (error || !record) {
        return (
            <div className="space-y-4">
                <Button variant="ghost" size="sm" onClick={() => router.push("/payment-history")}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>
                <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                        {error || "Payment not found"}
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={() => router.push("/payment-history")}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Payment Detail</h2>
                    <p className="text-sm text-muted-foreground font-mono">{record.id}</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="capitalize">
                        {(record.metadata?.productName || record.planId || "Subscription").replace(/_/g, " ")}
                    </CardTitle>
                    <CardDescription>
                        {formatDistanceToNow(record.createdAt, { addSuffix: true })}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <p className="text-sm text-muted-foreground">Amount</p>
                            <p className="text-lg font-semibold">
                                {formatAmount(record.amount, record.currency)}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Status</p>
                            <Badge className={getStatusColor(record.status)}>
                                <span className="capitalize">{record.status}</span>
                            </Badge>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Method</p>
                            <p className="font-medium">{getMethodLabel(record.method)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Plan</p>
                            <p className="font-medium capitalize">{record.planId?.replace(/_/g, " ")}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Created</p>
                            <p className="font-medium">
                                {new Date(record.createdAt).toLocaleString()}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Updated</p>
                            <p className="font-medium">
                                {new Date(record.updatedAt || record.createdAt).toLocaleString()}
                            </p>
                        </div>
                    </div>
                    {record.metadata?.productDescription && (
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Description</p>
                            <p className="text-sm">{record.metadata.productDescription}</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
