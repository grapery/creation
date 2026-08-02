"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

/** Mock creative chat removed — redirect to real create flow. */
export default function CreateChatRedirectPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/create");
    }, [router]);

    return (
        <div className="min-h-[40vh] flex items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            Redirecting to create…
        </div>
    );
}
