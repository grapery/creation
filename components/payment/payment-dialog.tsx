"use client";

import { useState, useEffect, useCallback } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, CreditCard, Smartphone, Apple, Globe } from "lucide-react";
import { PaymentMethod, PaymentResponse } from "@/lib/types/payment";
import { payment } from "@/lib/api/payment";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { useTranslation } from "@/providers/language-provider";
import { DialogManager, DialogType, DialogPriority, hideDialog } from "@/lib/dialog-manager";

// 弹窗ID常量
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

let stripePromise: Promise<Stripe | null>;

const getStripe = () => {
    if (!stripePromise) {
        stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
    }
    return stripePromise;
};

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
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const [paymentResponse, setPaymentResponse] = useState<PaymentResponse | null>(null);

    // 注册到DialogManager
    useEffect(() => {
        if (open) {
            DialogManager.show(
                PAYMENT_DIALOG_ID,
                DialogType.PAYMENT,
                DialogPriority.CRITICAL
            );
        } else {
            DialogManager.hide(PAYMENT_DIALOG_ID);
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

    const formatAmount = (amount: number) => {
        return (amount / 100).toFixed(2);
    };

    const paymentMethods = [
        {
            method: PaymentMethod.STRIPE,
            name: "Card Payment",
            description: "Pay with credit or debit card",
            icon: CreditCard,
            color: "text-blue-500",
            bgColor: "bg-blue-50 dark:bg-blue-950",
        },
        {
            method: PaymentMethod.GOOGLE_PAY,
            name: "Google Pay",
            description: "Fast and secure payment with Google",
            icon: Globe,
            color: "text-green-500",
            bgColor: "bg-green-50 dark:bg-green-950",
        },
        {
            method: PaymentMethod.APPLE_PAY,
            name: "Apple Pay",
            description: "Quick payment with Apple Pay",
            icon: Apple,
            color: "text-gray-700 dark:text-gray-300",
            bgColor: "bg-gray-50 dark:bg-gray-900",
        },
        {
            method: PaymentMethod.ALIPAY,
            name: "Alipay",
            description: "Popular payment method in Asia",
            icon: Smartphone,
            color: "text-blue-600",
            bgColor: "bg-blue-50 dark:bg-blue-950",
        },
    ];

    const handlePayment = async (method: PaymentMethod) => {
        setSelectedMethod(method);
        setIsLoading(true);
        setError("");

        try {
            let response: PaymentResponse;

            switch (method) {
                case PaymentMethod.STRIPE:
                    response = await payment.createPayment({
                        planId,
                        method: PaymentMethod.STRIPE,
                        currency,
                    });

                    if (response.success && response.clientSecret) {
                        setPaymentResponse(response);
                        onSuccess?.(response.paymentId || '');
                        handleOpenChange(false);
                    } else {
                        throw new Error(response.error || "Payment initialization failed");
                    }
                    break;

                case PaymentMethod.GOOGLE_PAY:
                case PaymentMethod.APPLE_PAY:
                    response = await payment.createPayment({
                        planId,
                        method,
                        currency,
                    });

                    if (response.success && response.clientSecret) {
                        setPaymentResponse(response);
                        onSuccess?.(response.paymentId || '');
                        handleOpenChange(false);
                    } else {
                        throw new Error(response.error || "Payment initialization failed");
                    }
                    break;

                case PaymentMethod.ALIPAY:
                    response = await payment.createPayment({
                        planId,
                        method: PaymentMethod.ALIPAY,
                        currency,
                    });

                    if (response.success && response.paymentUrl) {
                        // Redirect to Alipay payment page
                        window.location.href = response.paymentUrl;
                    } else {
                        throw new Error(response.error || "Alipay payment initialization failed");
                    }
                    break;

                default:
                    throw new Error("Unsupported payment method");
            }
        } catch (err: any) {
            const errorMessage = err.message || "Payment failed";
            setError(errorMessage);
            onError?.(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Complete Your Purchase</DialogTitle>
                    <DialogDescription>
                        Choose a payment method to subscribe to {planName}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Order Summary */}
                    <Card className="bg-muted/50">
                        <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">{planName}</p>
                                    <p className="text-sm text-muted-foreground">Voyager Membership</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold">
                                        {currency} {formatAmount(amount)}
                                    </p>
                                    <p className="text-xs text-muted-foreground">One-time payment</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-destructive/10 text-destructive p-4 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Payment Methods */}
                    <div className="space-y-3">
                        <p className="text-sm font-medium">Select Payment Method</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {paymentMethods.map(({ method, name, description, icon: Icon, color, bgColor }) => (
                                <Card
                                    key={method}
                                    className={`cursor-pointer transition-all hover:shadow-md ${
                                        selectedMethod === method ? "ring-2 ring-primary" : ""
                                    }`}
                                    onClick={() => !isLoading && handlePayment(method)}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-start gap-3">
                                            <div className={`p-2 rounded-lg ${bgColor}`}>
                                                <Icon className={`h-5 w-5 ${color}`} />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-semibold text-sm">{name}</p>
                                                <p className="text-xs text-muted-foreground">{description}</p>
                                            </div>
                                            {isLoading && selectedMethod === method && (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Security Note */}
                    <div className="text-center">
                        <p className="text-xs text-muted-foreground">
                            🔒 Secured by SSL encryption. Your payment information is safe.
                        </p>
                    </div>
                </div>

                <div className="flex justify-between pt-4">
                    <Button
                        variant="outline"
                        onClick={() => handleOpenChange(false)}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
