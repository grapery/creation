import { NextRequest, NextResponse } from 'next/server';

// VIP payment service runs on port 8060
const VIP_PAY_URL = process.env.VIP_PAY_URL || 'http://127.0.0.1:8060';

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

        // Build query parameters
        const queryParams = new URLSearchParams({
            limit: limit.toString(),
            offset: offset.toString(),
        });

        if (status) queryParams.append('status', status);
        if (method) queryParams.append('method', method);

        // Extract userId from auth token
        // In production, decode JWT to get userId
        const userId = extractUserIdFromToken(authHeader);
        if (!userId) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        // Fetch from vippay service
        const response = await fetch(
            `${VIP_PAY_URL}/api/vippay/web/payments/user/${userId}?${queryParams.toString()}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': authHeader,
                },
            }
        );

        if (!response.ok) {
            // If backend returns 404 or error, return empty data for now
            console.warn('[Payment History] Backend returned error:', response.status);
            return NextResponse.json({
                payments: [],
                total: 0,
                page: Math.floor(offset / limit) + 1,
                limit,
            });
        }

        const data = await response.json();

        return NextResponse.json({
            payments: data.payments || data.data || [],
            total: data.total || data.data?.length || 0,
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

function extractUserIdFromToken(authHeader: string): string | null {
    try {
        const token = authHeader.replace('Bearer ', '');
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        const payload = JSON.parse(atob(parts[1]));
        return payload.sub || payload.userId || payload.id || null;
    } catch {
        return null;
    }
}
