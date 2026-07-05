import { NextResponse } from "next/server";

/** Grapery main service base URL for Next.js BFF routes. */
export const BACKEND_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080";

/** Build full URL for authenticated Grapery routes under /api/v1. */
export function graperyV1(path: string): string {
    const normalized = path.startsWith("/") ? path : `/${path}`;
    return `${BACKEND_URL}/api/v1${normalized}`;
}

/** Build full URL for public Grapery routes (no /v1), e.g. /public/stories/trending. */
export function graperyPublic(path: string): string {
    const normalized = path.startsWith("/") ? path : `/${path}`;
    return `${BACKEND_URL}/api${normalized}`;
}

export function isConnectionError(error: unknown): boolean {
    const message = error instanceof Error ? error.message : String(error);
    return (
        message.includes("ECONNREFUSED") ||
        message.includes("ENOTFOUND") ||
        message.includes("Network Error")
    );
}

export function backendUnavailableResponse(): NextResponse {
    return NextResponse.json(
        {
            code: 503,
            message: `Backend service not available at ${BACKEND_URL}`,
        },
        { status: 503 }
    );
}

export function notImplementedResponse(feature: string): NextResponse {
    return NextResponse.json(
        { code: 501, message: `${feature} is not implemented on the backend` },
        { status: 501 }
    );
}
