import { NextRequest, NextResponse } from "next/server";

import { graperyV1, isConnectionError, backendUnavailableResponse } from "@/lib/bff-backend";

/** Legacy route — proxies to dashboard storyboards filtered by draft status. */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await params;
        const authHeader = request.headers.get("authorization");
        const searchParams = new URLSearchParams(request.nextUrl.searchParams);
        searchParams.set("status", "draft");

        const backendUrl = `${graperyV1(`/dashboard/storyboards`)}?${searchParams.toString()}`;

        const response = await fetch(backendUrl, {
            method: "GET",
            headers: {
                Authorization: authHeader || "",
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            let errorMessage = "Failed to fetch drafts";
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

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("[API /users/[id]/drafts] Exception caught:", error);
        if (isConnectionError(error)) {
            return backendUnavailableResponse();
        }
        return NextResponse.json(
            { code: 500, message: "Internal server error" },
            { status: 500 }
        );
    }
}
