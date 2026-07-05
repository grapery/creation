import { NextRequest, NextResponse } from 'next/server';

import { graperyV1, isConnectionError, backendUnavailableResponse } from '@/lib/bff-backend';

async function proxyStory(
    request: NextRequest,
    storyId: string,
    method: string
) {
    const authHeader = request.headers.get('authorization');
    const init: RequestInit = {
        method,
        headers: {
            Authorization: authHeader || '',
            'Content-Type': 'application/json',
        },
    };

    if (method === 'PUT') {
        init.body = await request.text();
    }

    const response = await fetch(graperyV1(`/stories/${storyId}`), init);

    if (!response.ok) {
        let errorMessage = `Failed to ${method.toLowerCase()} story`;
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorData.msg || errorMessage;
        } catch {
            // ignore
        }
        return NextResponse.json(
            { code: response.status, message: errorMessage },
            { status: response.status }
        );
    }

    const data = await response.json().catch(() => ({ code: 1, message: 'success' }));
    return NextResponse.json(data);
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: storyId } = await params;
        return proxyStory(request, storyId, 'GET');
    } catch (error) {
        console.error('[API /stories/[id]] GET failed:', error);
        if (isConnectionError(error)) return backendUnavailableResponse();
        return NextResponse.json({ code: 500, message: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: storyId } = await params;
        return proxyStory(request, storyId, 'PUT');
    } catch (error) {
        console.error('[API /stories/[id]] PUT failed:', error);
        if (isConnectionError(error)) return backendUnavailableResponse();
        return NextResponse.json({ code: 500, message: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: storyId } = await params;
        return proxyStory(request, storyId, 'DELETE');
    } catch (error) {
        console.error('[API /stories/[id]] DELETE failed:', error);
        if (isConnectionError(error)) return backendUnavailableResponse();
        return NextResponse.json({ code: 500, message: 'Internal server error' }, { status: 500 });
    }
}
