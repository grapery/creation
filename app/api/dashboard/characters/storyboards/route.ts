import { NextRequest, NextResponse } from "next/server";

import { graperyV1, isConnectionError, backendUnavailableResponse } from "@/lib/bff-backend";

export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get("authorization");
        const searchParams = request.nextUrl.searchParams;
        const characterId = searchParams.get("characterId");

        if (!characterId) {
            return NextResponse.json(
                { code: 400, message: "characterId query parameter is required" },
                { status: 400 }
            );
        }

        const params = new URLSearchParams(searchParams);
        params.delete("characterId");
        const queryString = params.toString();

        const backendUrl = `${graperyV1(`/characters/${characterId}/storyboards`)}${queryString ? `?${queryString}` : ""}`;

        const response = await fetch(backendUrl, {
            method: "GET",
            headers: {
                Authorization: authHeader || "",
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            let errorMessage = "Failed to fetch character storyboards";
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
        console.error("[API /dashboard/characters/storyboards] Exception caught:", error);
        if (isConnectionError(error)) {
            return backendUnavailableResponse();
        }
        return NextResponse.json(
            { code: 500, message: "Internal server error" },
            { status: 500 }
        );
    }
}
