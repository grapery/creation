import { NextResponse } from "next/server";

import {
    TERMS_OF_SERVICE_LAST_UPDATED,
    TERMS_OF_SERVICE_MARKDOWN,
} from "@/lib/legal/terms-of-service";

export async function GET() {
    return NextResponse.json(
        {
            content: TERMS_OF_SERVICE_MARKDOWN,
            lastUpdated: TERMS_OF_SERVICE_LAST_UPDATED,
        },
        {
            status: 200,
            headers: {
                "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
            },
        }
    );
}
