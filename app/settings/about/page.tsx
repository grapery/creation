"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AboutSettingsPage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to the main about page
        router.replace("/about");
    }, [router]);

    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center">
                <p className="text-muted-foreground">Redirecting to About page...</p>
            </div>
        </div>
    );
}
