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
};
