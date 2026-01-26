// Payment method types
export enum PaymentMethod {
    STRIPE = 'stripe',
    GOOGLE_PAY = 'google_pay',
    APPLE_PAY = 'apple_pay',
    ALIPAY = 'alipay',
}

// Payment status
export enum PaymentStatus {
    PENDING = 'pending',
    PROCESSING = 'processing',
    SUCCEEDED = 'succeeded',
    FAILED = 'failed',
    CANCELLED = 'cancelled',
    REFUNDED = 'refunded',
}

// Payment request
export interface PaymentRequest {
    planId: string;
    method: PaymentMethod;
    currency?: string;
    savePaymentMethod?: boolean;
}

// Payment response
export interface PaymentResponse {
    success: boolean;
    paymentId?: string;
    clientSecret?: string;
    paymentUrl?: string;
    error?: string;
    requiresAction?: boolean;
    nextAction?: {
        type: 'redirect' | 'use_stripe_sdk' | 'verify_with_microdeposits';
        redirectUrl?: string;
    };
}

// Payment record
export interface PaymentRecord {
    id: string;
    userId: string;
    planId: string;
    amount: number;
    currency: string;
    status: PaymentStatus;
    method: PaymentMethod;
    createdAt: number;
    updatedAt: number;
    metadata?: {
        productName?: string;
        productDescription?: string;
        trialDays?: number;
    };
}

// Payment intent (for Stripe)
export interface PaymentIntent {
    id: string;
    amount: number;
    currency: string;
    status: string;
    clientSecret?: string;
    nextAction?: any;
}

// Alipay specific
export interface AlipayResponse {
    url: string;
    qrCode?: string;
    outTradeNo: string;
}

// Notification types
export enum PaymentNotificationType {
    PAYMENT_SUCCESS = 'payment_success',
    PAYMENT_FAILED = 'payment_failed',
    SUBSCRIPTION_ACTIVE = 'subscription_active',
    SUBSCRIPTION_CANCELLED = 'subscription_cancelled',
    SUBSCRIPTION_RENEWED = 'subscription_renewed',
    PAYMENT_REFUNDED = 'payment_refunded',
}
