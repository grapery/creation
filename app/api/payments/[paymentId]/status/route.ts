import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8080';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ paymentId: string }> }
) {
    try {
        // Verify authentication
        const authHeader = req.headers.get('authorization');
        if (!authHeader) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { paymentId } = await params;

        // Fetch payment details from backend
        const response = await fetch(`${BACKEND_URL}/api/payments/${paymentId}`, {
            headers: {
                'Authorization': authHeader,
            },
        });

        if (!response.ok) {
            if (response.status === 404) {
                return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
            }
            throw new Error('Failed to fetch payment status');
        }

        const payment = await response.json();

        return NextResponse.json({
            status: payment.status,
            payment,
        });
    } catch (error: any) {
        console.error('[API /api/payments/[id]/status] Error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch payment status' },
            { status: 500 }
        );
    }
}

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ paymentId: string }> }
) {
    try {
        // Verify authentication
        const authHeader = req.headers.get('authorization');
        if (!authHeader) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { paymentId } = await params;
        const body = await req.json();
        const { status, metadata } = body;

        if (!status) {
            return NextResponse.json(
                { error: 'Missing required field: status' },
                { status: 400 }
            );
        }

        // Update payment status in backend
        const response = await fetch(`${BACKEND_URL}/api/payments/${paymentId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader,
            },
            body: JSON.stringify({
                status,
                metadata,
                updatedAt: Date.now(),
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to update payment status');
        }

        const payment = await response.json();

        // Send notification if payment succeeded
        if (status === 'succeeded') {
            const { sendPaymentNotification } = await import('@/lib/payment/notifications');
            const { PaymentNotificationType } = await import('@/lib/types/payment');
            await sendPaymentNotification(payment.userId, {
                type: PaymentNotificationType.PAYMENT_SUCCESS,
                paymentId,
                amount: payment.amount,
                currency: payment.currency,
                planId: payment.planId,
            });
        }

        return NextResponse.json({
            success: true,
            payment,
        });
    } catch (error: any) {
        console.error('[API /api/payments/[id]/status] Error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to update payment status' },
            { status: 500 }
        );
    }
}
