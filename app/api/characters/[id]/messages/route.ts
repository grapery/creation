import { NextRequest } from "next/server";

import { notImplementedResponse } from "@/lib/bff-backend";

export async function GET(_request: NextRequest) {
    return notImplementedResponse("Character chat messages");
}
