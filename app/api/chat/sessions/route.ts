import { NextRequest, NextResponse } from "next/server";
import { graperyV1, isConnectionError, backendUnavailableResponse } from "@/lib/bff-backend";

/** Proxy chat sessions to Grapery /api/v1/chat/sessions */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const qs = searchParams.toString();
        const authHeader = request.headers.get("authorization");
        const url = graperyV1(`/chat/sessions${qs ? `?${qs}` : ""}`);
        const res = await fetch(url, {
            headers: { Authorization: authHeader || "" },
            cache: "no-store",
        });
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        console.error("Error fetching chat sessions:", error);
        if (isConnectionError(error)) return backendUnavailableResponse();
        return NextResponse.json(
            { code: 500, message: "Failed to fetch chat sessions" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const authHeader = request.headers.get("authorization");
        const url = graperyV1("/chat/sessions");
        const res = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: authHeader || "",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
            cache: "no-store",
        });
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        console.error("Error creating chat session:", error);
        if (isConnectionError(error)) return backendUnavailableResponse();
        return NextResponse.json(
            { code: 500, message: "Failed to create chat session" },
            { status: 500 }
        );
    }
}
