import { NextRequest, NextResponse } from "next/server";

import { graperyPublic, isConnectionError, backendUnavailableResponse } from "@/lib/bff-backend";

export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get("authorization");
        const queryString = request.nextUrl.searchParams.toString();
        const backendUrl = `${graperyPublic("/public/trending/storyboards")}${queryString ? `?${queryString}` : ""}`;

        const response = await fetch(backendUrl, {
            method: "GET",
            headers: {
                Authorization: authHeader || "",
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            let errorMessage = "Failed to fetch trending storyboards";
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorData.msg || errorMessage;
            } catch {
                // ignore parse errors
            }
            return NextResponse.json(
                { code: response.status, message: errorMessage },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("[API /dashboard/trending/storyboards] Exception caught:", error);
        if (isConnectionError(error)) {
            return backendUnavailableResponse();
        }
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json(
            { code: 500, message: "Internal server error", error: errorMessage },
            { status: 500 }
        );
    }
}
