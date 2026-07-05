import { NextRequest, NextResponse } from 'next/server';

import { graperyV1, isConnectionError, backendUnavailableResponse } from '@/lib/bff-backend';

async function proxyStoryboard(
    request: NextRequest,
    storyboardId: string,
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

    const response = await fetch(graperyV1(`/storyboards/${storyboardId}`), init);

    if (!response.ok) {
        let errorMessage = `Failed to ${method.toLowerCase()} storyboard`;
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

    if (method === 'DELETE') {
        const data = await response.json().catch(() => ({ code: 1, message: 'success' }));
        return NextResponse.json(data);
    }

    const data = await response.json();
    return NextResponse.json(data);
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: storyboardId } = await params;
        return proxyStoryboard(request, storyboardId, 'GET');
    } catch (error) {
        console.error('[API /storyboards/[id]] GET failed:', error);
        if (isConnectionError(error)) return backendUnavailableResponse();
        return NextResponse.json({ code: 500, message: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: storyboardId } = await params;
        return proxyStoryboard(request, storyboardId, 'PUT');
    } catch (error) {
        console.error('[API /storyboards/[id]] PUT failed:', error);
        if (isConnectionError(error)) return backendUnavailableResponse();
        return NextResponse.json({ code: 500, message: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: storyboardId } = await params;
        return proxyStoryboard(request, storyboardId, 'DELETE');
    } catch (error) {
        console.error('[API /storyboards/[id]] DELETE failed:', error);
        if (isConnectionError(error)) return backendUnavailableResponse();
        return NextResponse.json({ code: 500, message: 'Internal server error' }, { status: 500 });
    }
}
