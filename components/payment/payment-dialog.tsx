"use client";

import { useState, useEffect, useCallback, FormEvent, useRef } from "react";
import Image from "next/image";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, CreditCard } from "lucide-react";
import { PaymentMethod, PaymentStatus } from "@/lib/types/payment";
import { payment } from "@/lib/api/payment";
import { getUserIdFromToken } from "@/lib/api/client";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import {
    Elements,
    PaymentElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import { useTranslation } from "@/providers/language-provider";
import { DialogManager, DialogType, DialogPriority, hideDialog } from "@/lib/dialog-manager";

const PAYMENT_DIALOG_ID = "payment_dialog";

interface PaymentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    planId: string;
    planName: string;
    amount: number;
    currency: string;
    onSuccess?: (paymentId: string) => void;
    onError?: (error: string) => void;
}

function StripeConfirmForm({
    paymentId,
    onSuccess,
    onError,
    onCancel,
}: {
    paymentId: string;
    onSuccess: (paymentId: string) => void;
    onError: (message: string) => void;
    onCancel: () => void;
}) {
    const stripe = useStripe();
    const elements = useElements();
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setSubmitting(true);
        try {
            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                redirect: "if_required",
            });

            if (error) {
                onError(error.message || "Payment confirmation failed");
                return;
            }

            if (paymentIntent && (paymentIntent.status === "succeeded" || paymentIntent.status === "processing")) {
                onSuccess(paymentId);
            } else {
                onError(`Unexpected payment status: ${paymentIntent?.status || "unknown"}`);
            }
        } catch (err: unknown) {
            onError(err instanceof Error ? err.message : "Payment confirmation failed");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <PaymentElement />
            <div className="flex justify-between gap-3 pt-2">
                <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
                    Cancel
                </Button>
                <Button type="submit" disabled={!stripe || submitting}>
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Pay now
                </Button>
            </div>
        </form>
    );
}

