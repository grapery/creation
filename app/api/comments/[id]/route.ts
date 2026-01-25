import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: commentId } = await params;
        const authHeader = request.headers.get('authorization');

        const body = await request.json();

        const backendUrl = `${BACKEND_URL}/api/comments/${commentId}`;

        const response = await fetch(backendUrl, {
            method: 'PUT',
            headers: {
                'Authorization': authHeader || '',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            let errorMessage = 'Failed to update comment';
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
        console.error('[API /comments/[id]] Exception caught:', error);

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

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: commentId } = await params;
        const authHeader = request.headers.get('authorization');

        const backendUrl = `${BACKEND_URL}/api/comments/${commentId}`;

        const response = await fetch(backendUrl, {
            method: 'DELETE',
            headers: {
                'Authorization': authHeader || '',
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            let errorMessage = 'Failed to delete comment';
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
        console.error('[API /comments/[id]] Exception caught:', error);

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
