import { PaymentMethod, PaymentStatus, PaymentRecord } from '@/lib/types/payment';

export interface CreatePaymentData {
    userId: string;
    planId: string;
    amount: number;
    currency: string;
    method: PaymentMethod;
    status: PaymentStatus;
    metadata?: {
        productName?: string;
        productDescription?: string;
        trialDays?: number;
    };
    stripePaymentIntentId?: string;
    alipayOutTradeNo?: string;
}

/**
 * Create a payment record in the database
 */
export async function createPaymentRecord(data: CreatePaymentData): Promise<PaymentRecord> {
    // In production, this would save to your database
    // For now, we'll simulate with a mock implementation
    const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';

    try {
        const response = await fetch(`${BACKEND_URL}/api/payments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Failed to create payment record');
        }

        return await response.json();
    } catch (error) {
        console.error('[Payment Storage] Error creating record:', error);
        // Fallback: return a mock record
        return {
            id: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            userId: data.userId,
            planId: data.planId,
            amount: data.amount,
            currency: data.currency,
            status: data.status,
            method: data.method,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            metadata: data.metadata,
        };
    }
}

/**
 * Update payment status
 */
export async function updatePaymentStatus(
    paymentId: string,
    status: PaymentStatus,
    additionalData?: Partial<PaymentRecord>
): Promise<PaymentRecord | null> {
    const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';

    try {
        const response = await fetch(`${BACKEND_URL}/api/payments/${paymentId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                status,
                ...additionalData,
                updatedAt: Date.now(),
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to update payment status');
        }

        return await response.json();
    } catch (error) {
        console.error('[Payment Storage] Error updating status:', error);
        return null;
    }
}

/**
 * Get payment by ID
 */
export async function getPaymentById(paymentId: string): Promise<PaymentRecord | null> {
    const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';

    try {
        const response = await fetch(`${BACKEND_URL}/api/payments/${paymentId}`);

        if (!response.ok) {
            if (response.status === 404) {
                return null;
            }
            throw new Error('Failed to fetch payment');
        }

        return await response.json();
    } catch (error) {
        console.error('[Payment Storage] Error fetching payment:', error);
        return null;
    }
}

/**
 * Get payment history for a user
 */
export async function getUserPaymentHistory(
    userId: string,
    options: {
        limit?: number;
        offset?: number;
        status?: PaymentStatus;
        method?: PaymentMethod;
    } = {}
): Promise<{ payments: PaymentRecord[]; total: number }> {
    const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';
    const { limit = 20, offset = 0, status, method } = options;

    try {
        const params = new URLSearchParams({
            limit: limit.toString(),
            offset: offset.toString(),
        });

        if (status) params.append('status', status);
        if (method) params.append('method', method);

        const response = await fetch(
            `${BACKEND_URL}/api/users/${userId}/payments?${params.toString()}`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch payment history');
        }

        return await response.json();
    } catch (error) {
        console.error('[Payment Storage] Error fetching history:', error);
        return { payments: [], total: 0 };
    }
}
