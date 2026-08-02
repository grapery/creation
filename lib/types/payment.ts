// Payment method types
export enum PaymentMethod {
    STRIPE = 'stripe',
    ALIPAY = 'alipay',
    WECHAT = 'wechat',
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

// Payment request — matches vippay CreatePaymentRequest
export interface PaymentRequest {
    userId: string;
    planId: string;
    amount: number; // smallest currency unit (cents / fen)
    method: PaymentMethod;
    currency?: string;
    metadata?: Record<string, unknown>;
}

// Raw vippay create-payment data payload
export interface PaymentCreateData {
    id: string;
    clientSecret?: string;
    qrCodeURL?: string;
    publishableKey?: string;
    amount: number;
    currency: string;
    status: PaymentStatus | string;
    method: PaymentMethod | string;
    createdAt: number;
    metadata?: Record<string, unknown>;
}

// Normalized payment response for UI
export interface PaymentResponse {
    success: boolean;
    paymentId?: string;
    clientSecret?: string;
    publishableKey?: string;
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
    nextAction?: unknown;
}

