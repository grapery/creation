import { paymentClient, request, getUserIdFromToken } from './client';
import {
    PaymentMethod,
    PaymentRequest,
    PaymentResponse,
    PaymentRecord,
    PaymentStatus,
    PaymentCreateData,
} from '../types/payment';

// Helper to make requests to payment service
const paymentServiceRequest = async <T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: unknown
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

function normalizeCreateResponse(data: PaymentCreateData): PaymentResponse {
    return {
        success: true,
        paymentId: data.id,
        clientSecret: data.clientSecret,
        publishableKey: data.publishableKey,
        paymentUrl: data.qrCodeURL,
    };
}

export const payment = {
    /**
     * Create a payment via vippay POST /api/vippay/web/payments
     * Requires userId, planId, amount (>0), method.
     */
    createPayment: async (data: PaymentRequest): Promise<PaymentResponse> => {
        const userId = data.userId || getUserIdFromToken();
        if (!userId) {
            throw new Error('User must be signed in to create a payment');
        }
        if (!data.planId || !(data.amount > 0)) {
            throw new Error('planId and amount are required');
        }

        const payload: PaymentRequest = {
            userId,
            planId: data.planId,
            amount: data.amount,
            currency: data.currency || 'USD',
            method: data.method,
            metadata: data.metadata,
        };

        const raw = await paymentServiceRequest<PaymentCreateData>(
            '/api/vippay/web/payments',
            'POST',
            payload
        );
        return normalizeCreateResponse(raw);
    },

    getPaymentStatus: async (paymentId: string): Promise<{
        status: PaymentStatus;
        payment?: PaymentRecord;
    }> => {
        const record = await paymentServiceRequest<PaymentRecord>(
            `/api/vippay/web/payments/${paymentId}`
        );
        return {
            status: record.status,
            payment: record,
        };
    },

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

    getPaymentById: async (paymentId: string): Promise<PaymentRecord> => {
        return paymentServiceRequest(`/api/vippay/web/payments/${paymentId}`);
    },
};
