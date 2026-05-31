import { NextResponse } from "next/server";

import {
    PRIVACY_POLICY_LAST_UPDATED,
    PRIVACY_POLICY_MARKDOWN,
} from "@/lib/legal/privacy-policy";

export async function GET() {
    return NextResponse.json(
        {
            content: PRIVACY_POLICY_MARKDOWN,
            lastUpdated: PRIVACY_POLICY_LAST_UPDATED,
        },
        {
            status: 200,
            headers: {
                "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
            },
        }
    );
}
