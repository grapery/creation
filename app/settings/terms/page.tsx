"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TermsSettingsPage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to the main terms page
        router.replace("/terms");
    }, [router]);

    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center">
                <p className="text-muted-foreground">Redirecting to Terms of Service...</p>
            </div>
        </div>
    );
}
