import { paymentClient, request } from './client';
import {
    PaymentMethod,
    PaymentRequest,
    PaymentResponse,
    PaymentRecord,
    PaymentStatus,
} from '../types/payment';

// Helper to make requests to payment service
const paymentServiceRequest = async <T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: any
): Promise<T> => {
    return request(endpoint, method, body, paymentClient);
};

export interface PaymentHistoryResponse {
    payments: PaymentRecord[];
    total: number;
    page: number;
    limit: number;
}

export interface PaymentHistoryQuery {
    page?: number;
    limit?: number;
    status?: PaymentStatus;
    method?: PaymentMethod;
    startDate?: number;
    endDate?: number;
}

// Note: Web payment endpoints are on vippay service at /api/vippay/web/payments
// Backend routes:
// POST /api/vippay/web/payments - Create payment
// GET /api/vippay/web/payments/:id - Get payment
// GET /api/vippay/web/payments/user/:userId - Get user payments

export const payment = {
    /**
     * Create a payment
     * Uses /api/vippay/web/payments on payment service
     * Payment provider (stripe/alipay/etc.) is specified in the request data
     */
    createPayment: async (data: PaymentRequest): Promise<PaymentResponse> => {
        return paymentServiceRequest('/api/vippay/web/payments', 'POST', data);
    },

    /**
     * Get payment status
     * Uses /api/vippay/web/payments/:id on payment service
     */
    getPaymentStatus: async (paymentId: string): Promise<{
        status: PaymentStatus;
        payment?: PaymentRecord;
    }> => {
        return paymentServiceRequest(`/api/vippay/web/payments/${paymentId}`);
    },

    /**
     * Get payment history
     * Uses /api/vippay/web/payments/user/:userId on payment service
     */
    getPaymentHistory: async (
        userId: string,
        query: PaymentHistoryQuery = {}
    ): Promise<PaymentHistoryResponse> => {
        const { page = 1, limit = 20, status, method, startDate, endDate } = query;
        const params = new URLSearchParams({
            limit: limit.toString(),
            offset: ((page - 1) * limit).toString(),
        });

        if (status) params.append('status', status);
        if (method) params.append('method', method);
        if (startDate) params.append('startDate', startDate.toString());
        if (endDate) params.append('endDate', endDate.toString());

        return paymentServiceRequest(
            `/api/vippay/web/payments/user/${userId}?${params.toString()}`
        );
    },

    /**
     * Get payment by ID
     */
    getPaymentById: async (paymentId: string): Promise<PaymentRecord> => {
        return paymentServiceRequest(`/api/vippay/web/payments/${paymentId}`);
    },

    // Note: The following methods are NOT IMPLEMENTED in backend
    // They are kept as stubs for future implementation

    /**
     * Cancel a payment
     * @deprecated Not implemented in backend
     */
    cancelPayment: async (_paymentId: string): Promise<{ success: boolean }> => {
        console.warn('Cancel payment is not implemented in backend');
        throw new Error('Not implemented');
    },

    /**
     * Confirm a payment (for Stripe, etc.)
     * @deprecated Not implemented in backend - use webhook instead
     */
    confirmPayment: async (
        _paymentId: string,
        _paymentMethodId?: string
    ): Promise<PaymentResponse> => {
        console.warn('Confirm payment is not implemented in backend - use webhook');
        throw new Error('Not implemented');
    },

    /**
     * Create Stripe payment intent
     * @deprecated Use createPayment with provider: 'stripe' instead
     */
    createStripePayment: async (_planId: string): Promise<{
        clientSecret: string;
        paymentIntentId: string;
        amount: number;
        currency: string;
    }> => {
        console.warn('createStripePayment is deprecated - use createPayment with provider: "stripe"');
        throw new Error('Not implemented - use createPayment with provider: "stripe"');
    },

    /**
     * Create Alipay payment
     * @deprecated Use createPayment with provider: 'alipay' instead
     */
    createAlipayPayment: async (_planId: string): Promise<{
        paymentUrl: string;
        qrCode: string;
        outTradeNo: string;
        orderId: string;
    }> => {
        console.warn('createAlipayPayment is deprecated - use createPayment with provider: "alipay"');
        throw new Error('Not implemented - use createPayment with provider: "alipay"');
    },

    /**
     * Create Google Pay payment
     * @deprecated Use createPayment with provider: 'googlepay' instead
     */
    createGooglePayPayment: async (_planId: string, _paymentData: any): Promise<PaymentResponse> => {
        console.warn('createGooglePayPayment is deprecated - use createPayment with provider: "googlepay"');
        throw new Error('Not implemented - use createPayment with provider: "googlepay"');
    },

    /**
     * Create Apple Pay payment
     * @deprecated Use createPayment with provider: 'applepay' instead
     */
    createApplePayPayment: async (_planId: string, _paymentData: any): Promise<PaymentResponse> => {
        console.warn('createApplePayPayment is deprecated - use createPayment with provider: "applepay"');
        throw new Error('Not implemented - use createPayment with provider: "applepay"');
    },

    /**
     * Request refund
     * @deprecated Not implemented in backend
     */
    requestRefund: async (
        _paymentId: string,
        _reason?: string
    ): Promise<{
        success: boolean;
        refundId?: string;
        error?: string;
    }> => {
        console.warn('Request refund is not implemented in backend');
        throw new Error('Not implemented');
    },

    /**
     * Get payment notifications settings
     * @deprecated Not implemented in backend
     */
    getNotificationSettings: async (): Promise<{
        emailEnabled: boolean;
        pushEnabled: boolean;
        types: string[];
    }> => {
        console.warn('Notification settings are not implemented in backend');
        throw new Error('Not implemented');
    },

    /**
     * Update notification settings
     * @deprecated Not implemented in backend
     */
    updateNotificationSettings: async (_settings: {
        emailEnabled?: boolean;
        pushEnabled?: boolean;
        types?: string[];
    }): Promise<{ success: boolean }> => {
        console.warn('Notification settings are not implemented in backend');
        throw new Error('Not implemented');
    },
};
