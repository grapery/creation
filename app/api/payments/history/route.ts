import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8080';

export async function GET(req: NextRequest) {
    try {
        // Verify authentication
        const authHeader = req.headers.get('authorization');
        if (!authHeader) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get('limit') || '20');
        const offset = parseInt(searchParams.get('offset') || '0');
        const status = searchParams.get('status');
        const method = searchParams.get('method');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        // Build query parameters
        const queryParams = new URLSearchParams({
            limit: limit.toString(),
            offset: offset.toString(),
        });

        if (status) queryParams.append('status', status);
        if (method) queryParams.append('method', method);
        if (startDate) queryParams.append('startDate', startDate);
        if (endDate) queryParams.append('endDate', endDate);

        // Fetch from backend - using a placeholder userId for now
        // In production, extract userId from auth token
        const userId = 'user_placeholder';
        const response = await fetch(
            `${BACKEND_URL}/api/users/${userId}/payments?${queryParams.toString()}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': authHeader,
                },
            }
        );

        if (!response.ok) {
            // If backend returns 404 or error, return empty data for now
            return NextResponse.json({
                payments: [],
                total: 0,
                page: Math.floor(offset / limit) + 1,
                limit,
            });
        }

        const data = await response.json();

        return NextResponse.json({
            payments: data.payments || [],
            total: data.total || 0,
            page: Math.floor(offset / limit) + 1,
            limit,
        });
    } catch (error: any) {
        console.error('[API /api/payments/history] Error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch payment history' },
            { status: 500 }
        );
    }
}
