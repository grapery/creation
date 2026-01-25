import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '20');
        const offset = parseInt(searchParams.get('offset') || '0');

        // TODO: Implement actual chat sessions fetching from backend
        // For now, return empty array to avoid 404 errors
        return NextResponse.json({
            sessions: [],
            total: 0,
            limit,
            offset
        });
    } catch (error) {
        console.error("Error fetching chat sessions:", error);
        return NextResponse.json(
            { error: "Failed to fetch chat sessions" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { characterId } = body;

        if (!characterId) {
            return NextResponse.json(
                { error: "characterId is required" },
                { status: 400 }
            );
        }

        // TODO: Implement actual session creation with backend
        return NextResponse.json(
            { error: "Chat feature is not yet implemented" },
            { status: 501 }
        );
    } catch (error) {
        console.error("Error creating chat session:", error);
        return NextResponse.json(
            { error: "Failed to create chat session" },
            { status: 500 }
        );
    }
}
