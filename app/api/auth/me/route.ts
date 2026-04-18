import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080';

export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');

        if (!authHeader) {
            return NextResponse.json(
                { code: -1, message: 'Missing authorization header' },
                { status: 401 }
            );
        }

        // Forward the request to the backend service
        const backendUrl = `${BACKEND_URL}/api/auth/me`;

        const response = await fetch(backendUrl, {
            method: 'GET',
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            let errorMessage = 'Failed to fetch user info';
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorData.msg || errorMessage;
            } catch (e) {}
            return NextResponse.json(
                { code: response.status, message: errorMessage },
                { status: response.status }
            );
        }

        const data = await response.json();
        // Return the backend response as-is (auth/me already returns user data directly)
        return NextResponse.json(data);
    } catch (error) {
        console.error('[API /auth/me] Exception caught:', error);

        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const isConnectionError = errorMessage.includes('ECONNREFUSED') ||
                                  errorMessage.includes('ENOTFOUND');

        if (isConnectionError) {
            return NextResponse.json(
                { code: 503, message: `Backend service not available at ${BACKEND_URL}` },
                { status: 503 }
            );
        }

        return NextResponse.json(
            { code: 500, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
