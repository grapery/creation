import { NextResponse } from "next/server";

/** Backend removed user activities — return empty payload for legacy clients. */
export async function GET() {
    return NextResponse.json({
        code: 1,
        message: "success",
        data: { activities: [], count: 0 },
    });
}