function WeChatPayPanel({
    qrCodeURL,
    paymentId,
    amountLabel,
    onSuccess,
    onError,
    onCancel,
}: {
    qrCodeURL: string;
    paymentId: string;
    amountLabel: string;
    onSuccess: (paymentId: string) => void;
    onError: (message: string) => void;
    onCancel: () => void;
}) {
    const [polling, setPolling] = useState(true);
    const stopped = useRef(false);

    useEffect(() => {
        stopped.current = false;
        let attempts = 0;
        const maxAttempts = 90; // ~3 minutes at 2s

        const tick = async () => {
            if (stopped.current) return;
            attempts += 1;
            try {
                const res = await payment.getPaymentStatus(paymentId);
                const status = String(res.status || "").toLowerCase();
                if (status === PaymentStatus.SUCCEEDED || status === "succeeded") {
                    setPolling(false);
                    onSuccess(paymentId);
                    return;
                }
                if (
                    status === PaymentStatus.FAILED ||
                    status === PaymentStatus.CANCELLED ||
                    status === "failed" ||
                    status === "cancelled"
                ) {
                    setPolling(false);
                    onError("WeChat payment failed or was cancelled");
                    return;
                }
            } catch {
                // keep polling through transient errors
            }
            if (attempts >= maxAttempts) {
                setPolling(false);
                onError("Timed out waiting for WeChat payment. If you already paid, refresh membership shortly.");
                return;
            }
            timer = window.setTimeout(tick, 2000);
        };

        let timer = window.setTimeout(tick, 2000);
        return () => {
            stopped.current = true;
            window.clearTimeout(timer);
        };
    }, [paymentId, onSuccess, onError]);

    const qrImg = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(qrCodeURL)}`;

    return (
        <div className="space-y-4 text-center">
            <p className="text-sm text-muted-foreground">
                Scan with WeChat to pay {amountLabel}
            </p>
            <div className="mx-auto w-[220px] h-[220px] rounded-lg border bg-white p-2">
                { }
                <Image src={qrImg} alt="WeChat Pay QR" width={0} height={0} className="w-full h-full" style={{ width: "100%", height: "100%" }} sizes="100vw" />
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                {polling ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Waiting for payment confirmation…
                    </>
                ) : (
                    "Stopped polling"
                )}
            </div>
            <Button type="button" variant="outline" onClick={onCancel} className="w-full">
                Cancel
            </Button>
        </div>
    );
}

export function PaymentDialog({
    open,
    onOpenChange,
    planId,
    planName,
    amount,
    currency,
    onSuccess,
    onError,
}: PaymentDialogProps) {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [wechatQr, setWechatQr] = useState<string | null>(null);
    const [paymentId, setPaymentId] = useState<string>("");
    const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);

    useEffect(() => {
        if (open) {
            DialogManager.show(
                PAYMENT_DIALOG_ID,
                DialogType.PAYMENT,
                DialogPriority.CRITICAL
            );
        } else {
            DialogManager.hide(PAYMENT_DIALOG_ID);
            setClientSecret(null);
            setWechatQr(null);
            setPaymentId("");
            setError("");
            setStripePromise(null);
            setSelectedMethod(null);
        }

        return () => {
            if (open) {
                DialogManager.hide(PAYMENT_DIALOG_ID);
            }
        };
    }, [open]);

    const handleOpenChange = useCallback((newOpen: boolean) => {
        if (!newOpen) {
            hideDialog(PAYMENT_DIALOG_ID);
        }
        onOpenChange(newOpen);
    }, [onOpenChange]);

    const formatAmount = (value: number, code: string) => {
        return `${code.toUpperCase()} ${(value / 100).toFixed(2)}`;
    };

    const planCurrency = (currency || "USD").toUpperCase();
    const isCnyPlan = planCurrency === "CNY";
    const cnyUsdRate = Number(process.env.NEXT_PUBLIC_STRIPE_CNY_USD_RATE || "0.14");
    const stripeChargedAmount = isCnyPlan ? Math.max(50, Math.round((amount / 100) * cnyUsdRate * 100)) : amount;
    const stripeChargedCurrency = isCnyPlan ? "USD" : planCurrency;
    // WeChat charges CNY; convert USD plans for display estimate
    const wechatChargedAmount = isCnyPlan
        ? amount
        : Math.max(1, Math.round((amount / 100) / cnyUsdRate * 100));
    const wechatChargedCurrency = "CNY";

    const startCheckout = async (method: PaymentMethod) => {
        setIsLoading(true);
        setError("");
        setSelectedMethod(method);
        setClientSecret(null);
        setWechatQr(null);

        try {
            const userId = getUserIdFromToken();
            if (!userId) {
                throw new Error("Please sign in to continue");
            }

            const response = await payment.createPayment({
                userId,
                planId,
                amount,
                currency,
                method,
            });

            setPaymentId(response.paymentId || "");

            if (method === PaymentMethod.STRIPE) {
                if (!response.clientSecret) {
                    throw new Error(response.error || "Payment initialization failed");
                }
                const publishableKey =
                    response.publishableKey ||
                    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
                if (!publishableKey) {
                    throw new Error("Stripe publishable key is not configured");
                }
                setStripePromise(loadStripe(publishableKey));
                setClientSecret(response.clientSecret);
                return;
            }

            if (method === PaymentMethod.WECHAT) {
                const qr = response.paymentUrl;
                if (!qr) {
                    throw new Error(response.error || "WeChat Pay QR was not returned");
                }
                setWechatQr(qr);
                return;
            }

            throw new Error("Unsupported payment method");
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Payment failed";
            setError(errorMessage);
            setSelectedMethod(null);
            onError?.(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuccess = useCallback((id: string) => {
        onSuccess?.(id);
        handleOpenChange(false);
    }, [onSuccess, handleOpenChange]);

    const handleConfirmError = useCallback((message: string) => {
        setError(message);
        onError?.(message);
    }, [onError]);

    const showMethodPicker = !clientSecret && !wechatQr;

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Complete Your Purchase</DialogTitle>
                    <DialogDescription>
                        Choose Stripe or WeChat Pay to subscribe to {planName}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <Card className="bg-muted/50">
                        <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">{planName}</p>
                                    <p className="text-sm text-muted-foreground">{t("common.app_name")} Membership</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold">
                                        {formatAmount(amount, planCurrency)}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {error && (
                        <div className="bg-destructive/10 text-destructive p-4 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {showMethodPicker && (
                        <div className="space-y-3">
                            <Card
                                className={`cursor-pointer transition-all hover:shadow-md ${isLoading && selectedMethod === PaymentMethod.STRIPE ? "opacity-70" : ""}`}
                                onClick={() => !isLoading && startCheckout(PaymentMethod.STRIPE)}
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950">
                                            <CreditCard className="h-5 w-5 text-blue-500" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-sm">Card (Stripe)</p>
                                            <p className="text-xs text-muted-foreground">
                                                Credit / debit card
                                                {isCnyPlan
                                                    ? ` · charge ≈ ${formatAmount(stripeChargedAmount, stripeChargedCurrency)}`
                                                    : ""}
                                            </p>
                                        </div>
                                        {isLoading && selectedMethod === PaymentMethod.STRIPE && (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card
                                className={`cursor-pointer transition-all hover:shadow-md ${isLoading && selectedMethod === PaymentMethod.WECHAT ? "opacity-70" : ""}`}
                                onClick={() => !isLoading && startCheckout(PaymentMethod.WECHAT)}
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 rounded-lg bg-green-50 dark:bg-green-950">
                                            <span className="block h-5 w-5 text-center text-sm font-bold leading-5 text-green-600">微</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-sm">微信支付 WeChat Pay</p>
                                            <p className="text-xs text-muted-foreground">
                                                Scan QR with WeChat
                                                {!isCnyPlan
                                                    ? ` · charge ≈ ${formatAmount(wechatChargedAmount, wechatChargedCurrency)}`
                                                    : ` · ${formatAmount(wechatChargedAmount, wechatChargedCurrency)}`}
                                            </p>
                                        </div>
                                        {isLoading && selectedMethod === PaymentMethod.WECHAT && (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {clientSecret && stripePromise ? (
                        <Elements
                            stripe={stripePromise}
                            options={{
                                clientSecret,
                                appearance: { theme: "stripe" },
                            }}
                        >
                            <StripeConfirmForm
                                paymentId={paymentId}
                                onSuccess={handleSuccess}
                                onError={handleConfirmError}
                                onCancel={() => handleOpenChange(false)}
                            />
                        </Elements>
                    ) : null}

                    {wechatQr && paymentId ? (
                        <WeChatPayPanel
                            qrCodeURL={wechatQr}
                            paymentId={paymentId}
                            amountLabel={formatAmount(wechatChargedAmount, wechatChargedCurrency)}
                            onSuccess={handleSuccess}
                            onError={handleConfirmError}
                            onCancel={() => handleOpenChange(false)}
                        />
                    ) : null}

                    {showMethodPicker && (
                        <div className="flex justify-between pt-2">
                            <Button
                                variant="outline"
                                onClick={() => handleOpenChange(false)}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
