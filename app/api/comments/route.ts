import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080';

export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');

        // Forward query parameters
        const searchParams = request.nextUrl.searchParams;
        const queryString = searchParams.toString();

        const backendUrl = `${BACKEND_URL}/api/comments${queryString ? `?${queryString}` : ''}`;

        const response = await fetch(backendUrl, {
            method: 'GET',
            headers: {
                'Authorization': authHeader || '',
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            let errorMessage = 'Failed to fetch comments';
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
        return NextResponse.json(data);
    } catch (error) {
        console.error('[API /comments] Exception caught:', error);

        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const isConnectionError = errorMessage.includes('ECONNREFUSED') ||
                                  errorMessage.includes('ENOTFOUND') ||
                                  errorMessage.includes('Network Error');

        if (isConnectionError) {
            return NextResponse.json(
                {
                    code: 503,
                    message: `Backend service not available. Please ensure the backend service is running at ${BACKEND_URL}`
                },
                { status: 503 }
            );
        }

        return NextResponse.json(
            { code: 500, message: 'Internal server error', error: errorMessage },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');

        const body = await request.json();

        const backendUrl = `${BACKEND_URL}/api/comments`;

        const response = await fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Authorization': authHeader || '',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            let errorMessage = 'Failed to create comment';
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
        return NextResponse.json(data);
    } catch (error) {
        console.error('[API /comments] Exception caught:', error);

        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const isConnectionError = errorMessage.includes('ECONNREFUSED') ||
                                  errorMessage.includes('ENOTFOUND') ||
                                  errorMessage.includes('Network Error');

        if (isConnectionError) {
            return NextResponse.json(
                {
                    code: 503,
                    message: `Backend service not available. Please ensure the backend service is running at ${BACKEND_URL}`
                },
                { status: 503 }
            );
        }

        return NextResponse.json(
            { code: 500, message: 'Internal server error', error: errorMessage },
            { status: 500 }
        );
    }
}
