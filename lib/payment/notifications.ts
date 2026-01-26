import { PaymentNotificationType } from '@/lib/types/payment';

export interface PaymentNotificationPayload {
    type: PaymentNotificationType;
    paymentId: string;
    amount: number;
    currency: string;
    planId: string;
    userId?: string;
}

/**
 * Send payment notification to user
 */
export async function sendPaymentNotification(
    userId: string,
    payload: PaymentNotificationPayload
): Promise<boolean> {
    try {
        const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';

        const response = await fetch(`${BACKEND_URL}/api/notifications/payment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId,
                type: payload.type,
                data: payload,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to send notification');
        }

        return true;
    } catch (error) {
        console.error('[Payment Notification] Error:', error);
        return false;
    }
}

/**
 * Send payment success notification
 */
export async function sendPaymentSuccessNotification(
    userId: string,
    paymentId: string,
    amount: number,
    currency: string,
    planName: string
): Promise<void> {
    await sendPaymentNotification(userId, {
        type: PaymentNotificationType.PAYMENT_SUCCESS,
        paymentId,
        amount,
        currency,
        planId: planName,
        userId,
    });
}

/**
 * Send payment failed notification
 */
export async function sendPaymentFailedNotification(
    userId: string,
    paymentId: string,
    amount: number,
    currency: string,
    planName: string
): Promise<void> {
    await sendPaymentNotification(userId, {
        type: PaymentNotificationType.PAYMENT_FAILED,
        paymentId,
        amount,
        currency,
        planId: planName,
        userId,
    });
}

/**
 * Send subscription activated notification
 */
export async function sendSubscriptionActivatedNotification(
    userId: string,
    planId: string,
    planName: string
): Promise<void> {
    await sendPaymentNotification(userId, {
        type: PaymentNotificationType.SUBSCRIPTION_ACTIVE,
        paymentId: planId,
        amount: 0,
        currency: 'USD',
        planId: planName,
        userId,
    });
}

/**
 * Send subscription renewed notification
 */
export async function sendSubscriptionRenewedNotification(
    userId: string,
    planId: string,
    amount: number,
    currency: string
): Promise<void> {
    await sendPaymentNotification(userId, {
        type: PaymentNotificationType.SUBSCRIPTION_RENEWED,
        paymentId: planId,
        amount,
        currency,
        planId,
        userId,
    });
}
