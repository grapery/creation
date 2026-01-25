import { NextRequest, NextResponse } from 'next/server';

// This is a Next.js API route that proxies to the backend service
// Backend URL from environment variable or default
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080';

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const userId = params.id;

        // Get the authorization header from the incoming request
        const authHeader = request.headers.get('authorization');

        // Forward the request to the backend service
        const backendUrl = `${BACKEND_URL}/api/users/${userId}/follow`;

        const response = await fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Authorization': authHeader || '',
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
            return NextResponse.json(
                { code: response.status, message: errorData.message || 'Failed to follow user' },
                { status: response.status }
            );
        }

        const data = await response.json();

        return NextResponse.json({
            code: 0,
            message: 'success',
            data: data,
        });
    } catch (error) {
        console.error('Error following user:', error);
        return NextResponse.json(
            { code: 500, message: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const userId = params.id;

        // Get the authorization header from the incoming request
        const authHeader = request.headers.get('authorization');

        // Forward the request to the backend service
        const backendUrl = `${BACKEND_URL}/api/users/${userId}/follow`;

        const response = await fetch(backendUrl, {
            method: 'DELETE',
            headers: {
                'Authorization': authHeader || '',
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
            return NextResponse.json(
                { code: response.status, message: errorData.message || 'Failed to unfollow user' },
                { status: response.status }
            );
        }

        const data = await response.json();

        return NextResponse.json({
            code: 0,
            message: 'success',
            data: data,
        });
    } catch (error) {
        console.error('Error unfollowing user:', error);
        return NextResponse.json(
            { code: 500, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
