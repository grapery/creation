import { NextRequest, NextResponse } from 'next/server';

// VIP payment service runs on port 8060
const VIP_PAY_URL = process.env.VIP_PAY_URL || 'http://127.0.0.1:8060';

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

        // Fetch payment details from vippay service
        const response = await fetch(`${VIP_PAY_URL}/api/vippay/web/payments/${paymentId}`, {
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

        const data = await response.json();
        const payment = data.data || data;

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
        const { status } = body;

        if (!status) {
            return NextResponse.json(
                { error: 'Missing required field: status' },
                { status: 400 }
            );
        }

        // Note: Backend doesn't support PATCH for payment status update
        // Payment status is managed internally by the payment service
        console.warn('[Payment Status] Backend does not support manual status updates');

        // Return current payment status instead
        const response = await fetch(`${VIP_PAY_URL}/api/vippay/web/payments/${paymentId}`, {
            headers: {
                'Authorization': authHeader,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch payment status');
        }

        const data = await response.json();
        const payment = data.data || data;

        return NextResponse.json({
            success: true,
            payment,
            note: 'Payment status updates are handled internally by the payment service',
        });
    } catch (error: any) {
        console.error('[API /api/payments/[id]/status] Error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to update payment status' },
            { status: 500 }
        );
    }
}
