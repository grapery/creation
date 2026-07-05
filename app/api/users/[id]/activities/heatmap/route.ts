import { NextResponse } from "next/server";

/** Backend removed activity heatmap — return empty payload for legacy clients. */
export async function GET() {
    return NextResponse.json({
        code: 1,
        message: "success",
        data: { data: [], totalCount: 0 },
    });
}
