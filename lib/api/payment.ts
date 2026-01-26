import { request } from './client';
import {
    PaymentMethod,
    PaymentRequest,
    PaymentResponse,
    PaymentRecord,
    PaymentStatus,
    PaymentNotificationType,
} from '../types/payment';

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

export const payment = {
    /**
     * Create a payment intent
     */
    createPayment: async (data: PaymentRequest): Promise<PaymentResponse> => {
        return request('/api/payments/create', 'POST', data);
    },

    /**
     * Confirm a payment (for Stripe, etc.)
     */
    confirmPayment: async (paymentId: string, paymentMethodId?: string): Promise<PaymentResponse> => {
        return request('/api/payments/confirm', 'POST', {
            paymentId,
            paymentMethodId,
        });
    },

    /**
     * Get payment status
     */
    getPaymentStatus: async (paymentId: string): Promise<{
        status: PaymentStatus;
        payment?: PaymentRecord;
    }> => {
        return request(`/api/payments/${paymentId}/status`);
    },

    /**
     * Cancel a payment
     */
    cancelPayment: async (paymentId: string): Promise<{ success: boolean }> => {
        return request(`/api/payments/${paymentId}/cancel`, 'POST');
    },

    /**
     * Get payment history
     */
    getPaymentHistory: async (query: PaymentHistoryQuery = {}): Promise<PaymentHistoryResponse> => {
        const { page = 1, limit = 20, status, method, startDate, endDate } = query;
        const params = new URLSearchParams({
            limit: limit.toString(),
            offset: ((page - 1) * limit).toString(),
        });

        if (status) params.append('status', status);
        if (method) params.append('method', method);
        if (startDate) params.append('startDate', startDate.toString());
        if (endDate) params.append('endDate', endDate.toString());

        return request(`/api/payments/history?${params.toString()}`);
    },

    /**
     * Get payment by ID
     */
    getPaymentById: async (paymentId: string): Promise<PaymentRecord> => {
        return request(`/api/payments/${paymentId}`);
    },

    /**
     * Create Stripe payment intent
     */
    createStripePayment: async (planId: string): Promise<{
        clientSecret: string;
        paymentIntentId: string;
        amount: number;
        currency: string;
    }> => {
        return request('/api/payments/stripe/create-intent', 'POST', { planId });
    },

    /**
     * Create Alipay payment
     */
    createAlipayPayment: async (planId: string): Promise<{
        paymentUrl: string;
        qrCode: string;
        outTradeNo: string;
        orderId: string;
    }> => {
        return request('/api/payments/alipay/create', 'POST', { planId });
    },

    /**
     * Create Google Pay payment
     */
    createGooglePayPayment: async (planId: string, paymentData: any): Promise<PaymentResponse> => {
        return request('/api/payments/google-pay/create', 'POST', {
            planId,
            paymentData,
        });
    },

    /**
     * Create Apple Pay payment
     */
    createApplePayPayment: async (planId: string, paymentData: any): Promise<PaymentResponse> => {
        return request('/api/payments/apple-pay/create', 'POST', {
            planId,
            paymentData,
        });
    },

    /**
     * Request refund
     */
    requestRefund: async (paymentId: string, reason?: string): Promise<{
        success: boolean;
        refundId?: string;
        error?: string;
    }> => {
        return request(`/api/payments/${paymentId}/refund`, 'POST', { reason });
    },

    /**
     * Get payment notifications settings
     */
    getNotificationSettings: async (): Promise<{
        emailEnabled: boolean;
        pushEnabled: boolean;
        types: PaymentNotificationType[];
    }> => {
        return request('/api/payments/notifications/settings');
    },

    /**
     * Update notification settings
     */
    updateNotificationSettings: async (settings: {
        emailEnabled?: boolean;
        pushEnabled?: boolean;
        types?: PaymentNotificationType[];
    }): Promise<{ success: boolean }> => {
        return request('/api/payments/notifications/settings', 'PUT', settings);
    },
};
