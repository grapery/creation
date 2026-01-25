import { NextRequest, NextResponse } from 'next/server';

// This is a Next.js API route that proxies to the backend service
// Backend URL from environment variable or default
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: userId } = await params;

        // Get the authorization header from the incoming request
        const authHeader = request.headers.get('authorization');

        console.log('[API /users/[id]] Request:', {
            userId,
            hasAuth: !!authHeader,
            authPrefix: authHeader?.substring(0, 20) + '...',
        });

        // Forward the request to the backend service
        const backendUrl = `${BACKEND_URL}/api/users/${userId}`;

        console.log('[API /users/[id]] Fetching from backend:', backendUrl);

        const response = await fetch(backendUrl, {
            method: 'GET',
            headers: {
                'Authorization': authHeader || '',
                'Content-Type': 'application/json',
            },
        });

        console.log('[API /users/[id]] Backend response:', {
            status: response.status,
            ok: response.ok,
            statusText: response.statusText,
        });

        if (!response.ok) {
            // Try to parse error response
            let errorMessage = 'Failed to fetch user profile';
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorData.msg || errorMessage;
                console.log('[API /users/[id]] Error response:', errorData);
            } catch (e) {
                console.log('[API /users/[id]] Could not parse error response');
            }

            return NextResponse.json(
                { code: response.status, message: errorMessage },
                { status: response.status }
            );
        }

        const data = await response.json();
        console.log('[API /users/[id]] Success response data keys:', Object.keys(data));

        // Backend returns: { code: 1, message: "success", data: { user data } }
        // We need to extract the user data and return it in the expected format
        const userData = data.data || data;

        // Map backend field names to frontend expectations
        const mappedUserData = {
            ...userData,
            followerCount: userData.followers || userData.followerCount || 0,
            followingCount: userData.following || userData.followingCount || 0,
            // Remove old field names to avoid confusion
            followers: undefined,
            following: undefined,
        };

        // Return success response with user data
        return NextResponse.json({
            code: 0,
            message: 'success',
            user: mappedUserData,
            isFollowing: false, // TODO: Fetch actual follow status from backend
        });
    } catch (error) {
        console.error('[API /users/[id]] Exception caught:', error);

        // Check if it's a connection error
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const isConnectionError = errorMessage.includes('ECONNREFUSED') ||
                                  errorMessage.includes('ENOTFOUND') ||
                                  errorMessage.includes('Network Error');

        if (isConnectionError) {
            console.error('[API /users/[id]] Backend not available at:', BACKEND_URL);
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
